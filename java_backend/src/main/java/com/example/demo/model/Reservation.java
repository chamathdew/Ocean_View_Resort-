package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reservations")
public class Reservation {
    @Id
    private String id;
    private String reservationNo;
    private String guestId;
    private String roomId;
    private Date checkIn;
    private Date checkOut;
    private String status;
    private Boolean isPaid;
}
