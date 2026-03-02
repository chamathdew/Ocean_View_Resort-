package com.example.demo.repository;

import com.example.demo.model.Attraction;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AttractionRepository extends MongoRepository<Attraction, String> {
}
