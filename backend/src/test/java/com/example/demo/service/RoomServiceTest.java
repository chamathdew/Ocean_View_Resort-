package com.example.demo.service;

import com.example.demo.model.Room;
import com.example.demo.repository.RoomRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class RoomServiceTest {

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private RoomService roomService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllRooms() {
        Room room1 = new Room();
        room1.setId("1");
        room1.setRoomNumber("101");
        
        Room room2 = new Room();
        room2.setId("2");
        room2.setRoomNumber("102");

        when(roomRepository.findAll()).thenReturn(Arrays.asList(room1, room2));

        List<Room> rooms = roomService.getAllRooms();

        assertEquals(2, rooms.size());
        verify(roomRepository, times(1)).findAll();
    }

    @Test
    public void testAddRoom() {
        Room room = new Room();
        room.setRoomNumber("103");
        room.setRoomType("Double");

        when(roomRepository.save(room)).thenReturn(room);

        Room savedRoom = roomService.addRoom(room);

        assertEquals("103", savedRoom.getRoomNumber());
        assertEquals("Double", savedRoom.getRoomType());
        verify(roomRepository, times(1)).save(room);
    }
}
