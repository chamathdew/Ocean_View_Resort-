package com.example.demo.pattern.strategy;

import com.example.demo.model.Reservation;

public interface BillingStrategy {
    String generateBill(Reservation reservation);
}
