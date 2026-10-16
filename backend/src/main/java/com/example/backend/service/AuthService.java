package com.example.backend.service;

import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.SignupRequest;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.backend.dto.LoginResponse;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public String signup(SignupRequest request) {

        if (request.getName() == null || request.getName().isBlank()) {
            return "Name is required";
        }

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return "Email is required";
        }

        if (!request.getEmail().contains("@")) {
            return "Invalid email format";
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            return "Password is required";
        }

        if (request.getPassword().length() < 6) {
            return "Password must contain at least 6 characters";
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already registered";
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        String hashedPassword =
                passwordEncoder.encode(request.getPassword());

        user.setPassword(hashedPassword);

        user.setRole("CITIZEN");
        user.setCouncilName(null);

        userRepository.save(user);

        return "Signup successful";
    }

    public LoginResponse login(LoginRequest request) {

        try {
            User user =
                    userRepository.findByEmail(request.getEmail());

            boolean passwordMatches =
                    passwordEncoder.matches(
                            request.getPassword(),
                            user.getPassword()
                    );

            if (passwordMatches) {

                return new LoginResponse(
                        true,
                        "Login successful",
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getCouncilName()
                );
            }

            return new LoginResponse(
                    false,
                    "Invalid password",
                    null,
                    null,
                    null,
                    null,
                    null
            );

        } catch (EmptyResultDataAccessException e) {

            return new LoginResponse(
                    false,
                    "User not found",
                    null,
                    null,
                    null,
                    null,
                    null
            );
        }
    }


}