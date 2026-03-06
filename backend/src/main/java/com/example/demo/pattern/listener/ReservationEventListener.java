package com.example.demo.pattern.listener;

import com.example.demo.model.Reservation;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeSaveEvent;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class ReservationEventListener extends AbstractMongoEventListener<Reservation> {

    @Override
    public void onBeforeSave(BeforeSaveEvent<Reservation> event) {
        Reservation res = event.getSource();
        
        // 1. Audit Trigger: Set last modified date automatically
        res.setLastModified(new Date());

        // 2. Business Rule Strategy: Validation before persistence
        if (res.getCheckIn() != null && res.getCheckOut() != null) {
            if (res.getCheckOut().before(res.getCheckIn())) {
                throw new RuntimeException("Invalid Entry: Check-out date cannot be before Check-in date.");
            }
        }
    }
}
