package com.example.demo.pattern.strategy;

import com.example.demo.model.Reservation;
import org.springframework.stereotype.Component;

@Component
public class StandardBillingStrategy implements BillingStrategy {
    
    @Override
    public String generateBill(Reservation reservation) {
        StringBuilder bill = new StringBuilder();
        bill.append("================ OCEAN VIEW RESORT =================\n");
        bill.append("                STANDARD BILL                       \n");
        bill.append("====================================================\n");
        bill.append("Reservation No : ").append(reservation.getReservationNo()).append("\n");
        bill.append("Guest ID       : ").append(reservation.getGuestId()).append("\n");
        bill.append("Room ID        : ").append(reservation.getRoomId()).append("\n");
        bill.append("Check-In Date  : ").append(reservation.getCheckIn()).append("\n");
        bill.append("Check-Out Date : ").append(reservation.getCheckOut()).append("\n");
        bill.append("Status         : ").append(reservation.getStatus()).append("\n");
        bill.append("Paid Status    : ").append(reservation.getIsPaid() ? "Paid" : "Pending").append("\n");
        bill.append("====================================================\n");
        bill.append("Thank you for staying with us!\n");
        return bill.toString();
    }
}
