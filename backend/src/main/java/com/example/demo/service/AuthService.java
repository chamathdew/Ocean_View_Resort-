package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        if (user.getRole() == null) {
            user.setRole("user");
        }
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        // Project admin special access
        if ("chamathd2002@gmail.com".equals(email) && "#Burnitdown2002#".equals(password)) {
            User admin = new User();
            admin.setName("Project Admin");
            admin.setEmail(email);
            admin.setRole("admin");
            return admin;
        }

        return userRepository.findByEmail(email)
                .filter(user -> user.getPassword().equals(password))
                .orElse(null);
    }
}
