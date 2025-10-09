package com.example.AIdemo.dto;

import java.util.List;

public class JobInfoRequest {
    private String username;
    private String jobCategory;
    private String jobTitle;

    // Getter / Setter
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getJobCategory() { return jobCategory; }
    public void setJobCategory(String jobCategory) { this.jobCategory = jobCategory; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
}
