package com.example.demo.repository;

import com.example.demo.model.Room;
import org.springframework.data.mongodb.repository.MongoRepository;
<<<<<<< HEAD
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
=======
import java.util.Optional;

>>>>>>> origin/main
public interface RoomRepository extends MongoRepository<Room, String> {
    Optional<Room> findByRoomNumber(String roomNumber);
}
