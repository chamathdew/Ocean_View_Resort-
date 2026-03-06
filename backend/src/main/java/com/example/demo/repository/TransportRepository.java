package com.example.demo.repository;

import com.example.demo.model.Transport;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransportRepository extends MongoRepository<Transport, String> {
}
