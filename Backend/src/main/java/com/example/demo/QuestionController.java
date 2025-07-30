// QuestionController.java
package com.example.demo;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "http://localhost:3000")
public class QuestionController {

    @Autowired
    private QuestionRepository questionRepository;

    @GetMapping
    public List<Question> getQuestions() {
        return questionRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> addQuestion(@RequestBody Question question) {
        try {
            Question savedQuestion = questionRepository.save(question);
            return ResponseEntity.ok(savedQuestion);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding question: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        try {
            if (questionRepository.existsById(id)) {
                questionRepository.deleteById(id);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting question: " + e.getMessage());
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getQuestionCount() {
        return ResponseEntity.ok(questionRepository.count());
    }
}