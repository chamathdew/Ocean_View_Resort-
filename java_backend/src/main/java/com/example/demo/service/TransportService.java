package com.example.demo.service;

import com.example.demo.model.Transport;
import com.example.demo.repository.TransportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TransportService {
    @Autowired
    private TransportRepository transportRepository;

    public List<Transport> getAll() {
        return transportRepository.findAll();
    }

    public Transport add(Transport t) {
        return transportRepository.save(t);
    }

    public void delete(String id) {
        transportRepository.deleteById(id);
    }
}
