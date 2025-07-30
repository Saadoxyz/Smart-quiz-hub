// ScoreRepository.java
package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ScoreRepository extends JpaRepository<Score, Long> {
    List<Score> findByUserIdOrderByAttemptDateDesc(Long userId);
    
    @Query("SELECT s FROM Score s WHERE s.user.id = ?1 ORDER BY s.score DESC, s.attemptDate DESC")
    List<Score> findBestScoresByUserId(Long userId);
    
    @Query("SELECT MAX(s.score) FROM Score s WHERE s.user.id = ?1")
    Integer findBestScoreByUserId(Long userId);
    
    List<Score> findByUserOrderByAttemptDateDesc(User user);
}