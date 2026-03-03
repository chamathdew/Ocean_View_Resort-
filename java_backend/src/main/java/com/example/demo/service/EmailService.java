package com.example.demo.service;

import com.example.demo.model.Reservation;
<<<<<<< HEAD
import com.example.demo.repository.GuestRepository;
import com.example.demo.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;
import java.text.NumberFormat;
import java.util.Locale;
import java.util.concurrent.TimeUnit;
=======
import com.example.demo.model.Guest;
import com.example.demo.model.Room;
import com.example.demo.repository.GuestRepository;
import com.example.demo.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
>>>>>>> origin/main

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

<<<<<<< HEAD
            roomRepository.findById(reservation.getRoomId()).ifPresent(room -> {
                try {
                    MimeMessage message = mailSender.createMimeMessage();
                    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                    long diffInMillies = Math
                            .abs(reservation.getCheckOut().getTime() - reservation.getCheckIn().getTime());
                    long nights = TimeUnit.DAYS.convert(diffInMillies, TimeUnit.MILLISECONDS);
                    if (nights <= 0)
                        nights = 1;

                    // Pricing Fallback
                    double pricePerNight = 35000.0;
                    if (room.getRoomType().equalsIgnoreCase("Single"))
                        pricePerNight = 25000.0;
                    if (room.getRoomType().equalsIgnoreCase("Family"))
                        pricePerNight = 45000.0;
                    if (room.getRoomType().equalsIgnoreCase("Suite"))
                        pricePerNight = 75000.0;

                    double total = pricePerNight * nights;
                    NumberFormat formatter = NumberFormat.getCurrencyInstance(new Locale("en", "LK"));
                    String formattedTotal = formatter.format(total).replace("LKR", "Rs. ");

                    String htmlContent = "<html><body style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>"
                            +
                            "<div style='max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;'>"
                            +
                            "  <div style='background: #0f172a; padding: 30px; text-align: center; color: white;'>" +
                            "    <h1 style='margin: 0; font-size: 24px; letter-spacing: 2px;'>OCEAN VIEW RESORT</h1>" +
                            "    <p style='margin: 5px 0 0; opacity: 0.8;'>Galle, Sri Lanka</p>" +
                            "  </div>" +
                            "  <div style='padding: 30px;'>" +
                            "    <h2 style='color: #0c4a6e; margin-top: 0;'>Digital Invoice</h2>" +
                            "    <p>Dear <strong>" + guest.getFullName() + "</strong>,</p>" +
                            "    <p>Thank you for choosing Ocean View Resort. Your booking is confirmed. Here is your digital invoice.</p>"
                            +
                            "    <div style='background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;'>"
                            +
                            "      <table style='width: 100%; font-size: 14px;'>" +
                            "        <tr><td><strong>Invoice No:</strong></td><td style='text-align: right; color: #0891b2; font-weight: bold;'>"
                            + reservation.getReservationNo() + "</td></tr>" +
                            "        <tr><td><strong>Check-in:</strong></td><td style='text-align: right;'>"
                            + reservation.getCheckIn().toString().substring(0, 10) + "</td></tr>" +
                            "        <tr><td><strong>Check-out:</strong></td><td style='text-align: right;'>"
                            + reservation.getCheckOut().toString().substring(0, 10) + "</td></tr>" +
                            "        <tr><td><strong>Suite:</strong></td><td style='text-align: right;'>"
                            + room.getRoomNumber() + " (" + room.getRoomType() + ")</td></tr>" +
                            "      </table>" +
                            "    </div>" +
                            "    <table style='width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px;'>"
                            +
                            "      <thead><tr style='border-bottom: 2px solid #e2e8f0; font-weight: bold;'><th style='text-align: left; padding: 10px 0;'>Description</th><th style='text-align: center;'>Nights</th><th style='text-align: right;'>Total</th></tr></thead>"
                            +
                            "      <tbody>" +
                            "        <tr><td style='padding: 15px 0;'>" + room.getRoomType()
                            + " Suite Accommodation</td><td style='text-align: center;'>" + nights
                            + "</td><td style='text-align: right; font-weight: bold;'>" + formattedTotal + "</td></tr>"
                            +
                            "      </tbody>" +
                            "    </table>" +
                            "    <div style='margin-top: 30px; border-top: 2px solid #0891b2; padding-top: 20px; text-align: right;'>"
                            +
                            "      <span style='font-size: 18px; font-weight: bold; color: #0891b2;'>GRAND TOTAL: "
                            + formattedTotal + "</span>" +
                            "    </div>" +
                            "    <p style='margin-top: 40px; font-style: italic; color: #64748b; font-size: 11px; text-align: center;'>"
                            +
                            "      We look forward to welcoming you! For any assistance, call +94 11 234 5678" +
                            "    </p>" +
                            "  </div>" +
                            "  <div style='background: #f1f5f9; padding: 15px; text-align: center; color: #64748b; font-size: 11px;'>"
                            +
                            "    &copy; 2026 Ocean View Resort & Spa." +
                            "  </div>" +
                            "</div>" +
                            "</body></html>";

                    helper.setTo(guest.getEmail());
                    helper.setSubject(
                            "Your Digital Invoice - Ocean View Resort (" + reservation.getReservationNo() + ")");
                    helper.setText(htmlContent, true);

                    mailSender.send(message);
                    System.out.println("Digital Invoice sent to: " + guest.getEmail());
                } catch (Exception e) {
                    System.err.println("Failed to send HTML invoice: " + e.getMessage());
                }
            });
        });
    }

    public void sendCancellationNotice(Reservation reservation) {
        guestRepository.findById(reservation.getGuestId()).ifPresent(guest -> {
            if (guest.getEmail() == null || guest.getEmail().isEmpty())
                return;

            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                String htmlContent = "<html><body style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>"
                        + "<div style='max-width: 600px; margin: 0 auto; border: 1px solid #fee2e2; border-radius: 12px; overflow: hidden;'>"
                        + "  <div style='background: #ef4444; padding: 30px; text-align: center; color: white;'>"
                        + "    <h1 style='margin: 0; font-size: 24px; letter-spacing: 2px;'>CANCELLATION NOTICE</h1>"
                        + "    <p style='margin: 5px 0 0; opacity: 0.8;'>Ocean View Resort, Galle</p>"
                        + "  </div>"
                        + "  <div style='padding: 30px;'>"
                        + "    <h2 style='color: #991b1b; margin-top: 0;'>Booking Cancelled</h2>"
                        + "    <p>Dear <strong>" + guest.getFullName() + "</strong>,</p>"
                        + "    <p>This email is to confirm that your reservation with reference <strong>"
                        + reservation.getReservationNo()
                        + "</strong> has been officially cancelled as per your request or system adjustment.</p>"
                        + "    <div style='background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px dashed #fecaca;'>"
                        + "      <p style='margin: 0; font-size: 14px;'><strong>Cancelled Booking Details:</strong></p>"
                        + "      <p style='margin: 5px 0; font-size: 13px;'>Check-in: "
                        + reservation.getCheckIn().toString().substring(0, 10) + "</p>"
                        + "      <p style='margin: 5px 0; font-size: 13px;'>Check-out: "
                        + reservation.getCheckOut().toString().substring(0, 10) + "</p>"
                        + "    </div>"
                        + "    <p>If this was not intentional or you wish to re-book, please visit our website or contact our support team immediately.</p>"
                        + "    <p style='margin-top: 40px; color: #64748b; font-size: 12px;'>Best regards,<br>The Concierge Team<br>Ocean View Resort</p>"
                        + "  </div>"
                        + "  <div style='background: #f8fafc; padding: 15px; text-align: center; color: #94a3b8; font-size: 11px;'>"
                        + "    &copy; 2026 Ocean View Resort & Spa. All rights reserved."
                        + "  </div>"
                        + "</div>"
                        + "</body></html>";

                helper.setTo(guest.getEmail());
                helper.setSubject("Reservation Cancelled - " + reservation.getReservationNo());
                helper.setText(htmlContent, true);

                mailSender.send(message);
                System.out.println("Cancellation email sent to: " + guest.getEmail());
            } catch (Exception e) {
                System.err.println("Failed to send cancellation email: " + e.getMessage());
=======
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
>>>>>>> origin/main
            }
        });
    }
}
