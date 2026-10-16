package com.example.backend.dto;

public class LoginResponse {

    private boolean success;
    private String message;
    private Integer id;
    private String name;
    private String email;
    private String role;
    private String councilName;

    public LoginResponse() {
    }

    public LoginResponse(
            boolean success,
            String message,
            Integer id,
            String name,
            String email,
            String role,
            String councilName
    ) {
        this.success = success;
        this.message = message;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.councilName = councilName;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getCouncilName() {
        return councilName;
    }
}