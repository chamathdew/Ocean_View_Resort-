import React, { useState } from "react";
import axios from "axios";
import { downloadInvoice } from "../utils/invoice";
import { ROOM_DATA } from "../utils/roomData";

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
  const [reservationData, setReservationData] = useState(null);

  const selectedRoom = availableRooms.find(r => r._id === selectedRoomId);
  const currentRoomInfo = ROOM_DATA[roomType] || ROOM_DATA.Double;

  async function checkAvailability() {
    setMsg("");
    setReservationData(null);
    setSelectedRoomId("");
    setLoading(true);

    try {
      const { data } = await axios.get(`${API}/api/reservations/available`, {
        params: { roomType, checkIn, checkOut },
      });
      setAvailableRooms(data);
      if (!data.length) setMsg("We're sorry, no suites of this type are available for the selected dates.");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Error checking availability");
    } finally {
      setLoading(false);
    }
  }

  async function bookNow() {
    setMsg("");
    setReservationData(null);

    if (!selectedRoomId) {
      setMsg("Selection Required: Please choose a suite from the available options.");
      return;
    }
    if (!fullName || !contactNumber) {
      setMsg("Information Required: Please provide your full name and contact details.");
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

      setReservationData(data);
      setMsg("✅ Your sanctuary awaits! Booking confirmed.");

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
    <div className="container" style={{ paddingTop: 60, paddingBottom: 100 }}>
      <div className="section-title">
        <span className="badge">Booking Portal</span>
        <h2>Reserve Your Experience</h2>
        <p style={{ color: 'var(--text-light)' }}>Secure your stay at Ocean View Resort in just a few steps.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 40, alignItems: 'start' }}>
        {/* Left Column: Search & Selection */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {/* Room Type Preview Card */}
          <div style={{
            background: "var(--card)",
            borderRadius: 24,
            boxShadow: 'var(--shadow-lg)',
            border: "2px solid var(--accent)",
            overflow: 'hidden'
          }}>
            <div style={{
              height: 240,
              background: `url(${currentRoomInfo.images[0]}) center/cover no-repeat`,
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                padding: '40px 24px 20px'
              }}>
                <div style={{ color: 'white' }}>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.9, marginBottom: 4 }}>
                    {currentRoomInfo.category}
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800 }}>{currentRoomInfo.name}</div>
                </div>
              </div>
            </div>

            <div style={{ padding: 24 }}>
              <p style={{ fontSize: 14, color: 'var(--text-light)', lineHeight: 1.6, marginBottom: 20 }}>
                {currentRoomInfo.description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                {currentRoomInfo.amenities.slice(0, 4).map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <span style={{ color: 'var(--accent)', fontSize: 16 }}>✦</span> {item}
                  </div>
                ))}
              </div>

              <div style={{
                padding: '16px 20px',
                background: 'var(--accent-soft)',
                borderRadius: 16,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid var(--accent)'
              }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>Price per Night</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>
                  LKR {currentRoomInfo.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div style={{ background: "var(--card)", padding: 32, borderRadius: 24, boxShadow: 'var(--shadow-md)', border: "1px solid var(--border)" }}>
            <h3 style={{ marginTop: 0, marginBottom: 24, fontSize: 20 }}>1. Search Availability</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="field">
                <div className="label">Suite Category</div>
                <select value={roomType} onChange={(e) => {
                  setRoomType(e.target.value);
                  setAvailableRooms([]);
                  setSelectedRoomId("");
                }}>
                  <option>Single</option>
                  <option>Double</option>
                  <option>Family</option>
                  <option>Suite</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                <div className="field">
                  <div className="label">Check-in</div>
                  <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                </div>
                <div className="field">
                  <div className="label">Check-out</div>
                  <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                </div>
              </div>

              <button className="btn btn-primary" onClick={checkAvailability} disabled={loading} style={{ width: '100%', marginTop: 10 }}>
                {loading ? "Searching..." : "Find Available Suites"}
              </button>
            </div>
          </div>

          <div style={{ background: "var(--card)", padding: 32, borderRadius: 24, boxShadow: 'var(--shadow-md)', border: "1px solid var(--border)" }}>
            <h3 style={{ marginTop: 0, marginBottom: 24, fontSize: 20 }}>2. Select Your Suite</h3>
            {availableRooms.length > 0 ? (
              <div style={{ display: "grid", gap: 12 }}>
                {availableRooms.map((room) => (
                  <div
                    key={room._id}
                    onClick={() => setSelectedRoomId(room._id)}
                    style={{
                      padding: "20px",
                      borderRadius: 16,
                      border: selectedRoomId === room._id ? "2px solid var(--accent)" : "1px solid var(--border)",
                      background: selectedRoomId === room._id ? "var(--accent-soft)" : "var(--bg)",
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: 16 }}>Suite {room.roomNumber}</div>
                      <div style={{ fontSize: 13, color: "var(--text-light)", marginTop: 4 }}>{room.roomType} Category • Pool Side</div>
                    </div>
                    {selectedRoomId === room._id && (
                      <div style={{ background: 'var(--accent)', color: 'var(--primary)', padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700 }}>SELECTED</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0', color: "var(--text-light)", fontSize: 14 }}>
                <p>Enter your travel dates above to see available suites.</p>
              </div>
            )}
          </div>

          {selectedRoomId && (
            <div style={{
              background: "var(--card)",
              padding: 32,
              borderRadius: 24,
              boxShadow: 'var(--shadow-md)',
              border: "1px solid var(--accent)",
              animation: 'fadeIn 0.4s ease-out'
            }}>
              <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: 20 }}>Suite Details</h3>
              <p style={{ fontSize: 14, color: 'var(--text-light)', marginBottom: 20, lineHeight: 1.6 }}>{currentRoomInfo.description}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                {currentRoomInfo.amenities.map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <span style={{ color: 'var(--accent)' }}>✦</span> {item}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px dashed var(--border)' }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Maximum Occupancy</span>
                <span style={{ fontSize: 14, color: 'var(--primary)', fontWeight: 700 }}>{currentRoomInfo.capacity}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Guest Details */}
        <div style={{ background: "var(--card)", padding: 40, borderRadius: 24, boxShadow: 'var(--shadow-lg)', border: "1px solid var(--border)", position: 'sticky', top: 120 }}>
          <h3 style={{ marginTop: 0, marginBottom: 32, fontSize: 20 }}>3. Provide Guest Details</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="field">
              <div className="label">Full Name</div>
              <input
                placeholder="As per Passport / ID"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="field">
              <div className="label">Contact Number</div>
              <input
                placeholder="+94 7X XXX XXXX"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div>

            <div className="field">
              <div className="label">Special Requests (Optional)</div>
              <input
                placeholder="Dietary needs, airport pick-up, etc."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div style={{ margin: '10px 0', padding: 24, background: "var(--bg)", borderRadius: 20, border: '1px solid var(--border)' }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ color: 'var(--text-light)' }}>Suite Rate / Night</span>
                <span style={{ fontWeight: 700 }}>LKR {currentRoomInfo.price.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ color: 'var(--text-light)' }}>Taxes & Services</span>
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Included</span>
              </div>
              <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }}></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 800 }}>
                <span>Estimated Total</span>
                <span style={{ color: 'var(--primary)' }}>LKR {currentRoomInfo.price.toLocaleString()}</span>
              </div>
            </div>

            <button className="btn btn-accent" onClick={bookNow} disabled={loading || !selectedRoomId} style={{ height: 56, fontSize: 16, width: '100%' }}>
              {loading ? "Confirming..." : "Finalize Booking"}
            </button>

            {reservationData && (
              <div style={{ background: "var(--accent-soft)", padding: 24, borderRadius: 20, border: "1px solid var(--accent)", textAlign: "center", animation: 'fadeIn 0.5s ease-out' }}>
                <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Booking Confirmed</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--primary)", margin: '8px 0' }}>{reservationData.reservationNo}</div>
                <button
                  onClick={() => downloadInvoice(reservationData)}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: 15, fontSize: 14 }}
                >
                  Download PDF Invoice
                </button>
                <div style={{ fontSize: 12, color: "var(--text-light)", marginTop: 10 }}>Please present this code at check-in.</div>
              </div>
            )}

            {msg && <p style={{ textAlign: "center", color: msg.includes("✅") ? "var(--accent)" : "#991b1b", fontSize: 14, fontWeight: 500, margin: 0 }}>{msg}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
