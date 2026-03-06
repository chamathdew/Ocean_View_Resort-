package com.example.demo.service;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class PricingServiceTest {

    private final PricingService pricingService = new PricingService();

    @Test
    public void testGetPriceForSingleRoom() {
        double price = pricingService.getPriceByRoomType("Single");
        assertEquals(28000.0, price, "Single room price should be 28000.0");
    }

    @Test
    public void testGetPriceForDoubleRoom() {
        double price = pricingService.getPriceByRoomType("Double");
        assertEquals(35000.0, price, "Double room price should be 35000.0");
    }

    @Test
    public void testGetPriceForFamilyRoom() {
        double price = pricingService.getPriceByRoomType("Family");
        assertEquals(48000.0, price, "Family room price should be 48000.0");
    }

    @Test
    public void testGetPriceForSuiteRoom() {
        double price = pricingService.getPriceByRoomType("Suite");
        assertEquals(65000.0, price, "Suite room price should be 65000.0");
    }

    @Test
    public void testGetPriceForInvalidRoomType() {
        double price = pricingService.getPriceByRoomType("UnknownType");
        assertEquals(35000.0, price, "Unknown room type should default to 35000.0");
    }
}
