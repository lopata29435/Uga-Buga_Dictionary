package com.example.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Ответ с новым access токеном")
public class AccessTokenResponse {
    @Schema(description = "Новый access токен", example = "eyJhbGciOiJIUzI1NiJ9...")
    private String accessToken;
}
