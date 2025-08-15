package com.example.demo.service;

import com.example.demo.dto.WordResponse;
import com.example.demo.exceptions.DictExceptions;
import com.example.demo.model.Word;
import com.example.demo.repository.DictionaryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DictionaryService {
    private final DictionaryRepository dictionaryRepository;

    public DictionaryService(DictionaryRepository dictionaryRepository) {
        this.dictionaryRepository = dictionaryRepository;
    }

    public List<WordResponse> getAllWords() {
        return dictionaryRepository.findAll()
                .stream()
                .map(WordResponse::fromWord)
                .toList();
    }

    public WordResponse getWordById(Long id) {
        Word word = dictionaryRepository.findById(id)
                .orElseThrow(DictExceptions.WordNotFoundException::new);
        return WordResponse.fromWord(word);
    }

    public WordResponse getWordByText(String word) {
        validateWordNotEmpty(word);
        Word foundWord = dictionaryRepository.findByWord(word.trim().toLowerCase())
                .orElseThrow(() -> new DictExceptions.WordNotFoundException(word));
        return WordResponse.fromWord(foundWord);
    }

    public WordResponse addWord(String word, String translation, String exampleSentence) {
        validateWordInput(word, translation);

        String normalizedWord = word.trim().toLowerCase();

        if (dictionaryRepository.findByWord(normalizedWord).isPresent()) {
            throw new DictExceptions.WordAlreadyExistsException(word);
        }

        Word newWord = Word.builder()
                .word(normalizedWord)
                .translation(translation.trim())
                .exampleSentence(exampleSentence != null ? exampleSentence.trim() : "")
                .build();

        Word savedWord = dictionaryRepository.save(newWord);
        return WordResponse.fromWord(savedWord);
    }

    public WordResponse updateWord(Long id, String word, String translation, String exampleSentence) {
        validateWordInput(word, translation);

        Word existingWord = dictionaryRepository.findById(id)
                .orElseThrow(DictExceptions.WordNotFoundException::new);

        String normalizedWord = word.trim().toLowerCase();

        // Check if another word with the same name exists (excluding current word)
        Optional<Word> wordWithSameName = dictionaryRepository.findByWord(normalizedWord);
        if (wordWithSameName.isPresent() && !wordWithSameName.get().getId().equals(id)) {
            throw new DictExceptions.WordAlreadyExistsException(word);
        }

        existingWord.setWord(normalizedWord);
        if (translation != null && !translation.trim().isEmpty()) {
            existingWord.setTranslation(translation.trim());
        }
        if (exampleSentence != null) {
            existingWord.setExampleSentence(exampleSentence.trim());
        }

        Word updatedWord = dictionaryRepository.save(existingWord);
        return WordResponse.fromWord(updatedWord);
    }

    public void deleteWord(Long id) {
        Word word = dictionaryRepository.findById(id)
                .orElseThrow(DictExceptions.WordNotFoundException::new);
        dictionaryRepository.delete(word);
    }

    public List<WordResponse> searchWords(String term) {
        if (term == null || term.trim().isEmpty()) {
            return getAllWords();
        }

        String normalizedTerm = term.trim().toLowerCase();
        return dictionaryRepository.findAll()
                .stream()
                .filter(w -> w.getWord().contains(normalizedTerm) ||
                        w.getTranslation().toLowerCase().contains(normalizedTerm))
                .map(WordResponse::fromWord)
                .toList();
    }

    private void validateWordInput(String word, String translation) {
        validateWordNotEmpty(word);
        validateTranslationNotEmpty(translation);
    }

    private void validateWordNotEmpty(String word) {
        if (word == null || word.trim().isEmpty()) {
            throw new DictExceptions.EmptyWordException();
        }
    }

    private void validateTranslationNotEmpty(String translation) {
        if (translation == null || translation.trim().isEmpty()) {
            throw new DictExceptions.EmptyTranslationException();
        }
    }
}
