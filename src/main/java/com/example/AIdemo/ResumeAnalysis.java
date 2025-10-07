package com.example.AIdemo;

import jakarta.persistence.*;


    /*履歷分析結果,儲存優缺點和分數*/


    @Entity
public class ResumeAnalysis {

    // 主鍵
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 對應使用者 ID
    private Long userId;

    // 履歷分析分數
    private Integer score;

    // 優點描述
    @Column(length = 100)
    private String strengths;

    // 缺點描述
    @Column(length = 100)
    private String weaknesses;

    // ===== Getter / Setter 方法 =====

    /** 取得主鍵 ID */
    public Long getId() {
        return id;
    }

    /** 取得使用者 ID */
    public Long getUserId() {
        return userId;
    }

    /** 設定使用者 ID */
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    /** 取得分析分數 */
    public Integer getScore() {
        return score;
    }

    /** 設定分析分數 */
    public void setScore(Integer score) {
        this.score = score;
    }

    /** 取得優點描述 */
    public String getStrengths() {
        return strengths;
    }

    /** 設定優點描述 */
    public void setStrengths(String strengths) {
        this.strengths = strengths;
    }

    /** 取得缺點描述 */
    public String getWeaknesses() {
        return weaknesses;
    }

    /** 設定缺點描述 */
    public void setWeaknesses(String weaknesses) {
        this.weaknesses = weaknesses;
    }

    //使用者選擇的職位
    @Column(length = 50)
    private String position;

}
