package com.example.demo.controller;

import com.example.demo.pattern.template.RevenueReport;
import com.example.demo.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReservationRepository reservationRepository;
    private final com.example.demo.repository.RoomRepository roomRepository;
    private final com.example.demo.service.PricingService pricingService;

    public ReportController(ReservationRepository reservationRepository,
                            com.example.demo.repository.RoomRepository roomRepository,
                            com.example.demo.service.PricingService pricingService) {
        this.reservationRepository = reservationRepository;
        this.roomRepository = roomRepository;
        this.pricingService = pricingService;
    }

    @GetMapping("/revenue")
    public Map<String, Object> getRevenueReport() {
        RevenueReport report = new RevenueReport(reservationRepository, roomRepository, pricingService);
        return report.generateReport();
    }
    
    @GetMapping("/summary")
    public Map<String, Object> getSummaryReport() {
        Map<String, Object> revenue = new RevenueReport(reservationRepository, roomRepository, pricingService).generateReport();
        revenue.put("title", "Executive Management Summary");
        revenue.put("generatedAt", new java.util.Date());
        return revenue;
    }
}
