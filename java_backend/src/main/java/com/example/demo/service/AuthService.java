package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public User register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        if (user.getRole() == null)
            user.setRole("user");
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        // Project Admin Hardcoded Login
        if ("chamathd2002@gmail.com".equals(email) && "#Burnitdown2002#".equals(password)) {
            User admin = new User();
            admin.setName("Admin Chamath");
            admin.setEmail("chamathd2002@gmail.com");
            admin.setRole("admin");
            return admin;
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Simple check for regular users
            if (user.getPassword().equals(password)) {
                return user;
            }
        }
        return null;
    }
}
