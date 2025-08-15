package com.example.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class TokenCleanupService {

    private static final Logger logger = LoggerFactory.getLogger(TokenCleanupService.class);

    private final TokenService tokenService;

    public TokenCleanupService(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Scheduled(fixedRate = 60000)
    public void cleanupExpiredTokens() {
        logger.info("Starting cleanup of expired tokens...");
        try {
            tokenService.cleanupExpiredTokens();
            logger.info("Successfully cleaned up expired tokens");
        } catch (Exception e) {
            logger.error("Error during token cleanup: {}", e.getMessage(), e);
        }
    }
}
