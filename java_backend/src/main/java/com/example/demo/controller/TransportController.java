package com.example.demo.controller;

import com.example.demo.model.Transport;
import com.example.demo.service.TransportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transports")
@CrossOrigin("*")
public class TransportController {
    @Autowired
    private TransportService service;

    @GetMapping
    public List<Transport> getAll() {
        return service.getAll();
    }

    @PostMapping
    public ResponseEntity<Transport> add(@RequestBody Transport t) {
        return ResponseEntity.status(201).body(service.add(t));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transport> update(@PathVariable String id, @RequestBody Transport t) {
        t.setId(id);
        return ResponseEntity.ok(service.add(t));
    }
}
