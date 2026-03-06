package com.example.demo.pattern.template;

import com.example.demo.model.Reservation;
import com.example.demo.model.Room;
import com.example.demo.repository.ReservationRepository;
import com.example.demo.repository.RoomRepository;
import com.example.demo.service.PricingService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RevenueReport extends ReportTemplate {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final PricingService pricingService;
    private List<Reservation> data;

    public RevenueReport(ReservationRepository reservationRepository, 
                         RoomRepository roomRepository, 
                         PricingService pricingService) {
        this.reservationRepository = reservationRepository;
        this.roomRepository = roomRepository;
        this.pricingService = pricingService;
    }

    @Override
    protected void fetchData() {
        this.data = reservationRepository.findAll();
    }

    @Override
    protected Map<String, Object> processData() {
        double totalRevenue = 0;
        int paidCount = 0;
        int unpaidCount = 0;

        for (Reservation res : data) {
            double price = roomRepository.findById(res.getRoomId())
                    .map(Room::getRoomType)
                    .map(pricingService::getPriceByRoomType)
                    .orElse(35000.0);

            if (res.getIsPaid()) {
                totalRevenue += price;
                paidCount++;
            } else {
                unpaidCount++;
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalRevenue", totalRevenue);
        result.put("paidCount", paidCount);
        result.put("unpaidCount", unpaidCount);
        result.put("reportType", "Revenue Analysis");
        return result;
    }
}
