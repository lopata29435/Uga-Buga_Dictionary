package com.example.demo.service;

import com.example.demo.exceptions.AuthExceptions;
import com.example.demo.model.AccessToken;
import com.example.demo.model.RefreshToken;
import com.example.demo.model.User;
import com.example.demo.repository.AccessTokenRepository;
import com.example.demo.repository.RefreshTokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Date;
import java.util.UUID;
import java.util.function.Function;

@Service
public class TokenService {

    private final AccessTokenRepository accessTokenRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    private final byte[] jwtSecret;

    @Value("${jwt.access.expiry}")
    private long accessTokenExpiryMillis;

    @Value("${jwt.refresh.expiry}")
    private long refreshTokenExpiryMillis;

    public TokenService(AccessTokenRepository accessTokenRepository,
                        RefreshTokenRepository refreshTokenRepository,
                        @Value("${jwt.secret}") String secret) {
        this.accessTokenRepository = accessTokenRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtSecret = secret.getBytes();
    }

    public AccessToken generateAccessToken(User user, RefreshToken refreshToken) {
        Instant now = Instant.now();
        Instant expiry = now.plusMillis(accessTokenExpiryMillis);

        String token = Jwts.builder()
                .subject(user.getUsername())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .claim("jti", UUID.randomUUID().toString())
                .claim("type", "access")
                .signWith(Keys.hmacShaKeyFor(jwtSecret))
                .compact();

        AccessToken access = AccessToken.builder()
                .token(token)
                .user(user)
                .refreshToken(refreshToken)
                .expiryDate(expiry)
                .build();

        accessTokenRepository.save(access);
        return access;
    }

    public RefreshToken generateRefreshToken(User user) {
        Instant now = Instant.now();
        Instant expiry = now.plusMillis(refreshTokenExpiryMillis);

        String token = UUID.randomUUID().toString();

        RefreshToken refreshToken = RefreshToken.builder()
                .token(token)
                .user(user)
                .expiryDate(expiry)
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isTokenPresentInDb(String token) {
        return accessTokenRepository.findByToken(token)
                .filter(accessToken -> accessToken.getExpiryDate().isAfter(Instant.now()))
                .isPresent();
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public boolean validateRefreshToken(String token) {
        return refreshTokenRepository.findByToken(token)
                .filter(r -> r.getExpiryDate().isAfter(Instant.now()))
                .isPresent();
    }

    @Transactional
    public String refreshAccessToken(String refreshTokenStr) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenStr)
                .orElseThrow(AuthExceptions.InvalidRefreshTokenException::new);

        accessTokenRepository.deleteAllByRefreshToken(refreshToken);

        return generateAccessToken(refreshToken.getUser(), refreshToken).getToken();
    }

    @Transactional
    public void deleteAccessToken(String token) {
        accessTokenRepository.deleteByToken(token);
    }

    @Transactional
    public void deleteRefreshToken(String token) {
        refreshTokenRepository.findByToken(token)
                .ifPresent(r -> {
                    accessTokenRepository.deleteAllByRefreshToken(r);
                    refreshTokenRepository.delete(r);
                });
    }

    @Transactional
    public void cleanupExpiredTokens() {
        Instant now = Instant.now();
        accessTokenRepository.deleteExpiredTokens(now);
        refreshTokenRepository.deleteExpiredTokens(now);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts
                    .parser()
                    .verifyWith(Keys.hmacShaKeyFor(jwtSecret))
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            throw new AuthExceptions.AccessTokenExpiredException();
        } catch (Exception e) {
            throw new AuthExceptions.InvalidAccessTokenException();
        }
    }
}