package com.example.demo.exceptions;

public class DictExceptions {

    public static class DictionaryException extends RuntimeException {
        public DictionaryException(String message) {
            super(message);
        }

        public DictionaryException() {
            super("Dictionary operation failed");
        }
    }

    public static class WordNotFoundException extends DictionaryException {
        public WordNotFoundException(String word) {
            super("Word not found: " + word);
        }

        public WordNotFoundException() {
            super("Word not found");
        }
    }

    public static class WordAlreadyExistsException extends DictionaryException {
        public WordAlreadyExistsException(String word) {
            super("Word already exists: " + word);
        }

        public WordAlreadyExistsException() {
            super("Word already exists");
        }
    }

    public static class EmptyWordException extends DictionaryException {
        public EmptyWordException() {
            super("Word cannot be empty");
        }
    }

    public static class EmptyTranslationException extends DictionaryException {
        public EmptyTranslationException() {
            super("Translation cannot be empty");
        }
    }

    public static class UserNotAuthenticatedException extends DictionaryException {
        public UserNotAuthenticatedException() {
            super("User not authenticated");
        }
    }

    public static class InvalidWordException extends DictionaryException {
        public InvalidWordException() {
            super("Invalid word format");
        }

        public InvalidWordException(String message) {
            super(message);
        }
    }

    public static class DictionaryAccessDeniedException extends DictionaryException {
        public DictionaryAccessDeniedException() {
            super("Access to dictionary denied");
        }
    }
}
