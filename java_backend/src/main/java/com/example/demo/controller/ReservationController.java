package com.example.demo.controller;

import com.example.demo.dto.ReservationRequest;
import com.example.demo.model.Reservation;
import com.example.demo.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
<<<<<<< HEAD
import java.util.List;
import java.util.Map;
=======
>>>>>>> origin/main

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

<<<<<<< HEAD
    @GetMapping
    public List<Map<String, Object>> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @PatchMapping("/{id}/payment")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable String id, @RequestBody Map<String, Boolean> payload) {
        reservationService.updatePaymentStatus(id, payload.get("isPaid"));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable String id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.ok().build();
    }

=======
>>>>>>> origin/main
    @GetMapping("/{id}")
    public ResponseEntity<?> getReservationDetails(@PathVariable String id) {
        Optional<Reservation> res = reservationService.getReservationDetails(id);
        if (res.isPresent()) {
            return ResponseEntity.ok(res.get());
        }
<<<<<<< HEAD
        // Try searching by reservationNo if ID is not found
        Optional<Reservation> resByNo = reservationService.getByReservationNo(id);
        if (resByNo.isPresent()) {
            return ResponseEntity.ok(resByNo.get());
        }
        return ResponseEntity.status(404).body("Reservation not found");
    }

    @GetMapping("/by-ref/{ref}")
    public ResponseEntity<?> getByRef(@PathVariable String ref) {
        Optional<Reservation> resByNo = reservationService.getByReservationNo(ref);
        if (resByNo.isPresent()) {
            return ResponseEntity.ok(resByNo.get());
        }
        return ResponseEntity.status(404).body("Reservation not found");
    }

    @GetMapping("/by-email/{email}")
    public List<Map<String, Object>> getByEmail(@PathVariable String email) {
        return reservationService.getReservationsByEmail(email);
    }

=======
        return ResponseEntity.status(404).body("Reservation not found");
    }

>>>>>>> origin/main
    @GetMapping(value = "/print/{id}", produces = "text/plain")
    public ResponseEntity<String> printBill(@PathVariable String id) {
        String bill = reservationService.printBill(id);
        return ResponseEntity.ok(bill);
    }
<<<<<<< HEAD

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReservation(@PathVariable String id, @RequestBody ReservationRequest req) {
        reservationService.updateReservation(id, req);
        return ResponseEntity.ok().build();
    }
=======
>>>>>>> origin/main
}
