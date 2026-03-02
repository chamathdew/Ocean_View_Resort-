package com.example.demo.controller;

import com.example.demo.dto.ReservationRequest;
import com.example.demo.model.Reservation;
import com.example.demo.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin("*")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestBody ReservationRequest req) {
        Reservation res = reservationService.addReservation(req);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReservationDetails(@PathVariable String id) {
        Optional<Reservation> res = reservationService.getReservationDetails(id);
        if (res.isPresent()) {
            return ResponseEntity.ok(res.get());
        }
        return ResponseEntity.status(404).body("Reservation not found");
    }

    @GetMapping(value = "/print/{id}", produces = "text/plain")
    public ResponseEntity<String> printBill(@PathVariable String id) {
        String bill = reservationService.printBill(id);
        return ResponseEntity.ok(bill);
    }
}
