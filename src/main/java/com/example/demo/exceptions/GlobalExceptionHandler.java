package com.example.demo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(AuthExceptions.InvalidRefreshTokenException.class)
    public ResponseEntity<Map<String, String>> handleInvalidRefreshToken(AuthExceptions.InvalidRefreshTokenException ex) {
        Map<String, String> body = Map.of(
                "error", "invalid_refresh_token",
                "message", ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    @ExceptionHandler(AuthExceptions.AccessTokenExpiredException.class)
    public ResponseEntity<Map<String, String>> handleAccessTokenExpired(AuthExceptions.AccessTokenExpiredException ex) {
        Map<String, String> body = Map.of(
                "error", "access_token_expired",
                "message", ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    @ExceptionHandler(AuthExceptions.InvalidAccessTokenException.class)
    public ResponseEntity<Map<String, String>> handleInvalidAccessToken(AuthExceptions.InvalidAccessTokenException ex) {
        Map<String, String> body = Map.of(
                "error", "invalid_access_token",
                "message", ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    @ExceptionHandler(AuthExceptions.ExistingUsername.class)
    public ResponseEntity<Map<String, String>> handleExistingUsername(AuthExceptions.ExistingUsername ex) {
        Map<String, String> body = Map.of(
                "error", "username_exists",
                "message", ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    @ExceptionHandler(AuthExceptions.InvalidUsernameOrPasswordException.class)
    public ResponseEntity<Map<String, String>> handleInvalidCredentials(AuthExceptions.InvalidUsernameOrPasswordException ex) {
        Map<String, String> body = Map.of(
                "error", "invalid_credentials",
                "message", ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    @ExceptionHandler(AuthExceptions.AuthException.class)
    public ResponseEntity<Map<String, String>> handleAuthException(AuthExceptions.AuthException ex) {
        Map<String, String> body = Map.of(
                "error", "authentication_error",
                "message", ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntime(RuntimeException ex) {
        Map<String, String> body = Map.of(
                "error", "internal_error",
                "message", ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

    @ExceptionHandler(DictExceptions.WordNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleWordNotFound(DictExceptions.WordNotFoundException ex) {
        Map<String, String> body = Map.of(
                "error", "word_not_found",
                "message", ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(DictExceptions.WordAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleWordAlreadyExists(DictExceptions.WordAlreadyExistsException ex) {
        Map<String, String> body = Map.of(
                "error", "word_already_exists",
                "message", ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    @ExceptionHandler(DictExceptions.InvalidWordException.class)
    public ResponseEntity<Map<String, String>> handleInvalidWord(DictExceptions.InvalidWordException ex) {
        Map<String, String> body = Map.of(
                "error", "invalid_word",
                "message", ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(DictExceptions.EmptyWordException.class)
    public ResponseEntity<Map<String, String>> handleEmptyWord(DictExceptions.EmptyWordException ex) {
        Map<String, String> body = Map.of(
                "error", "empty_word",
                "message", ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(DictExceptions.EmptyTranslationException.class)
    public ResponseEntity<Map<String, String>> handleEmptyTranslation(DictExceptions.EmptyTranslationException ex) {
        Map<String, String> body = Map.of(
                "error", "empty_translation",
                "message", ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(DictExceptions.DictionaryAccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleDictionaryAccessDenied(DictExceptions.DictionaryAccessDeniedException ex) {
        Map<String, String> body = Map.of(
                "error", "dictionary_access_denied",
                "message", ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }

    @ExceptionHandler(DictExceptions.UserNotAuthenticatedException.class)
    public ResponseEntity<Map<String, String>> handleUserNotAuthenticated(DictExceptions.UserNotAuthenticatedException ex) {
        Map<String, String> body = Map.of(
                "error", "user_not_authenticated",
                "message", ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        Map<String, String> body = Map.of(
                "error", "validation_error",
                "message", ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneral(Exception ex) {
        Map<String, String> body = Map.of(
                "error", "internal_server_error",
                "message", "An unexpected error occurred"
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
