package com.example.AIdemo.controller;

import com.example.AIdemo.ResumeAnalysisResult;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.http.*;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.http.MediaType;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    // 【修正 #1: 重新調整 try-catch 結構】
    @PostMapping("/analyze")
    public ResponseEntity<ResumeAnalysisResult> analyzeResume(
        @RequestParam("jobTitle") String jobTitle,
        @RequestParam("file") MultipartFile file) throws IOException, InterruptedException {

        String resumeText = "";
        String filename = file.getOriginalFilename();
        ResumeAnalysisResult errorResult = new ResumeAnalysisResult(0, List.of(), List.of(), "AI 回傳格式錯誤或連線失敗");

        try {
            if (filename == null) {
                return ResponseEntity.badRequest().body(new ResumeAnalysisResult(0, List.of(), List.of(), "檔案名稱為空，無法解析"));
            }

            // 1. 讀取履歷文字
            if (filename.endsWith(".pdf")) {
                try (PDDocument document = PDDocument.load(file.getInputStream())) {
                    PDFTextStripper stripper = new PDFTextStripper();
                    resumeText = stripper.getText(document);
                }
            } else if (filename.endsWith(".docx")) {
                try (XWPFDocument docx = new XWPFDocument(file.getInputStream())) {
                    XWPFWordExtractor extractor = new XWPFWordExtractor(docx);
                    resumeText = extractor.getText();
                    extractor.close();
                }
            } else {
                return ResponseEntity.badRequest().body(new ResumeAnalysisResult(0, List.of(), List.of(), "不支援的檔案格式"));
            }

            // 2. 動態生成 prompt
            String prompt = String.format(
                "請根據以下履歷內容，分析是否符合「%s」的職務需求，並以 **單一 JSON 區塊** 格式回覆：{ \"score\": 整數, \"strengths\": [\"優勢1\"], \"weaknesses\": [\"弱點1\"], \"analysis\": \"整體說明\" } 履歷如下：\n%s",
                jobTitle,
                resumeText
            );

            // 3. 呼叫 Ollama 並取得拼接好的文字結果
            String ollamaResponseText = callOllama(prompt);
            System.out.println("✅ Ollama 串流拼接結果：\n" + ollamaResponseText);

            // 4. 抽出 JSON 區塊
            String cleanedJson = extractJsonBlock(ollamaResponseText);
            System.out.println("✅ 抽出 JSON 區塊：\n" + cleanedJson);
            
            if (cleanedJson.isEmpty() || cleanedJson.equals("{}")) {
                return ResponseEntity.status(500).body(new ResumeAnalysisResult(0, List.of(), List.of(), "AI 回傳無效 JSON 區塊"));
            }

            // 5. 解析 JSON
            ResumeAnalysisResult result = new ObjectMapper().readValue(cleanedJson, ResumeAnalysisResult.class);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            // 捕獲所有其他錯誤（IO, InterruptedException, JSON 解析失敗等）
            System.err.println("❌ 履歷分析失敗：" + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(errorResult);
        }
    }

    // 【修正 #2: 函數結構與邏輯修正】
    public String callOllama(String prompt) throws IOException, InterruptedException {
        System.out.println("📤 傳送給 Ollama 的 prompt：\n" + prompt);

        // 1. 準備請求 JSON
        String json = new ObjectMapper().writeValueAsString(Map.of(
            "model", "llama3",
            "prompt", prompt,
            "stream", true // 設定為串流
        ));

        // 2. 建立 HTTP 請求
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("http://localhost:11434/api/generate"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(json, StandardCharsets.UTF_8))
            .build();

        // 3. 發送請求並接收回應（整個回應體包含所有 JSON Lines）
        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        // 4. 拆解 JSON Lines 串流，拼接 'response' 欄位內容
        StringBuilder builder = new StringBuilder();
        String[] lines = response.body().split("\n"); // 拆分成 JSON Lines
        
        for (String line : lines) {
            if (line.trim().isEmpty()) continue;
            try {
                // 解析每一行的 JSON 物件
                Map<?, ?> obj = new ObjectMapper().readValue(line, Map.class);
                Object chunk = obj.get("response");
                // 拼接實際的 LLM 回應內容
                if (chunk != null) builder.append(chunk.toString());
            } catch (Exception e) {
                // 忽略非標準的 JSON Lines，例如最後的 done:true 行可能格式不完整
                // System.err.println("❌ 串流 JSON Line 解析失敗: " + e.getMessage()); 
            }
        }

        return builder.toString().trim();
    }
    
    // 【修正 #3: 提取 JSON 區塊的邏輯優化】
    /**
     * 從 Ollama 回傳的文字中，提取被 ` ```json ` 或 `{` 包裹的 JSON 區塊。
     */
    public String extractJsonBlock(String raw) {
        // 嘗試匹配 Markdown 格式（最可靠）
        // 匹配 ```<optional lang>\n{...}\n```
        Pattern markdownPattern = Pattern.compile("```\\s*json\\s*([\\s\\S]*?)\\s*```", Pattern.CASE_INSENSITIVE);
        Matcher markdownMatcher = markdownPattern.matcher(raw);

        if (markdownMatcher.find()) {
            // 找到第一個 JSON 區塊
            return markdownMatcher.group(1).trim();
        }

        // 嘗試匹配單純的 {} 區塊（作為備用方案）
        int start = raw.indexOf("{");
        int end = raw.lastIndexOf("}");
        
        // 確保找到 { 和 }，且 } 在 { 之後
        if (start != -1 && end != -1 && end > start) {
            String jsonBlock = raw.substring(start, end + 1).trim();
            // 檢查是否是多餘的包裝（例如 Ollama 可能重複輸出了分析結果後，又輸出了一堆文字）
            if (jsonBlock.length() > 200) { // 假設 JSON 夠長
                 // 這裡可以選擇截斷，但先返回全部
            }
            return jsonBlock;
        }

        return "{}"; // 回傳空 JSON，避免解析失敗
    }
}