package com.example.demo.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.demo.model.Reservation;

public interface ReservationRepository extends MongoRepository<Reservation, String> {
}
