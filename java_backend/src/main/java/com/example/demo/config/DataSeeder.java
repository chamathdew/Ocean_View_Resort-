package com.example.demo.config;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Optional;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository) {
        return args -> {
            Optional<User> admin = userRepository.findByEmail("chamathd2002@gmail.com");
            if (admin.isEmpty()) {
                User newAdmin = new User();
                newAdmin.setName("Admin");
                newAdmin.setEmail("chamathd2002@gmail.com");
                newAdmin.setPassword("#Burnitdown2002#");
                newAdmin.setRole("ADMIN");
                userRepository.save(newAdmin);
                System.out.println("Admin user created.");
            } else {
                User existingAdmin = admin.get();
                if (!"#Burnitdown2002#".equals(existingAdmin.getPassword())
                        || !"ADMIN".equals(existingAdmin.getRole())) {
                    existingAdmin.setPassword("#Burnitdown2002#");
                    existingAdmin.setRole("ADMIN");
                    userRepository.save(existingAdmin);
                    System.out.println("Admin user updated.");
                } else {
                    System.out.println("Admin user already exists.");
                }
            }
        };
    }
}
