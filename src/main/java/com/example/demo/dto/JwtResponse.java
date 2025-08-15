package com.example.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Ответ с JWT токенами")
public class JwtResponse {
    @Schema(description = "Access токен для авторизации API запросов", example = "eyJhbGciOiJIUzI1NiJ9...")
    private String accessToken;

    @Schema(description = "Refresh токен для обновления access токена", example = "550e8400-e29b-41d4-a716-446655440000")
    private String refreshToken;
}
