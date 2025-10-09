package com.example.AIdemo;

import com.example.AIdemo.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;
import java.util.Optional;



public interface UserRepository extends JpaRepository<User, UUID> {
    // 檢查 Email 是否存在 (你目前 Controller 中已有的方法)
    boolean existsByEmail(String email);

    // 【✅ 新增】：檢查 Email 或 Phone 是否已存在
Optional<User> findByEmailOrPhone(String email, String phone);
    // 【新增】：用於在發生重複時，取得現有用戶的資訊，以便更詳細地說明是 email 還是 phone 重複
    // Optional<User> findByEmailOrPhone(String email, String phone); // 雖然可用，但用 exists 性能更好

Optional<User> findByEmailVerificationCode(String code);

Optional<User> findByEmail(String email);

Optional<User> findByUsername(@Param("username") String username);



}
