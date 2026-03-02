package com.example.demo.repository;

import com.example.demo.model.Room;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface RoomRepository extends MongoRepository<Room, String> {
    Optional<Room> findByRoomNumber(String roomNumber);
}
