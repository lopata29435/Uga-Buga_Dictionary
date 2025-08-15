package com.example.demo.repository;

import com.example.demo.model.AccessToken;
import com.example.demo.model.RefreshToken;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccessTokenRepository extends JpaRepository<AccessToken,Long> {
    Optional<AccessToken> findByToken(String token);
    void deleteByToken(String token);
    boolean existsByToken(String token);
    void deleteByUserId(Long userId);
    Optional<AccessToken> findByUserId(Long userId);
    List<AccessToken> findAllByUser(User user);
    void deleteAllByRefreshToken(RefreshToken refreshToken);

    @Modifying
    @Query("DELETE FROM AccessToken a WHERE a.expiryDate < :now")
    void deleteExpiredTokens(@Param("now") Instant now);
}
