package com.example.demo.pattern.factory;

import com.example.demo.model.Reservation;
import com.example.demo.dto.ReservationRequest;
import org.springframework.stereotype.Component;
import java.util.UUID;

@Component
public class ReservationFactory {
    
    public Reservation createReservation(ReservationRequest req) {
        Reservation reservation = new Reservation();
        reservation.setReservationNo("RES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        reservation.setGuestId(req.getGuestId());
        reservation.setRoomId(req.getRoomId());
        reservation.setCheckIn(req.getCheckIn());
        reservation.setCheckOut(req.getCheckOut());
        reservation.setStatus("booked");
        reservation.setIsPaid(false);
        return reservation;
    }
}
