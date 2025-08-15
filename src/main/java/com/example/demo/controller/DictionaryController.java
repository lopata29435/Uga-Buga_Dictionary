package com.example.demo.controller;

import com.example.demo.dto.WordRequest;
import com.example.demo.dto.WordResponse;
import com.example.demo.service.DictionaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/${api.version}/dictionary")
@SecurityRequirement(name = "bearerAuth")
public class DictionaryController {

    private final DictionaryService dictionaryService;

    public DictionaryController(DictionaryService dictionaryService) {
        this.dictionaryService = dictionaryService;
    }

    @GetMapping("/words")
    @Operation(
        summary = "Получить все слова",
        description = "Возвращает список всех слов в словаре"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Список слов успешно получен"),
        @ApiResponse(responseCode = "401", description = "Недействительный токен авторизации")
    })
    public ResponseEntity<List<WordResponse>> getAllWords() {
        List<WordResponse> response = dictionaryService.getAllWords();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/words/search")
    @Operation(
        summary = "Поиск слов",
        description = "Поиск слов по частичному совпадению в слове или переводе"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Результаты поиска получены"),
        @ApiResponse(responseCode = "401", description = "Недействительный токен авторизации")
    })
    public ResponseEntity<List<WordResponse>> searchWords(
            @Parameter(description = "Поисковый запрос", example = "уга")
            @RequestParam(required = false) String q) {
        List<WordResponse> response = dictionaryService.searchWords(q);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/words/{id}")
    @Operation(
        summary = "Получить слово по ID",
        description = "Возвращает слово по его ID"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Слово найдено"),
        @ApiResponse(responseCode = "401", description = "Недействительный токен авторизации")
    })
    public ResponseEntity<WordResponse> getWordById(
            @Parameter(description = "ID слова", example = "1")
            @PathVariable Long id) {
        WordResponse response = dictionaryService.getWordById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/words/text/{word}")
    @Operation(
        summary = "Получить слово по тексту",
        description = "Возвращает слово по его текстовому значению"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Слово найдено"),
        @ApiResponse(responseCode = "404", description = "Слово не найдено"),
        @ApiResponse(responseCode = "401", description = "Недействительный токен авторизации")
    })
    public ResponseEntity<WordResponse> getWordByText(
            @Parameter(description = "Текст слова", example = "угату")
            @PathVariable String word) {
        WordResponse response = dictionaryService.getWordByText(word);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/words")
    @Operation(
        summary = "Добавить новое слово",
        description = "Создает новое слово в словаре"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Слово успешно создано"),
        @ApiResponse(responseCode = "409", description = "Слово уже существует"),
        @ApiResponse(responseCode = "400", description = "Некорректные данные"),
        @ApiResponse(responseCode = "401", description = "Недействительный токен авторизации")
    })
    public ResponseEntity<WordResponse> addWord(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Данные нового слова",
                content = @Content(
                    examples = @ExampleObject(
                        value = "{\"word\": \"угату\", \"translation\": \"спасибо\", \"exampleSentence\": \"Он сказал: 'угату' за помощь.\"}"
                    )
                )
            )
            @RequestBody WordRequest request) {
        WordResponse response = dictionaryService.addWord(
                request.getWord(),
                request.getTranslation(),
                request.getExampleSentence()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/words/{id}")
    @Operation(
        summary = "Обновить слово",
        description = "Обновляет существующее слово в словаре"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Слово успешно обновлено"),
        @ApiResponse(responseCode = "404", description = "Слово не найдено"),
        @ApiResponse(responseCode = "401", description = "Недействительный токен авторизации")
    })
    public ResponseEntity<WordResponse> updateWord(
            @Parameter(description = "ID слова", example = "1")
            @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Обновленные данные слова",
                content = @Content(
                    examples = @ExampleObject(
                        value = "{\"word\": \"угату\", \"translation\": \"благодарю\", \"exampleSentence\": \"Я ответил ему: 'угату!'\"}"
                    )
                )
            )
            @RequestBody WordRequest request) {
        WordResponse response = dictionaryService.updateWord(
                id,
                request.getWord(),
                request.getTranslation(),
                request.getExampleSentence()
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/words/{id}")
    @Operation(
        summary = "Удалить слово по ID",
        description = "Удаляет слово из словаря по его ID"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Слово успешно удалено"),
        @ApiResponse(responseCode = "404", description = "Слово не найдено"),
        @ApiResponse(responseCode = "401", description = "Недействительный токен авторизации")
    })
    public ResponseEntity<Map<String, String>> deleteWord(
            @Parameter(description = "ID слова", example = "1")
            @PathVariable Long id) {
        dictionaryService.deleteWord(id);

        Map<String, String> response = Map.of(
                "message", "Word deleted successfully",
                "id", id.toString()
        );

        return ResponseEntity.ok(response);
    }
}
