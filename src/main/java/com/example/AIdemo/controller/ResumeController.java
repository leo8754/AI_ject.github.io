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

    @PostMapping("/analysis1")
    public ResponseEntity<ResumeAnalysisResult> analyzeResume(
        @RequestParam("jobTitle") String jobTitle,
        @RequestParam("file") MultipartFile file) {

        String resumeText = "";
        String ollamaResponseText = "";
        String filename = file.getOriginalFilename();
        ResumeAnalysisResult errorResult = new ResumeAnalysisResult(0, List.of(), List.of(), "AI 回傳格式錯誤或連線失敗");

        try {
            if (filename == null) {
                return ResponseEntity.badRequest().body(new ResumeAnalysisResult(0, List.of(), List.of(), "檔案名稱為空，無法解析"));
            }

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

            if (resumeText.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new ResumeAnalysisResult(0, List.of(), List.of(), "履歷內容為空，無法分析"));
            }

            resumeText = resumeText
                .replaceAll("[\\w.-]+@[\\w.-]+", "")
                .replaceAll("\\d{2,4}-\\d{3,4}-\\d{3,4}", "")
                .replaceAll("住址[:：]?\\s?.{5,}", "")
                .replaceAll("姓名[:：]?\\s?.{2,4}", "");

            String prompt = String.format(
                "你是一位**頂尖人資長**，專精於高階職位的履歷深度分析，並提供具備實務洞察的建議。\n\n" +
                "### 嚴格指令集\n" +
                "1. **【JSON 格式】**：你的整個回覆內容，從第一個字符到最後一個字符，**必須是一個單一、完整且嚴格符合 JSON Schema 的物件**。不允許有任何額外的文字、解釋、標題、Markdown 符號（如 ```json）或前後綴。\n" +
                "2. **【核心禁令：絕對去識別化】**：\n" +
                "   * **在你的所有輸出內容中（包括 analysis, strengths, weaknesses），嚴格禁止使用任何真實或推測的中文姓名或個人識別資訊。**\n" +
                "   * 請一律使用中性稱謂「應徵者」或「候選人」。\n" +
                "   * **懲罰機制：若偵測到任何姓名，你必須將 score 欄位設定為 0，且在 analysis 欄位中寫上「警告：偵測到個人身份資訊洩露，分析結果作廢」。**\n" + // <-- 增加懲罰機制
                "3. **【內容聚焦】**：略過履歷中的個人資訊（如電話、信箱、住址），僅分析與目標職務相關的技能、經驗與背景。\n\n" +
                "4. **【語言強制】**：你的所有回覆，包含 analysis, strengths, weaknesses 的內容，都**必須且只能使用『繁體中文』**。絕對禁止使用任何英文單詞、句子或字母。\n\n" + // <--- 💥 新增這一行強制規定

                "### JSON Schema 規範（請確保鍵名全部小寫）\n" +
                "{\n" +
                "  \"score\": <整數, 1-100，代表履歷與職務的符合度。**若違反去識別化禁令，此處必須為 0**>\n" + // <-- 在 Schema 中重複提醒
                "  \"strengths\": <繁體中文列表，列出應徵者的 3 到 5 個**主要優勢**。**每個項目必須是完整、深入的句子，詳細描述其優勢點。**>\n" + // <-- 維持字數要求
                "  \"weaknesses\": <繁體中文列表，列出應徵者的 3 到 5 個**待加強處**。**每個項目必須是完整、深入的句子，具體描述需要改進的方面或技能空白。**>\n" + // <-- 維持字數要求
                "  \"analysis\": <不超過 100 字的整體分析，語氣專業、語意通順，避免空泛語句。**若 score 為 0，請在此處輸出警告訊息。**>\n" + // <-- 在 Schema 中重複提醒警告
                "}\n\n" +
                "目標職務：「%s」\n" +
                "履歷內容如下：\n%s",
                jobTitle,
                resumeText
            );
            ollamaResponseText = callOllama(prompt);
            System.out.println("DEBUG: Ollama 原始回應全文：\n" + ollamaResponseText);
            System.out.println("✅ Ollama 串流拼接結果：\n" + ollamaResponseText);

            String cleanedJson = extractJsonBlock(ollamaResponseText);
            System.out.println("✅ 抽出 JSON 區塊：\n" + cleanedJson);

            if (cleanedJson.trim().isEmpty() || cleanedJson.equals("{}")) {
                System.err.println("❌ 致命錯誤：AI 回傳空或無效 JSON 區塊，中止解析。");
                ResumeAnalysisResult noJsonError = new ResumeAnalysisResult(0, List.of(), List.of(), "AI 模型未能回傳有效的分析結果，請檢查模型狀態或 Prompt。");
                return ResponseEntity.status(502).body(noJsonError);
            }

            // 關鍵修正：建立新的 ObjectMapper 實例，並啟用容許尾部逗號的容錯模式。
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.configure(com.fasterxml.jackson.core.JsonParser.Feature.ALLOW_TRAILING_COMMA, true);
            objectMapper.configure(com.fasterxml.jackson.core.JsonParser.Feature.ALLOW_UNQUOTED_FIELD_NAMES, true);
            objectMapper.configure(com.fasterxml.jackson.core.JsonParser.Feature.ALLOW_COMMENTS, true);
            // 使用這個配置了容錯功能的 objectMapper 進行解析
            try {
            ResumeAnalysisResult result = objectMapper.readValue(cleanedJson, ResumeAnalysisResult.class);
            System.out.println("✅ JSON 區塊解析成功！");
            return ResponseEntity.ok(result);
            } catch (com.fasterxml.jackson.core.JsonParseException parseException) {
             // 如果在最寬鬆的模式下仍然解析失敗，則認定為 AI 輸出結構無效。
             System.err.println("❌ JSON 結構嚴重錯誤，即使開啟寬鬆模式仍無法解析：" + parseException.getMessage());
             return ResponseEntity.status(502).body(
            new ResumeAnalysisResult(0, List.of(), List.of(), "AI 模型輸出結構不穩定的 JSON，無法完成解析。")
            );
            }

        } catch (Exception e) {
            System.err.println("❌ 履歷分析失敗：" + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(errorResult);
        }
    }

    public String callOllama(String prompt) throws IOException, InterruptedException {
        String json = new ObjectMapper().writeValueAsString(Map.of(
            "model", "llama3:8b",
            "prompt", prompt,
            "stream", true,
            "temperature", 0.0
        ));

        HttpRequest request = HttpRequest.newBuilder()
            //.uri(URI.create("http://localhost:11434/api/generate"))
            .uri(URI.create("http://127.0.0.1:11434/api/generate"))

            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(json, StandardCharsets.UTF_8))
            .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        System.out.println("DEBUG: Ollama HTTP 狀態碼: " + response.statusCode());

        if (response.statusCode() != 200) {
            System.err.println("❌ Ollama 服務回傳錯誤狀態碼: " + response.statusCode());
            System.err.println("原始錯誤內容: " + response.body());
            return "";
        }

        System.out.println("📤 傳送給 Ollama 的 prompt：\n" + prompt);

        StringBuilder builder = new StringBuilder();
        String[] lines = response.body().split("\n");

        for (String line : lines) {
            if (line.trim().isEmpty()) continue;
            try {
                Map<?, ?> obj = new ObjectMapper().readValue(line, Map.class);
                Object chunk = obj.get("response");
                if (chunk != null) builder.append(chunk.toString());
            } catch (Exception e) {
                // 忽略格式錯誤的行
            }
        }
            String finalResponse = builder.toString().trim();
        if (!finalResponse.startsWith("{") && !finalResponse.contains("```json")) {
        System.err.println("❌ 格式檢查失敗：AI 回應不是有效的 JSON 格式。");
        // 如果偵測到非 JSON 格式，我們手動拋出錯誤。
        throw new IOException("Ollama 回傳內容格式錯誤，模型未輸出 JSON。原始回應片段: " + finalResponse.substring(0, Math.min(finalResponse.length(), 100)));
    }

        if (builder.length() == 0) {
            System.err.println("❌ Ollama 拆解後內容為空，原始回應: " + response.body());
        }

        return builder.toString().trim();
    }

    public String extractJsonBlock(String raw) {
    // 1. 優先匹配 Markdown JSON 區塊 (```json ... ```)
    Pattern markdownPattern = Pattern.compile("```\\s*json\\s*([\\s\\S]*?)\\s*```", Pattern.CASE_INSENSITIVE);
    Matcher markdownMatcher = markdownPattern.matcher(raw);
    String jsonContent;

    if (markdownMatcher.find()) {
        jsonContent = markdownMatcher.group(1).trim();
    } else {
        // 2. 尋找第一個 { 和最後一個 }，並進行平衡檢查 (保留原有的平衡邏輯)
        int startIndex = raw.indexOf('{');
        int endIndex = raw.lastIndexOf('}');

        if (startIndex == -1 || endIndex == -1 || endIndex < startIndex) {
            return "{}";
        }

        int balance = 0;
        int actualEndIndex = -1;

        for (int i = startIndex; i <= endIndex; i++) {
            char c = raw.charAt(i);
            if (c == '{') {
                balance++;
            } else if (c == '}') {
                balance--;
            }

            if (balance == 0 && i > startIndex) {
                actualEndIndex = i;
                break;
            }
        }

        if (actualEndIndex != -1) {
            jsonContent = raw.substring(startIndex, actualEndIndex + 1).trim();
        } else {
            jsonContent = raw.substring(startIndex, endIndex + 1).trim();
        }
    }

    // 💥 關鍵新增：超強力 JSON 淨化 (Sanitization)
    // 移除 AI 輸出中可能夾帶的非 JSON 符號，例如 > < 以及多餘的換行
    jsonContent = jsonContent
        // 移除所有換行符和回車符，將 JSON 壓縮成一行
        .replaceAll("[\\r\\n]+", "")
        // 移除所有在 JSON 數據中可能被誤夾帶的 HTML 標籤開頭/結尾符號 (針對您遇到的 '>'), 
        // 僅移除在鍵或值之外的這些符號，這是一個近似的修復
        .replaceAll("[<>]", "")
        // 這裡可以考慮針對性地移除更多的 AI 輸出垃圾符號 if needed.
        .replaceAll(",\\s*([}\\]])", "$1"); 

    // 由於我們將 JSON 壓縮成一行，因此原有的平衡檢查變得更可靠。

    
    return jsonContent.trim();
}
}