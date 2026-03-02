package com.example.demo.service;

import com.example.demo.model.Reservation;
import com.example.demo.repository.ReservationRepository;
import com.example.demo.dto.ReservationRequest;
import com.example.demo.pattern.factory.ReservationFactory;
import com.example.demo.pattern.strategy.BillingStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ReservationFactory reservationFactory;

    @Autowired
    private com.example.demo.repository.GuestRepository guestRepository;

    @Autowired
    private BillingStrategy billingStrategy;

    @Autowired
    private EmailService emailService;

    public Reservation addReservation(ReservationRequest req) {
        if (req.getGuestDetails() != null) {
            com.example.demo.model.Guest savedGuest = guestRepository.save(req.getGuestDetails());
            req.setGuestId(savedGuest.getId());
        }
        Reservation newReservation = reservationFactory.createReservation(req);
        Reservation saved = reservationRepository.save(newReservation);

        // Send async email confirmation
        new Thread(() -> emailService.sendBookingConfirmation(saved)).start();

        return saved;
    }

    public Optional<Reservation> getReservationDetails(String id) {
        return reservationRepository.findById(id);
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public String printBill(String id) {
        Optional<Reservation> res = getReservationDetails(id);
        if (res.isPresent()) {
            return billingStrategy.generateBill(res.get());
        }
        return "Reservation not found.";
    }
}
