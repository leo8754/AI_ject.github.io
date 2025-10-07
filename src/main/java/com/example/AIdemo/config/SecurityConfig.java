package com.example.AIdemo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer; // 🌟 必須新增這個導入

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        
        http
            // 修正: 使用 Lambda 語法配置 CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // 修正: 使用 Lambda 語法禁用 CSRF (替換 .csrf().disable())
            .csrf(AbstractHttpConfigurer::disable) 
            
            // 修正: 使用 Lambda 語法配置授權規則 (替換 .authorizeHttpRequests().anyRequest().permitAll())
            .authorizeHttpRequests(authorize -> authorize
                .anyRequest().permitAll()
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        System.out.println("✅ Spring Security CORS 設定已載入");

        return source;
    }
}