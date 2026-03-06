package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
// lombok annotations removed - explicit constructors/getters/setters used
import java.util.Date;

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
    private Date lastModified;

    // Constructors
    public Reservation() {}

    public Reservation(String id, String reservationNo, String guestId, String roomId, Date checkIn, Date checkOut, String status, Boolean isPaid, Date lastModified) {
        this.id = id;
        this.reservationNo = reservationNo;
        this.guestId = guestId;
        this.roomId = roomId;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.status = status;
        this.isPaid = isPaid;
        this.lastModified = lastModified;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getReservationNo() { return reservationNo; }
    public void setReservationNo(String reservationNo) { this.reservationNo = reservationNo; }

    public String getGuestId() { return guestId; }
    public void setGuestId(String guestId) { this.guestId = guestId; }

    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }

    public Date getCheckIn() { return checkIn; }
    public void setCheckIn(Date checkIn) { this.checkIn = checkIn; }

    public Date getCheckOut() { return checkOut; }
    public void setCheckOut(Date checkOut) { this.checkOut = checkOut; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getIsPaid() { return isPaid; }
    public void setIsPaid(Boolean isPaid) { this.isPaid = isPaid; }

    public Date getLastModified() { return lastModified; }
    public void setLastModified(Date lastModified) { this.lastModified = lastModified; }
}
