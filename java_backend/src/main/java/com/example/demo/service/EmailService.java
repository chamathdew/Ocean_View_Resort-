package com.example.demo.service;

import com.example.demo.model.Reservation;
import com.example.demo.model.Guest;
import com.example.demo.model.Room;
import com.example.demo.repository.GuestRepository;
import com.example.demo.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private GuestRepository guestRepository;

    @Autowired
    private RoomRepository roomRepository;

    public void sendBookingConfirmation(Reservation reservation) {
        guestRepository.findById(reservation.getGuestId()).ifPresent(guest -> {
            if (guest.getEmail() == null || guest.getEmail().isEmpty())
                return;

            String roomNo = roomRepository.findById(reservation.getRoomId())
                    .map(Room::getRoomNumber).orElse("N/A");

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(guest.getEmail());
            message.setSubject("Booking Confirmed - Ocean View Resort");
            message.setText("Dear " + guest.getFullName() + ",\n\n" +
                    "Your booking at Ocean View Resort has been confirmed!\n\n" +
                    "Reservation No: " + reservation.getReservationNo() + "\n" +
                    "Room Number: " + roomNo + "\n" +
                    "Check-in: " + reservation.getCheckIn() + "\n" +
                    "Check-out: " + reservation.getCheckOut() + "\n\n" +
                    "Thank you for choosing us!");

            try {
                mailSender.send(message);
                System.out.println("Confirmation email sent to: " + guest.getEmail());
            } catch (Exception e) {
                System.err.println("Failed to send email: " + e.getMessage());
            }
        });
    }
}
