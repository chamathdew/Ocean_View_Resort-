package com.example.demo.pattern.strategy;

import com.example.demo.model.Reservation;
import com.example.demo.repository.RoomRepository;
import com.example.demo.service.PricingService;
import org.springframework.stereotype.Service;

@Service
public class StandardBillingStrategy implements BillingStrategy {

    private final RoomRepository roomRepository;
    private final PricingService pricingService;

    public StandardBillingStrategy(RoomRepository roomRepository, PricingService pricingService) {
        this.roomRepository = roomRepository;
        this.pricingService = pricingService;
    }
    
    @Override
    public String generateBill(Reservation res) {
        double pricePerNight = roomRepository.findById(res.getRoomId())
                .map(room -> pricingService.getPriceByRoomType(room.getRoomType()))
                .orElse(35000.0);

        long diff = Math.abs(res.getCheckOut().getTime() - res.getCheckIn().getTime());
        long nights = java.util.concurrent.TimeUnit.DAYS.convert(diff, java.util.concurrent.TimeUnit.MILLISECONDS);
        if (nights <= 0) nights = 1;
        
        double total = pricePerNight * nights;

        StringBuilder bill = new StringBuilder();
        bill.append("================ OCEAN VIEW RESORT =================\n");
        bill.append("                OFFICIAL RECEIPT                    \n");
        bill.append("====================================================\n");
        bill.append("Ref No      : ").append(res.getReservationNo()).append("\n");
        bill.append("Dates       : ").append(res.getCheckIn()).append(" to ").append(res.getCheckOut()).append("\n");
        bill.append("Nights      : ").append(nights).append("\n");
        bill.append("Rate        : LKR ").append(String.format("%,.2f", pricePerNight)).append("\n");
        bill.append("----------------------------------------------------\n");
        bill.append("GRAND TOTAL : LKR ").append(String.format("%,.2f", total)).append("\n");
        bill.append("Status      : ").append(res.getIsPaid() ? "PAID" : "PENDING").append("\n");
        bill.append("====================================================\n");
        bill.append("Safe travels!\n");
        return bill.toString();
    }
}
