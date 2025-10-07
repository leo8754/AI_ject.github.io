package com.example.AIdemo;

import java.util.List;

public record ResumeAnalysisResult(
    int score,
    List<String> strengths,
    List<String> weaknesses,
    String analysis
) {}
