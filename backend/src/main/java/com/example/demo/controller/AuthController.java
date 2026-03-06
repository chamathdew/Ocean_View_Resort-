package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.model.User;
import com.example.demo.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User newUser = authService.register(user);
            return ResponseEntity.status(201).body(newUser);
        } catch (Exception e) {
            logger.error("Error saving user: {}", e.getMessage());
            return ResponseEntity.status(400).body("Something went wrong with registration!");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginReq) {
        logger.info("Login attempt for email: {}", loginReq.getEmail());
        User user = authService.login(loginReq.getEmail(), loginReq.getPassword());
        if (user != null) {
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("user", user);
            response.put("token", "dummy-jwt-token-for-assignment");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).body("Wrong email or password.");
    }
}
