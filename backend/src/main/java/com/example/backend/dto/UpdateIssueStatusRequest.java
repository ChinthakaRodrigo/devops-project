package com.example.backend.dto;

public class UpdateIssueStatusRequest {

    private String status;
    private String forwardedTo;

    public UpdateIssueStatusRequest() {
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getForwardedTo() {
        return forwardedTo;
    }

    public void setForwardedTo(String forwardedTo) {
        this.forwardedTo = forwardedTo;
    }
}