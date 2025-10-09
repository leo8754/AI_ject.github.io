package com.example.AIdemo.data;

import java.util.List;
import java.util.Map; // 必須導入 Map

public class JobKeywordsData {

    // 修正: 返回類型應為 Map，以便通過職位名稱查找關鍵字列表
    public static Map<String, List<String>> getJobKeywords() {
        // 請根據您的實際需求調整這些資料
        return Map.of(
            // 示例職位和關鍵字
            "軟體工程師", List.of("Java", "Spring Boot", "RESTful API", "SQL", "Git", "單元測試"),
            "資料分析師", List.of("Python", "Pandas", "SQL", "統計分析", "機器學習", "Tableau"),
            "前端工程師", List.of("React", "JavaScript", "HTML/CSS", "Webpack", "Redux", "API整合"),
            "產品經理", List.of("Scrum", "Agile", "市場分析", "用戶訪談", "產品規劃", "Roadmap")
        );
    }
}