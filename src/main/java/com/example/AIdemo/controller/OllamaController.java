package com.example.AIdemo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.ai.ollama.OllamaChatClient;
import org.springframework.web.bind.annotation.*;
import com.example.AIdemo.ResumeAnalysisResult;
import com.fasterxml.jackson.databind.ObjectMapper;


@RestController
@RequestMapping("/api/ollama")
public class OllamaController {

    private final OllamaChatClient chatClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public OllamaController(OllamaChatClient chatClient) {
        this.chatClient = chatClient;
    }

    @PostMapping("/analyze")
    public ResumeAnalysisResult analyze(@RequestBody Map<String, Object> payload) {
        String originalPrompt = (String) payload.get("prompt");

        if (originalPrompt == null || originalPrompt.trim().isEmpty()) {
            return new ResumeAnalysisResult(
                0,
                List.of(),
                List.of(),
                "未提供有效的分析內容"
            );
        }

        // 從原始 prompt 抽出職位與履歷內容
        String jobTitle = extractJobTitle(originalPrompt);
        String resumeText = extractResumeText(originalPrompt);

        // 強化 prompt，要求模型填滿所有欄位
        String prompt = """
        請根據以下履歷內容，分析它是否符合「%s」的職務需求，並回傳以下 JSON 格式，所有欄位都必須填寫：

        {
          "score": 整體匹配分數（0~100，請給出具體數字）,
          "strengths": ["列出至少 3 項優勢技能"],
          "weaknesses": ["列出至少 3 項待加強技能"],
          "analysis": "簡短分析文字（不少於 100 字）"
        }

        履歷內容如下：
        %s
        """.formatted(jobTitle, resumeText);

        String response = chatClient.call(prompt);

        if (response == null || response.trim().isEmpty()) {
            return new ResumeAnalysisResult(
                0,
                List.of(),
                List.of(),
                " 模型未回應任何內容"
            );
        }
        System.out.println("模型原始回應：\n" + response);
        try {
            return objectMapper.readValue(response, ResumeAnalysisResult.class);
        } catch (Exception e) {
            System.out.println("LLM 回傳解析失敗：");
            System.out.println("原始回應內容：\n" + response);
            e.printStackTrace();
            return new ResumeAnalysisResult(
                0,
                List.of(),
                List.of(),
                " 無法解析 LLM 回應，請確認模型是否回傳 JSON 格式"
            );
        }
    }

    // 抽出職位名稱
    private String extractJobTitle(String prompt) {
        int start = prompt.indexOf("「");
        int end = prompt.indexOf("」");
        return (start >= 0 && end > start) ? prompt.substring(start + 1, end) : "未知職位";
    }

    // 抽出履歷內容
    private String extractResumeText(String prompt) {
        int index = prompt.indexOf("履歷內容如下：");
        return (index >= 0) ? prompt.substring(index + 7).trim() : "未提供履歷";
    }
}
