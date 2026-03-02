package com.example.demo.repository;

import com.example.demo.model.Transport;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TransportRepository extends MongoRepository<Transport, String> {
}
