package com.example.demo.service;

import com.example.demo.model.Attraction;
import com.example.demo.repository.AttractionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AttractionService {
    @Autowired
    private AttractionRepository attractionRepository;

    public List<Attraction> getAll() {
        return attractionRepository.findAll();
    }

    public Attraction add(Attraction a) {
        return attractionRepository.save(a);
    }

    public void delete(String id) {
        attractionRepository.deleteById(id);
    }
}
