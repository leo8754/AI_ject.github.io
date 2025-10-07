package com.example.AIdemo.controller;

import com.example.AIdemo.User;
import com.example.AIdemo.UserRepository;
import com.example.AIdemo.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.AIdemo.dto.JobInfoRequest;

import java.util.Map;
import java.util.Optional;

@RestController
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // ✅ 註冊邏輯（驗證碼比對 + 資料儲存）
    @PostMapping("/api/user/create-old")
    public ResponseEntity<?> register(@RequestBody User user) {
        Optional<User> existing = userRepository.findByEmail(user.getEmail());
        if (existing.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("請先發送驗證碼");
        }

        User dbUser = existing.get();

        String inputCode = user.getEmailVerificationCode();
        String storedCode = dbUser.getEmailVerificationCode();

        if (inputCode == null || storedCode == null || !inputCode.equals(storedCode)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("驗證碼錯誤");
        }

        if (dbUser.isEmailVerified()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("此 Email 已完成註冊");
        }

        dbUser.setName(user.getName());
        dbUser.setPassword(user.getPassword()); // 前端已加密 SHA256
        dbUser.setPhone(user.getPhone());
        dbUser.setSelectedPosition(user.getSelectedPosition());
        dbUser.setEmailVerified(true);
        dbUser.setEmailVerificationCode(null);

        userRepository.save(dbUser);
        System.out.println("✅ 註冊成功：" + dbUser.getEmail());

        return ResponseEntity.ok("註冊成功");
    }

    // ✅ 發送驗證碼
    @PostMapping("/api/send-verification-code")
    public ResponseEntity<?> sendVerificationCode(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String code = String.valueOf((int)(Math.random() * 900000) + 100000); // 6 位數

        Optional<User> existing = userRepository.findByEmail(email);
        User user;

        if (existing.isPresent()) {
            user = existing.get();
        } else {
            user = new User();
            user.setEmail(email);
            user.setEmailVerified(false);
        }

        user.setEmailVerificationCode(code);
        userRepository.save(user);
        emailService.sendVerificationEmail(email, code);

        System.out.println("驗證碼已寄出：" + email + " ➜ " + code);
        return ResponseEntity.ok("驗證碼已寄出");
    }
    
    //用戶的職業資訊
    @PostMapping("/api/user/jobInfo")
    public ResponseEntity<?> saveJobInfo(@RequestBody JobInfoRequest request) {
    Optional<User> optionalUser = userRepository.findByUsername(request.getUsername());
    if (optionalUser.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    User user = optionalUser.get();
    user.setJobCategory(request.getJobCategory());
    user.setJobTitle(request.getJobTitle());
    userRepository.save(user);

    return ResponseEntity.ok().build();
}
}
