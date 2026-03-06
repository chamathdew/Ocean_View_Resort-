package com.example.demo.service;

import com.example.demo.model.Reservation;
import com.example.demo.repository.GuestRepository;
import com.example.demo.repository.RoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.text.NumberFormat;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final GuestRepository guestRepository;
    private final RoomRepository roomRepository;
    private final PricingService pricingService;

    public EmailService(JavaMailSender mailSender, 
                        GuestRepository guestRepository, 
                        RoomRepository roomRepository, 
                        PricingService pricingService) {
        this.mailSender = mailSender;
        this.guestRepository = guestRepository;
        this.roomRepository = roomRepository;
        this.pricingService = pricingService;
    }

    @Async
    public void sendBookingConfirmation(Reservation reservation) {
        guestRepository.findById(reservation.getGuestId()).ifPresent(guest -> {
            roomRepository.findById(reservation.getRoomId()).ifPresent(room -> {
                try {
                    MimeMessage message = mailSender.createMimeMessage();
                    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                    long nights = calculateNights(reservation);
                    double pricePerNight = pricingService.getPriceByRoomType(room.getRoomType());
                    double total = pricePerNight * nights;

                    String formattedTotal = formatCurrency(total);
                    String htmlContent = buildBookingHtml(guest, room, reservation, nights, formattedTotal);

                    helper.setTo(guest.getEmail());
                    helper.setSubject("Booking Confirmation - " + reservation.getReservationNo());
                    helper.setText(htmlContent, true);

                    mailSender.send(message);
                    logger.info("Confirmation email sent to: {}", guest.getEmail());
                } catch (Exception e) {
                    logger.error("Failed to send booking email", e);
                }
            });
        });
    }

    @Async
    public void sendCancellationNotice(Reservation reservation) {
        guestRepository.findById(reservation.getGuestId()).ifPresent(guest -> {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                String htmlContent = buildCancellationHtml(guest, reservation);

                helper.setTo(guest.getEmail());
                helper.setSubject("Reservation Cancelled - " + reservation.getReservationNo());
                helper.setText(htmlContent, true);

                mailSender.send(message);
                logger.info("Cancellation email sent to: {}", guest.getEmail());
            } catch (Exception e) {
                logger.error("Failed to send cancellation email", e);
            }
        });
    }

    private long calculateNights(Reservation res) {
        long diff = Math.abs(res.getCheckOut().getTime() - res.getCheckIn().getTime());
        long nights = TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);
        return nights <= 0 ? 1 : nights;
    }

    private String formatCurrency(double amount) {
        return NumberFormat.getCurrencyInstance(new Locale("en", "LK"))
                .format(amount).replace("LKR", "Rs. ");
    }

    private String buildBookingHtml(com.example.demo.model.Guest guest, com.example.demo.model.Room room, Reservation res, long nights, String total) {
        return "<html><body style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>" +
                "<div style='max-width: 600px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;'>" +
                "<div style='background: #0f172a; padding: 30px; text-align: center; color: white;'>" +
                "<h1 style='margin: 0; font-size: 24px; letter-spacing: 2px;'>OCEAN VIEW RESORT</h1>" +
                "</div><div style='padding: 30px;'><h2 style='color: #0c4a6e;'>Digital Invoice</h2>" +
                "<p>Dear " + guest.getFullName() + ",</p><p>Your booking is confirmed. Details below:</p>" +
                "<div style='background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;'>" +
                "Ref: <b>" + res.getReservationNo() + "</b><br>" +
                "Dates: " + res.getCheckIn().toString().substring(0, 10) + " to " + res.getCheckOut().toString().substring(0, 10) + "<br>" +
                "Suite: " + room.getRoomNumber() + " (" + room.getRoomType() + ")</div>" +
                "<table style='width: 100%; border-collapse: collapse; margin-top: 20px;'>" +
                "<tr style='border-bottom: 2px solid #e2e8f0;'><td><b>Description</b></td><td><b>Nights</b></td><td style='text-align: right;'><b>Total</b></td></tr>" +
                "<tr><td>" + room.getRoomType() + " Suite</td><td>" + nights + "</td><td style='text-align: right;'>" + total + "</td></tr>" +
                "</table><div style='margin-top: 30px; border-top: 2px solid #0891b2; padding-top: 20px; text-align: right;'>" +
                "<span style='font-size: 18px; font-weight: bold; color: #0891b2;'>GRAND TOTAL: " + total + "</span></div>" +
                "</div></div></body></html>";
    }

    private String buildCancellationHtml(com.example.demo.model.Guest guest, Reservation res) {
        return "<html><body style='font-family: Arial, sans-serif; color: #333;'>" +
                "<div style='max-width: 600px; margin: 20px auto; border: 1px solid #fee2e2; border-radius: 12px; overflow: hidden;'>" +
                "<div style='background: #ef4444; padding: 30px; text-align: center; color: white;'>" +
                "<h1 style='margin: 0;'>CANCELLATION NOTICE</h1></div>" +
                "<div style='padding: 30px;'><h2>Booking Cancelled</h2>" +
                "<p>Dear " + guest.getFullName() + ",</p>" +
                "<p>Confirmed cancellation for reference: <b>" + res.getReservationNo() + "</b></p>" +
                "</div></div></body></html>";
    }
}
