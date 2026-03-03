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
<<<<<<< HEAD
    private com.example.demo.repository.RoomRepository roomRepository;

    @Autowired
=======
>>>>>>> origin/main
    private EmailService emailService;

    public Reservation addReservation(ReservationRequest req) {
        if (req.getGuestDetails() != null) {
            com.example.demo.model.Guest savedGuest = guestRepository.save(req.getGuestDetails());
            req.setGuestId(savedGuest.getId());
        }
        Reservation newReservation = reservationFactory.createReservation(req);
        Reservation saved = reservationRepository.save(newReservation);

<<<<<<< HEAD
        // Update room status to booked to update availability count
        roomRepository.findById(req.getRoomId()).ifPresent(room -> {
            room.setStatus("booked");
            roomRepository.save(room);
        });

=======
>>>>>>> origin/main
        // Send async email confirmation
        new Thread(() -> emailService.sendBookingConfirmation(saved)).start();

        return saved;
    }

    public Optional<Reservation> getReservationDetails(String id) {
        return reservationRepository.findById(id);
    }

<<<<<<< HEAD
    public Optional<Reservation> getByReservationNo(String resNo) {
        return reservationRepository.findByReservationNo(resNo);
    }

    public List<java.util.Map<String, Object>> getReservationsByEmail(String email) {
        Optional<com.example.demo.model.Guest> guestOpt = guestRepository.findByEmail(email);
        if (guestOpt.isEmpty())
            return new java.util.ArrayList<>();

        List<Reservation> reservations = reservationRepository.findByGuestId(guestOpt.get().getId());
        List<java.util.Map<String, Object>> response = new java.util.ArrayList<>();

        for (Reservation res : reservations) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", res.getId());
            map.put("reservationNo", res.getReservationNo());
            map.put("checkIn", res.getCheckIn());
            map.put("checkOut", res.getCheckOut());
            map.put("status", res.getStatus());
            map.put("isPaid", res.getIsPaid());
            map.put("guestId", guestOpt.get());
            roomRepository.findById(res.getRoomId()).ifPresent(room -> map.put("roomId", room));
            response.add(map);
        }
        return response;
    }

    public List<java.util.Map<String, Object>> getAllReservations() {
        List<Reservation> reservations = reservationRepository.findAll();
        List<java.util.Map<String, Object>> response = new java.util.ArrayList<>();

        for (Reservation res : reservations) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", res.getId());
            map.put("reservationNo", res.getReservationNo());
            map.put("checkIn", res.getCheckIn());
            map.put("checkOut", res.getCheckOut());
            map.put("status", res.getStatus());
            map.put("isPaid", res.getIsPaid());

            // Populate Guest
            if (res.getGuestId() != null) {
                guestRepository.findById(res.getGuestId()).ifPresent(guest -> map.put("guestId", guest));
            }
            // Populate Room
            if (res.getRoomId() != null) {
                roomRepository.findById(res.getRoomId()).ifPresent(room -> map.put("roomId", room));
            }

            response.add(map);
        }
        return response;
    }

    public void updatePaymentStatus(String id, boolean isPaid) {
        reservationRepository.findById(id).ifPresent(res -> {
            res.setIsPaid(isPaid);
            reservationRepository.save(res);
        });
    }

    public void deleteReservation(String id) {
        reservationRepository.findById(id).ifPresent(res -> {
            // Send cancellation email before relative objects are potentially orphaned or
            // status changes
            new Thread(() -> emailService.sendCancellationNotice(res)).start();

            roomRepository.findById(res.getRoomId()).ifPresent(room -> {
                room.setStatus("active");
                roomRepository.save(room);
            });
            reservationRepository.delete(res);
        });
=======
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
>>>>>>> origin/main
    }

    public String printBill(String id) {
        Optional<Reservation> res = getReservationDetails(id);
        if (res.isPresent()) {
            return billingStrategy.generateBill(res.get());
        }
        return "Reservation not found.";
    }
<<<<<<< HEAD

    public void updateReservation(String id, ReservationRequest req) {
        reservationRepository.findById(id).ifPresent(res -> {
            if (req.getCheckIn() != null)
                res.setCheckIn(req.getCheckIn());
            if (req.getCheckOut() != null)
                res.setCheckOut(req.getCheckOut());
            reservationRepository.save(res);
        });
    }
=======
>>>>>>> origin/main
}
