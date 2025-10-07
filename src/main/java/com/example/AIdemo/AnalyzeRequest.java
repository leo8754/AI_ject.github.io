package com.example.AIdemo;

import java.util.List;

public record AnalyzeRequest(
    String jobPosition,
    List<String> skills
) {}
