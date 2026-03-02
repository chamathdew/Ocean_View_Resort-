package com.example.demo.controller;

import com.example.demo.model.Attraction;
import com.example.demo.service.AttractionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/attractions")
@CrossOrigin("*")
public class AttractionController {
    @Autowired
    private AttractionService service;

    @GetMapping
    public List<Attraction> getAll() {
        return service.getAll();
    }

    @PostMapping
    public ResponseEntity<Attraction> add(@RequestBody Attraction a) {
        return ResponseEntity.status(201).body(service.add(a));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }
}
