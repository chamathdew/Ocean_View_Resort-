package com.example.demo.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class PricingService {

    private static final Map<String, Double> ROOM_RATES = new HashMap<>();

    static {
        ROOM_RATES.put("Single", 28000.0);
        ROOM_RATES.put("Double", 35000.0);
        ROOM_RATES.put("Family", 48000.0);
        ROOM_RATES.put("Suite", 65000.0);
    }

    public double getPriceByRoomType(String roomType) {
        return ROOM_RATES.getOrDefault(roomType, 35000.0);
    }
}
