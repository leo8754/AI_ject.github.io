package com.example.AIdemo.service;

import com.example.AIdemo.ResumeAnalysisResult;
import com.example.AIdemo.data.JobKeywordsData;
import org.springframework.ai.chat.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ResumeAnalysisService {

    private final ChatClient chatClient;

    public ResumeAnalysisService(ChatClient chatClient) {
        this.chatClient = chatClient;
        System.out.println("注入的 ChatClient 類型：" + chatClient.getClass().getName());
    }

    public ResumeAnalysisResult analyzeResume(String jobPosition, List<String> userSkills) {
    Map<String, List<String>> allKeywords = JobKeywordsData.getJobKeywords();
    List<String> keywords = allKeywords.get(jobPosition);

    if (keywords == null) {
        throw new IllegalArgumentException("不支援或找不到該職位的關鍵字: " + jobPosition);
    }

    String promptText = buildPrompt(jobPosition, keywords, userSkills);
    Prompt prompt = new Prompt(promptText);

    Object output = chatClient.call(prompt).getResult().getOutput();
    return (ResumeAnalysisResult) output;
}


    private String buildPrompt(String jobPosition, List<String> keywords, List<String> userSkills) {
        return String.format("""
            你是一位專業的履歷分析師，請根據以下資訊分析履歷的技能匹配度。

            【應徵職位】
            %s

            【職位要求的關鍵技能】(共%d個)
            %s

            【履歷中列出的技能】(共%d個)
            %s

            請你以繁體中文回答，並依照以下格式回覆：

            1. 匹配分數（0–100分）
            2. 優勢技能（列出履歷中與職位要求相符的技能）
            3. 待加強技能（列出履歷中缺少但職位需要的技能）
            4. 分析說明（簡要說明匹配情況）
            """,
            jobPosition,
            keywords.size(),
            String.join("、", keywords),
            userSkills.size(),
            String.join("、", userSkills)
        );
    }
}
