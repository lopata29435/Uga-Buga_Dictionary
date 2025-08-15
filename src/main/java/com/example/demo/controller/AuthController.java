package com.example.demo.controller;

import com.example.demo.dto.AccessTokenResponse;
import com.example.demo.dto.JwtResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RefreshRequest;
import com.example.demo.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/${api.version}/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/MQAZHdFhKFOTZXugjyXL")
    @Operation(
        summary = "Регистрация нового пользователя",
        description = "Создает нового пользователя и возвращает JWT токены"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Пользователь успешно зарегистрирован",
            content = @Content(schema = @Schema(implementation = JwtResponse.class))),
        @ApiResponse(responseCode = "400", description = "Некорректные данные"),
        @ApiResponse(responseCode = "409", description = "Пользователь уже существует")
    })
    public ResponseEntity<JwtResponse> register(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Данные для регистрации",
                content = @Content(
                    examples = @ExampleObject(
                        value = "{\"username\": \"user123\", \"password\": \"password123\"}"
                    )
                )
            )
            @RequestBody LoginRequest registerRequest) {
        validateLoginRequest(registerRequest);

        JwtResponse response = authService.register(registerRequest.getUsername(), registerRequest.getPassword());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    @Operation(
        summary = "Вход в систему",
        description = "Аутентификация пользователя и получение JWT токенов"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Успешный вход",
            content = @Content(schema = @Schema(implementation = JwtResponse.class))),
        @ApiResponse(responseCode = "401", description = "Неверные учетные данные")
    })
    public ResponseEntity<JwtResponse> login(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Данные для входа",
                content = @Content(
                    examples = @ExampleObject(
                        value = "{\"username\": \"user123\", \"password\": \"password123\"}"
                    )
                )
            )
            @RequestBody LoginRequest loginRequest) {
        validateLoginRequest(loginRequest);

        JwtResponse response = authService.login(loginRequest.getUsername(), loginRequest.getPassword());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(
        summary = "Выход из системы",
        description = "Инвалидация refresh токена и всех связанных access токенов"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Успешный выход"),
        @ApiResponse(responseCode = "400", description = "Некорректный refresh токен")
    })
    public ResponseEntity<Map<String, String>> logout(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Refresh токен для выхода",
                content = @Content(
                    examples = @ExampleObject(
                        value = "{\"refreshToken\": \"550e8400-e29b-41d4-a716-446655440000\"}"
                    )
                )
            )
            @RequestBody RefreshRequest refreshRequest) {
        validateRefreshRequest(refreshRequest);

        String message = authService.logout(refreshRequest.getRefreshToken());

        Map<String, String> response = Map.of("message", message);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    @Operation(
        summary = "Обновление токена",
        description = "Получение нового access токена по refresh токену"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Токен успешно обновлен",
            content = @Content(schema = @Schema(implementation = AccessTokenResponse.class))),
        @ApiResponse(responseCode = "400", description = "Некорректный refresh токен")
    })
    public ResponseEntity<AccessTokenResponse> refresh(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Refresh токен для обновления",
                content = @Content(
                    examples = @ExampleObject(
                        value = "{\"refreshToken\": \"550e8400-e29b-41d4-a716-446655440000\"}"
                    )
                )
            )
            @RequestBody RefreshRequest refreshRequest) {
        validateRefreshRequest(refreshRequest);

        AccessTokenResponse response = authService.refresh(refreshRequest.getRefreshToken());
        return ResponseEntity.ok(response);
    }

    private void validateLoginRequest(LoginRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request body is required");
        }
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (request.getUsername().length() < 3) {
            throw new IllegalArgumentException("Username must be at least 3 characters");
        }
        if (request.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters long");
        }
    }

    private void validateRefreshRequest(RefreshRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request body is required");
        }
        if (request.getRefreshToken() == null || request.getRefreshToken().trim().isEmpty()) {
            throw new IllegalArgumentException("Refresh token is required");
        }
    }
}
