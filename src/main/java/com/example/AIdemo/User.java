package com.example.AIdemo;

import jakarta.persistence.*;


import java.util.UUID;
import java.sql.Types;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
@Access(AccessType.FIELD)
@Entity
@Table(name = "users")
public class User {

    @Id
    @UuidGenerator(style = UuidGenerator.Style.AUTO) 
    @JdbcTypeCode(Types.CHAR) 

    @Column(columnDefinition = "char(36)")
    private UUID id;
    @Column(name = "username", nullable = false, unique = true)
    private String username;
    private String name;
    private String email;
    private String password;
    private String phone;
    private String selectedPosition;
    private boolean emailVerified = false;
    @Column(name = "verification_code",length = 10)
    private String emailVerificationCode;
    private String role = "user";
    //使用者選擇職業和職稱
    @Column(name = "job_category")
    private String jobCategory;
    @Column(name = "job_title")
    private String jobTitle;


    // Getter / Setter 全部加上（可用 IDE 自動產生）
    public String getName() {
    return name;
}
public User() {
    System.out.println("🔥 Hibernate loaded User.class at " + System.currentTimeMillis());
}

public void setName(String name) {
    this.name = name;
}

public String getEmail() {
    return email;
}
public void setEmail(String email) {
    this.email = email;
}

public String getPassword() {
    return password;
}
public void setPassword(String password) {
    this.password = password;
}

public String getPhone() {
    return phone;
}
public void setPhone(String phone) {
    this.phone = phone;
}
public UUID getId() {
    return id;
}
public String getUsername() {
    return username;
}

public void setUsername(String username) {
    this.username = username;
}

public String getSelectedPosition() {
    return selectedPosition;
}
public void setSelectedPosition(String selectedPosition) {
    this.selectedPosition = selectedPosition;
}

public boolean isEmailVerified() {
    return emailVerified;
}
public void setEmailVerified(boolean emailVerified) {
    this.emailVerified = emailVerified;
}
public String getEmailVerificationCode() {
    return emailVerificationCode;
    }
public void setEmailVerificationCode(String emailVerificationCode) {
    this.emailVerificationCode = emailVerificationCode;
    }

public String getRole() {
    return role;
}
public void setRole(String role) {
    this.role = role;
}


public String getJobCategory() { return jobCategory; }
public void setJobCategory(String jobCategory) { this.jobCategory = jobCategory; }

public String getJobTitle() { return jobTitle; }
public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

}


