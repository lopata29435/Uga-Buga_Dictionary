package com.example.demo.repository;

import com.example.demo.model.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DictionaryRepository extends JpaRepository<Word, Long> {
    Optional<Word> findByWord(String word);
    void deleteByWord(String word);
}