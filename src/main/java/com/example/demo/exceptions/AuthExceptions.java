package com.example.demo.exceptions;

public class AuthExceptions {
    public static class AuthException extends RuntimeException {
        public AuthException(String message) {
            super(message);
        }
    }

    public static class InvalidRefreshTokenException extends AuthException {
        public InvalidRefreshTokenException() {
            super("Invalid refresh token");
        }
    }

    public static class InvalidAccessTokenException extends AuthException {
        public InvalidAccessTokenException() {
            super("Invalid access token");
        }
    }

    public static class AccessTokenExpiredException extends AuthException {
        public AccessTokenExpiredException() {
            super("Access token expired");
        }
    }

    public static class ExistingUsername extends AuthException {
        public ExistingUsername() {
            super("Username already exists");
        }
    }

    public static class InvalidUsernameOrPasswordException extends AuthException {
        public InvalidUsernameOrPasswordException() {
            super("Invalid username or password");
        }
    }

    public static class InvalidTokenException extends RuntimeException {
        public InvalidTokenException(String message) {
            super(message);
        }

        public InvalidTokenException() {
            super("Invalid token");
        }
    }

    public static class UserAlreadyExistsException extends RuntimeException {
        public UserAlreadyExistsException(String message) {
            super(message);
        }

        public UserAlreadyExistsException() {
            super("User already exists");
        }
    }

    public static class UserNotFoundException extends RuntimeException {
        public UserNotFoundException(String message) {
            super(message);
        }

        public UserNotFoundException() {
            super("User not found");
        }
    }

    public static class InvalidCredentialsException extends RuntimeException {
        public InvalidCredentialsException(String message) {
            super(message);
        }

        public InvalidCredentialsException() {
            super("Invalid credentials");
        }
    }
}
