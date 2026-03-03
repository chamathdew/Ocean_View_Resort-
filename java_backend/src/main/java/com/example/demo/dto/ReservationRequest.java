package com.example.demo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationRequest {
    private String guestId;
    private com.example.demo.model.Guest guestDetails;
    private String roomId;
    private Date checkIn;
    private Date checkOut;
}
