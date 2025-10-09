package com.example.AIdemo;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

// ✅ 轉換回標準的 Java Class
@JsonIgnoreProperties(ignoreUnknown = true) 

public class ResumeAnalysisResult {

    // 1. 屬性 (與 Ollama JSON 欄位名稱完全匹配)
    private int score;
    private List<String> strengths;
    private List<String> weaknesses;
    private String analysis; // 匹配 Ollama 的 "analysis" 欄位

    // 2. 必須提供給 Jackson 的無參數建構子 (No-argument Constructor)
    // 這是 Jackson 處理 JSON 反序列化的基本要求
    public ResumeAnalysisResult() {
    }

    // 3. 完整參數建構子 (方便在 Controller 裡初始化錯誤訊息)
    public ResumeAnalysisResult(int score, List<String> strengths, List<String> weaknesses, String analysis) {
        this.score = score;
        this.strengths = strengths;
        this.weaknesses = weaknesses;
        this.analysis = analysis;
    }

    // 4. 必須提供所有欄位的 Getter (Jackson 用於序列化回傳)
    public int getScore() {
        return score;
    }

    public List<String> getStrengths() {
        return strengths;
    }

    public List<String> getWeaknesses() {
        return weaknesses;
    }

    public String getAnalysis() {
        return analysis;
    }
    
    // 5. 必須提供所有欄位的 Setter (Jackson 用於反序列化接收)
    // 這裡通常是 private 或省略，但為了確保相容性，最好提供
    public void setScore(int score) {
        this.score = score;
    }

    public void setStrengths(List<String> strengths) {
        this.strengths = strengths;
    }

    public void setWeaknesses(List<String> weaknesses) {
        this.weaknesses = weaknesses;
    }

    public void setAnalysis(String analysis) {
        this.analysis = analysis;
    }
}