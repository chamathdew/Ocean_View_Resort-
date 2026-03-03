package com.example.demo.repository;

<<<<<<< HEAD
import com.example.demo.model.Reservation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface ReservationRepository extends MongoRepository<Reservation, String> {
    Optional<Reservation> findByReservationNo(String reservationNo);

    List<Reservation> findByGuestId(String guestId);
=======
import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.demo.model.Reservation;

public interface ReservationRepository extends MongoRepository<Reservation, String> {
>>>>>>> origin/main
}
