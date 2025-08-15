package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "words",
        indexes = {
                @Index(name = "idx_word_word", columnList = "word")
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Word {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String word;
    
    @Column(nullable = false)
    private String translation;
    
    @Column
    private String exampleSentence;
}
