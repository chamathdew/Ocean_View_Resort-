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

      // reset guest fields
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
    <div className="container" style={{ padding: "40px 18px" }}>
      <div className="section-title">
        <h2>Book a Room</h2>
        <span className="badge">Instant Confirmation</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 30 }}>
        {/* Left Column: Search */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: "#fff", padding: 24, borderRadius: 18, border: "1px solid var(--border)" }}>
            <h3 style={{ marginTop: 0, marginBottom: 20, fontSize: 18 }}>1) Check Availability</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
              <div className="field">
                <div className="label">Room Type</div>
                <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                  <option>Single</option>
                  <option>Double</option>
                  <option>Family</option>
                  <option>Suite</option>
                </select>
              </div>

              <div className="field">
                <div className="label">Check-in Date</div>
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
              </div>

              <div className="field">
                <div className="label">Check-out Date</div>
                <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
              </div>

              <button className="btn-primary" onClick={checkAvailability} disabled={loading} style={{ marginTop: 10 }}>
                {loading ? "Checking..." : "Check Availability"}
              </button>
            </div>
          </div>

          <div style={{ background: "#fff", padding: 24, borderRadius: 18, border: "1px solid var(--border)" }}>
            <h3 style={{ marginTop: 0, marginBottom: 20, fontSize: 18 }}>2) Select Room</h3>
            {availableRooms.length > 0 ? (
              <div style={{ display: "grid", gap: 10 }}>
                {availableRooms.map((room) => (
                  <button
                    key={room._id}
                    onClick={() => setSelectedRoomId(room._id)}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 12,
                      border: selectedRoomId === room._id ? "2px solid var(--accent)" : "1px solid var(--border)",
                      background: selectedRoomId === room._id ? "rgba(254,187,2,.08)" : "transparent",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>Room {room.roomNumber}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{room.roomType} · {room.status}</div>
                  </button>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--muted)", fontSize: 14 }}>Search above to see available rooms.</p>
            )}
          </div>
        </div>

        {/* Right Column: Guest Details */}
        <div style={{ background: "#fff", padding: 30, borderRadius: 18, border: "1px solid var(--border)", height: "fit-content" }}>
          <h3 style={{ marginTop: 0, marginBottom: 25, fontSize: 18 }}>3) Guest Details & Payment</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="field">
              <div className="label">Full Name*</div>
              <input
                placeholder="Enter guest name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="field">
              <div className="label">Contact Number*</div>
              <input
                placeholder="Phone number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div>

            <div className="field">
              <div className="label">Home Address</div>
              <input
                placeholder="Mailing address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div style={{ marginTop: 10, padding: 20, background: "#f8fafc", borderRadius: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 700 }}>LKR 28,000</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--muted)" }}>
                <span>Taxes & Fees</span>
                <span>Included</span>
              </div>
            </div>

            <button className="btn-accent" onClick={bookNow} disabled={loading || !selectedRoomId} style={{ height: 52, fontSize: 16 }}>
              {loading ? "Processing..." : "Confirm Reservation"}
            </button>

            {reservationNo && (
              <div style={{ background: "#e8f5e9", padding: 15, borderRadius: 12, border: "1px solid #c8e6c9", textAlign: "center" }}>
                <div style={{ fontSize: 13, color: "#2e7d32" }}>Success! Your Reservation Number:</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#1b5e20" }}>{reservationNo}</div>
              </div>
            )}

            {msg && <p style={{ textAlign: "center", color: msg.includes("✅") ? "#2e7d32" : "#d32f2f", fontSize: 14 }}>{msg}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

