package com.example.demo.config;

import com.example.demo.model.User;
import com.example.demo.model.Room;
import com.example.demo.model.Transport;
import com.example.demo.model.Attraction;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.RoomRepository;
import com.example.demo.repository.TransportRepository;
import com.example.demo.repository.AttractionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Optional;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository,
                                   RoomRepository roomRepository,
                                   TransportRepository transportRepository,
                                   AttractionRepository attractionRepository) {
        return args -> {
            // Admin user
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

            // Seed Rooms if empty
            if (roomRepository.count() == 0) {
                List<Room> rooms = List.of(
                        new Room(null, "A101", "Single", "active"),
                        new Room(null, "A102", "Double", "active"),
                        new Room(null, "B201", "Family", "active"),
                        new Room(null, "C301", "Suite", "active")
                );
                roomRepository.saveAll(rooms);
                System.out.println("Seeded rooms.");
            }

            // Seed Transports if empty
            if (transportRepository.count() == 0) {
                List<Transport> transports = List.of(
                        new Transport(null, "TOYOTA WIGO", "", "5000", "Airport"),
                        new Transport(null, "VAN - 7 Seater", "", "12000", "Hotel"),
                        new Transport(null, "MOTORBIKE", "", "2500", "Hotel" )
                );
                transportRepository.saveAll(transports);
                System.out.println("Seeded transports.");
            }

            // Seed Attractions if empty
            if (attractionRepository.count() == 0) {
                List<Attraction> attractions = List.of(
                        new Attraction(null, "Galle Fort", "", "Historic fort and UNESCO site."),
                        new Attraction(null, "Jungle Beach", "", "Secluded beach with great snorkeling."),
                        new Attraction(null, "Local Market", "", "Authentic local shopping experience.")
                );
                attractionRepository.saveAll(attractions);
                System.out.println("Seeded attractions.");
            }
        };
    }
}
