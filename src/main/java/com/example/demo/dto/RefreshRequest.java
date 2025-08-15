package com.example.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Запрос для обновления access токена")
public class RefreshRequest {
    @Schema(description = "Refresh токен", example = "550e8400-e29b-41d4-a716-446655440000", required = true)
    private String refreshToken;
}
