package com.example.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Запрос для добавления/обновления слова в словаре")
public class WordRequest {
    @Schema(description = "Слово", example = "hello", required = true)
    private String word;
    
    @Schema(description = "Перевод слова", example = "привет", required = true)
    private String translation;
    
    @Schema(description = "Пример предложения", example = "Hello, how are you?")
    private String exampleSentence;
}
