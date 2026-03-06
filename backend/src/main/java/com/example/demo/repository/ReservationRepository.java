package com.example.demo.repository;

import com.example.demo.model.Reservation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface ReservationRepository extends MongoRepository<Reservation, String> {
    Optional<Reservation> findByReservationNo(String reservationNo);

    List<Reservation> findByGuestId(String guestId);
}
