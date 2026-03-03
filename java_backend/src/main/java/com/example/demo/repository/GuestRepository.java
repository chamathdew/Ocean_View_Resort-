package com.example.demo.repository;

import com.example.demo.model.Guest;
import org.springframework.data.mongodb.repository.MongoRepository;
<<<<<<< HEAD
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface GuestRepository extends MongoRepository<Guest, String> {
    Optional<Guest> findByEmail(String email);
=======

public interface GuestRepository extends MongoRepository<Guest, String> {
>>>>>>> origin/main
}
