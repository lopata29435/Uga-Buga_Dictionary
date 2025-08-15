package com.example.demo.service;

import com.example.demo.exceptions.AuthExceptions;
import com.example.demo.dto.AccessTokenResponse;
import com.example.demo.dto.JwtResponse;
import com.example.demo.model.AccessToken;
import com.example.demo.model.RefreshToken;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, TokenService tokenService) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public JwtResponse register(String username, String password) {
        if (userRepository.existsByUsername(username)) {
            throw new AuthExceptions.ExistingUsername();
        }

        String hashedPassword = passwordEncoder.encode(password);

        User user = User.builder()
                .username(username)
                .passwordHash(hashedPassword)
                .build();

        user = userRepository.save(user);

        RefreshToken refresh = tokenService.generateRefreshToken(user);
        AccessToken access = tokenService.generateAccessToken(user, refresh);
        return new JwtResponse(access.getToken(), refresh.getToken());
    }

    public JwtResponse login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(AuthExceptions.InvalidUsernameOrPasswordException::new);

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new AuthExceptions.InvalidUsernameOrPasswordException();
        }

        RefreshToken refresh = tokenService.generateRefreshToken(user);
        AccessToken access = tokenService.generateAccessToken(user, refresh);
        return new JwtResponse(access.getToken(), refresh.getToken());
    }

    public String logout(String refreshToken) {
        tokenService.deleteRefreshToken(refreshToken);
        return "Logged out successfully";
    }

    public AccessTokenResponse refresh(String token) {
        return new AccessTokenResponse(tokenService.refreshAccessToken(token));
    }
}
