package com.example.demo.service;

import com.example.demo.model.Room;
import com.example.demo.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class RoomService {
    @Autowired
    private RoomRepository roomRepository;

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room addRoom(Room room) {
        return roomRepository.save(room);
    }

    public Optional<Room> updateRoom(String id, Room details) {
        return roomRepository.findById(id).map(r -> {
            r.setRoomNumber(details.getRoomNumber());
            r.setRoomType(details.getRoomType());
            r.setStatus(details.getStatus());
            return roomRepository.save(r);
        });
    }

    public void deleteRoom(String id) {
        roomRepository.deleteById(id);
    }
}
