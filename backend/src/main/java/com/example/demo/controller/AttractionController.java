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
    private final AttractionService service;

    public AttractionController(AttractionService service) {
        this.service = service;
    }

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

    @PutMapping("/{id}")
    public ResponseEntity<Attraction> update(@PathVariable String id, @RequestBody Attraction a) {
        a.setId(id);
        return ResponseEntity.ok(service.add(a));
    }
}
