import React, { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function Reservations() {
  // search availability
  const [roomType, setRoomType] = useState("Double");
  const [checkIn, setCheckIn] = useState("2026-03-01");
  const [checkOut, setCheckOut] = useState("2026-03-05");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");

  // guest form
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [reservationNo, setReservationNo] = useState("");

  async function checkAvailability() {
    setMsg("");
    setReservationNo("");
    setSelectedRoomId("");
    setLoading(true);

    try {
      const { data } = await axios.get(`${API}/api/reservations/available`, {
        params: { roomType, checkIn, checkOut },
      });
      setAvailableRooms(data);
      if (!data.length) setMsg("No rooms available for these dates.");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Error checking availability");
    } finally {
      setLoading(false);
    }
  }

  async function bookNow() {
    setMsg("");
    setReservationNo("");

    if (!selectedRoomId) {
      setMsg("Please select a room first.");
      return;
    }
    if (!fullName || !contactNumber) {
      setMsg("Full name and contact number are required.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName,
        address,
        contactNumber,
        roomId: selectedRoomId,
        checkIn,
        checkOut,
      };

      const { data } = await axios.post(`${API}/api/reservations`, payload);

      setReservationNo(data.reservationNo);
      setMsg("✅ Reservation created successfully!");

      // reset guest fields (optional)
      setFullName("");
      setAddress("");
      setContactNumber("");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Error creating reservation");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h2>New Reservation</h2>

      {/* Availability */}
      <div style={{ border: "1px solid #333", padding: 15, borderRadius: 10, marginBottom: 15 }}>
        <h3 style={{ marginTop: 0 }}>1) Check Availability</h3>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <label>
            Room Type<br />
            <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
              <option>Single</option>
              <option>Double</option>
              <option>Family</option>
              <option>Suite</option>
            </select>
          </label>

          <label>
            Check-in<br />
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
          </label>

          <label>
            Check-out<br />
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
          </label>

          <div style={{ alignSelf: "end" }}>
            <button onClick={checkAvailability} disabled={loading}>
              {loading ? "Checking..." : "Check"}
            </button>
          </div>
        </div>
      </div>

      {/* Available rooms list */}
      <div style={{ border: "1px solid #333", padding: 15, borderRadius: 10, marginBottom: 15 }}>
        <h3 style={{ marginTop: 0 }}>2) Select a Room</h3>

        {availableRooms.length > 0 ? (
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            {availableRooms.map((room) => (
              <button
                key={room._id}
                onClick={() => setSelectedRoomId(room._id)}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: selectedRoomId === room._id ? "2px solid #00c853" : "1px solid #555",
                  cursor: "pointer",
                  textAlign: "left",
                  background: "transparent",
                  color: "inherit",
                }}
              >
                <div><b>{room.roomNumber}</b></div>
                <div>{room.roomType}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>{room.status}</div>
              </button>
            ))}
          </div>
        ) : (
          <p style={{ opacity: 0.8 }}>Run “Check” to see available rooms.</p>
        )}
      </div>

      {/* Guest details */}
      <div style={{ border: "1px solid #333", padding: 15, borderRadius: 10 }}>
        <h3 style={{ marginTop: 0 }}>3) Guest Details + Book</h3>

        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
          <label>
            Full Name*<br />
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </label>

          <label>
            Contact Number*<br />
            <input value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
          </label>

          <label style={{ gridColumn: "1 / -1" }}>
            Address<br />
            <input value={address} onChange={(e) => setAddress(e.target.value)} />
          </label>
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={bookNow} disabled={loading}>
            {loading ? "Booking..." : "Book Now"}
          </button>

          {reservationNo && (
            <div style={{ padding: "8px 10px", border: "1px solid #00c853", borderRadius: 8 }}>
              Reservation No: <b>{reservationNo}</b>
            </div>
          )}
        </div>

        {msg && <p style={{ marginTop: 10 }}>{msg}</p>}
      </div>
    </div>
  );
}
