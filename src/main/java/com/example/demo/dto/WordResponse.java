package com.example.demo.dto;

import com.example.demo.model.Word;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Ответ со словом из словаря")
public class WordResponse {
    @Schema(description = "ID слова", example = "1")
    private Long id;

    @Schema(description = "Слово", example = "hello")
    private String word;

    @Schema(description = "Перевод слова", example = "привет")
    private String translation;

    @Schema(description = "Пример предложения", example = "Hello, how are you?")
    private String exampleSentence;

    public static WordResponse fromWord(Word word) {
        return WordResponse.builder()
                .id(word.getId())
                .word(word.getWord())
                .translation(word.getTranslation())
                .exampleSentence(word.getExampleSentence())
                .build();
    }
}
