package com.example.demo;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "scores")
public class Score {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonManagedReference
    private User user;

    @Column(nullable = false)
    private Integer score;

    @Column(nullable = false)
    private Integer totalQuestions;

    @Column(nullable = false)
    private LocalDateTime attemptDate = LocalDateTime.now();

    // Constructors
    public Score() {}

    public Score(User user, Integer score, Integer totalQuestions) {
        this.user = user;
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.attemptDate = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }

    public LocalDateTime getAttemptDate() { return attemptDate; }
    public void setAttemptDate(LocalDateTime attemptDate) { this.attemptDate = attemptDate; }

    // Helper method for percentage calculation
    public Double getPercentage() {
        return totalQuestions > 0 ? (double) score / totalQuestions * 100 : 0.0;
    }
}