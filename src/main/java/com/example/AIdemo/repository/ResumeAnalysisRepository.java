package com.example.AIdemo.repository;

import com.example.AIdemo.ResumeAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResumeAnalysisRepository extends JpaRepository<ResumeAnalysis, Long> {
    List<ResumeAnalysis> findByUserId(Long userId);//綁使用者ID分析結果
}