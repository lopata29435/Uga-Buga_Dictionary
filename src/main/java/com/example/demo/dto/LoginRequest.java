package com.example.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Запрос для входа/регистрации пользователя")
public class LoginRequest {
    @Schema(description = "Имя пользователя", example = "john_doe", required = true)
    private String username;
    
    @Schema(description = "Пароль пользователя", example = "password123", required = true)
    private String password;
}