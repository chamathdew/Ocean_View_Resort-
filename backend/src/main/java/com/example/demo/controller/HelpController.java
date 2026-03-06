package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/help")
@CrossOrigin("*")
public class HelpController {

    @GetMapping
    public ResponseEntity<String> getHelp() {
        return ResponseEntity.ok("Need help? \n\n" +
                "1. User Login: POST /api/auth/login with { email, password }.\n" +
                "2. Add Reservation: POST /api/reservations with { guestId, roomId, checkIn, checkOut }.\n" +
                "3. Display Details: GET /api/reservations/{id}.\n" +
                "4. Print Bill: GET /api/reservations/print/{id}.");
    }
}
