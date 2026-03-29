package com.example.demo.dto;

// lombok annotations removed - explicit getters/setters provided below
import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Date;

public class ReservationRequest {
    private String guestId;

    @Valid
    private com.example.demo.model.Guest guestDetails;

    @NotBlank(message = "Room ID is required")
    private String roomId;

    @NotNull(message = "Check-in date is required")
    private Date checkIn;

    @NotNull(message = "Check-out date is required")
    private Date checkOut;

    // Explicit getters to avoid IDE/Lombok annotation processing issues
    public String getGuestId() {
        return this.guestId;
    }

    public com.example.demo.model.Guest getGuestDetails() {
        return this.guestDetails;
    }

    public String getRoomId() {
        return this.roomId;
    }

    public Date getCheckIn() {
        return this.checkIn;
    }

    public Date getCheckOut() {
        return this.checkOut;
    }

    // And explicit setters used elsewhere
    public void setGuestId(String guestId) { this.guestId = guestId; }
    public void setGuestDetails(com.example.demo.model.Guest guestDetails) { this.guestDetails = guestDetails; }
    public void setRoomId(String roomId) { this.roomId = roomId; }
    public void setCheckIn(Date checkIn) { this.checkIn = checkIn; }
    public void setCheckOut(Date checkOut) { this.checkOut = checkOut; }
}
