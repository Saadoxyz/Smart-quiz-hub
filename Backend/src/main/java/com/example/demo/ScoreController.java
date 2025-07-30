// ScoreController.java
package com.example.demo;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/scores")
@CrossOrigin(origins = "http://localhost:3000")
public class ScoreController {

    @Autowired
    private ScoreRepository scoreRepository;
    
    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> saveScore(@RequestBody Map<String, Object> scoreData) {
        try {
            Long userId = Long.valueOf(scoreData.get("userId").toString());
            Integer score = Integer.valueOf(scoreData.get("score").toString());
            Integer totalQuestions = Integer.valueOf(scoreData.get("totalQuestions").toString());
            
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Score newScore = new Score(user, score, totalQuestions);
            Score savedScore = scoreRepository.save(newScore);
            
            return ResponseEntity.ok(savedScore);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving score: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Score>> getUserScores(@PathVariable Long userId) {
        try {
            List<Score> scores = scoreRepository.findByUserIdOrderByAttemptDateDesc(userId);
            return ResponseEntity.ok(scores);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/{userId}/best")
    public ResponseEntity<Integer> getUserBestScore(@PathVariable Long userId) {
        try {
            Integer bestScore = scoreRepository.findBestScoreByUserId(userId);
            return ResponseEntity.ok(bestScore != null ? bestScore : 0);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Score>> getAllScores() {
        try {
            List<Score> scores = scoreRepository.findAll();
            return ResponseEntity.ok(scores);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}