package com.example.AIdemo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.apache.commons.codec.digest.DigestUtils;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class RegisterController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        // ✅ 檢查 email 或 phone 是否重複
        Optional<User> existingUser = userRepository.findByEmailOrPhone(user.getEmail(), user.getPhone());

        if (existingUser.isPresent()) {
            String existingEmail = existingUser.get().getEmail();
            String existingPhone = existingUser.get().getPhone();

            String message;
            if (user.getEmail().equals(existingEmail) && user.getPhone().equals(existingPhone)) {
                message = "電子郵件和手機號碼都已被註冊。";
            } else if (user.getEmail().equals(existingEmail)) {
                message = "電子郵件 " + user.getEmail() + " 已被註冊。";
            } else if (user.getPhone().equals(existingPhone)) {
                message = "手機號碼 " + user.getPhone() + " 已被註冊。";
            } else {
                message = "用戶已存在，請檢查電子郵件或手機號碼。";
            }

            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                Map.of("success", false, "message", message)
            );
        }

        // ✅ 密碼加密（SHA256）
        String encryptedPassword = DigestUtils.sha256Hex(user.getPassword());
        user.setPassword(encryptedPassword);

        // ✅ 註冊基本欄位
        user.setEmailVerified(false);
        user.setRole("user");

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(
            Map.of("success", true, "message", "註冊成功！", "id", savedUser.getId().toString())
        );
    }
}
