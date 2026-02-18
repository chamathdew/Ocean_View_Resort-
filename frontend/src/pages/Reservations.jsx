import React, { useState, useEffect } from "react";
import axios from "axios";
import { downloadInvoice } from "../utils/invoice";
import { ROOM_DATA } from "../utils/roomData";

const API = `http://${window.location.hostname}:5000`;

export default function Reservations() {
  // --- STATE ---
  const [roomType, setRoomType] = useState("Double");
  const [checkIn, setCheckIn] = useState("2026-03-01");
  const [checkOut, setCheckOut] = useState("2026-03-05");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");

  // guest form
  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [scanningId, setScanningId] = useState(false);

  // system
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [reservationData, setReservationData] = useState(null);

  const currentRoomInfo = ROOM_DATA[roomType] || ROOM_DATA.Double;

  // --- ACTIONS ---
  async function checkAvailability() {
    setLoading(true);
    setReservationData(null);
    try {
      // Small delay for UI smoothness
      await new Promise(r => setTimeout(r, 300));
      const { data } = await axios.get(`${API}/api/reservations/available`, {
        params: { roomType, checkIn, checkOut },
      });
      setAvailableRooms(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Handle Search Click
  const handleSearch = () => {
    checkAvailability();
  };

  async function handleIdUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    setScanningId(true);
    setMsg("");
    try {
      const formData = new FormData();
      formData.append('idImage', file);
      const { data } = await axios.post(`${API}/api/scan-id`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (data.fullName) setFullName(data.fullName);
      if (data.contactNumber) setContactNumber(data.contactNumber);
      if (data.idNumber) setIdNumber(data.idNumber);
      if (data.dateOfBirth) setDateOfBirth(data.dateOfBirth);
      if (data.gender) setGender(data.gender);
      setMsg("✅ ID Scanned Successfully");
    } catch (err) {
      setMsg("❌ Scan failed. Please enter details.");
    } finally {
      setScanningId(false);
    }
  }

  async function bookNow() {
    setMsg("");
    if (!selectedRoomId) return setMsg("⚠️ Please select a suite first.");
    if (!fullName || !idNumber || !contactNumber) return setMsg("⚠️ Please fill in all required guest details.");

    setLoading(true);
    try {
      const payload = {
        fullName, contactNumber, idNumber, dateOfBirth, gender,
        roomId: selectedRoomId, checkIn, checkOut
      };

      if (!localStorage.getItem("user")) {
        setMsg("⚠️ Please sign in to complete booking.");
        setTimeout(() => window.location.href = "/login", 1500);
        return;
      }

      const { data } = await axios.post(`${API}/api/reservations`, payload);
      setReservationData(data);
      setMsg("✅ Booking Success!");
      setFullName(""); setIdNumber(""); setContactNumber("");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Booking Failed");
    } finally {
      setLoading(false);
    }
  }

  // --- RENDER SUCCESS ---
  if (reservationData) {
    return (
      <div className="container" style={{ paddingTop: 80, paddingBottom: 100, maxWidth: 600 }}>
        <div className="glass-panel" style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 60, marginBottom: 24 }}>🎉</div>
          <h2 style={{ fontSize: 32, marginBottom: 12 }}>Booking Confirmed!</h2>
          <p style={{ color: "var(--text-light)", marginBottom: 32 }}>
            Ref: <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{reservationData.reservationNo}</span>
          </p>
          <button onClick={() => downloadInvoice(reservationData)} className="btn btn-primary" style={{ width: "100%", marginBottom: 16 }}>
            Download Invoice 📄
          </button>
          <button onClick={() => { setReservationData(null); setSelectedRoomId(""); }} className="ghost">
            Book Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 1400, padding: 0 }}>

      {/* HERO HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 150%)',
        borderRadius: '0 0 40px 40px',
        padding: '60px 20px 100px',
        textAlign: 'center',
        color: 'white',
        marginBottom: -50,
        position: 'relative'
      }}>
        <h1 style={{ fontSize: 42, margin: '0 0 16px', textShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>Book Your Paradise</h1>
        <p style={{ fontSize: 18, opacity: 0.9, maxWidth: 600, margin: '0 auto' }}>Select your dates and suite to instantly view availability.</p>
      </div>

      {/* FLOATING SEARCH BAR */}
      <div className="container" style={{ position: 'relative', zIndex: 10, padding: '0 40px', marginBottom: 80, marginTop: -40 }}>
        <div className="glass-panel" style={{
          padding: '30px 40px',
          borderRadius: 100,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 48,
          alignItems: 'center',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
          background: 'var(--card-bg)',
          maxWidth: 1100,
          margin: '0 auto',
          minHeight: 100
        }}>

          {/* Date Inputs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 2, paddingLeft: 10, borderRight: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>📅</span>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Check-in</label>
                <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)}
                  style={{ border: 'none', background: 'transparent', fontWeight: 600, fontSize: 15, color: 'var(--text)', fontFamily: 'inherit' }} />
              </div>
            </div>
            <span style={{ color: 'var(--border)' }}>|</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Check-out</label>
                <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)}
                  style={{ border: 'none', background: 'transparent', fontWeight: 600, fontSize: 15, color: 'var(--text)', fontFamily: 'inherit' }} />
              </div>
            </div>
          </div>

          {/* Room Select */}
          <div style={{ flex: 1, paddingRight: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>🛏️</span>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Experience</label>
                <select value={roomType} onChange={e => { setRoomType(e.target.value); setSelectedRoomId(""); }}
                  style={{ width: '100%', border: 'none', background: 'transparent', fontWeight: 600, fontSize: 15, color: 'var(--text)', padding: 0, cursor: 'pointer' }}>
                  <option>Single</option>
                  <option>Double</option>
                  <option>Family</option>
                  <option>Suite</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div>
            <button onClick={handleSearch} className="btn btn-primary" style={{ borderRadius: 50, padding: '12px 32px', height: 50 }}>
              {loading ? "Searching..." : "Check Availability"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 40px', display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 60, alignItems: 'start', maxWidth: 1400, margin: '0 auto' }}>

        {/* LEFT COLUMN: ROOMS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: 18 }}>
              {availableRooms.length > 0 ? `Available Suites (${availableRooms.length})` : "Start Your Search"}
            </h3>
            {loading && <span style={{ fontSize: 12, color: 'var(--primary)' }}>Refreshing...</span>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {!loading && availableRooms.length === 0 && (
              <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)', background: 'var(--card)', borderRadius: 24, padding: 40, border: '1px dashed var(--border)' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>🗓️</div>
                <p>Select your dates and experience above, then click <b>Check Availability</b> to find your room.</p>
              </div>
            )}

            {availableRooms.map(room => (
              <div key={room._id} onClick={() => setSelectedRoomId(room._id)}
                className="glass-panel"
                style={{
                  padding: 24,
                  display: 'flex',
                  gap: 20,
                  cursor: 'pointer',
                  border: selectedRoomId === room._id ? '2px solid var(--accent)' : '1px solid var(--border)',
                  transform: selectedRoomId === room._id ? 'scale(1.02)' : 'none',
                  transition: 'all 0.3s ease'
                }}>
                <img src={currentRoomInfo.images[0]} style={{ width: 120, height: 100, borderRadius: 16, objectFit: 'cover' }} alt="" />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 style={{ margin: 0, fontSize: 18 }}>Suite {room.roomNumber}</h4>
                    {selectedRoomId === room._id && <span style={{ color: 'var(--accent)', fontWeight: 700 }}>SELECTED</span>}
                  </div>
                  <p style={{ margin: '4px 0 12px', fontSize: 14, color: 'var(--text-muted)' }}>Ocean Facing • 2nd Floor • King Bed</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>
                      LKR {currentRoomInfo.price.toLocaleString()}
                    </span>
                    <span style={{ fontSize: 12, opacity: 0.6 }}>/ night</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: CHECKOUT */}
        <div className="glass-panel" style={{ padding: 32, position: 'sticky', top: 100 }}>
          <h3 style={{ marginTop: 0, marginBottom: 24, fontSize: 20 }}>Guest Details</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Scanner */}
            <div style={{ background: 'rgba(var(--primary-rgb), 0.05)', borderRadius: 16, padding: 12 }}>
              <input type="file" id="idscan" style={{ display: 'none' }} accept="image/*" onChange={handleIdUpload} disabled={scanningId} />
              <label htmlFor="idscan" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>
                {scanningId ? "Scanning..." : "📸 Scan ID to Auto-fill"}
              </label>
            </div>

            <div className="field">
              <label className="label">Full Name</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)} style={{ padding: 12 }} placeholder="Your Name" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="field">
                <label className="label">ID/Passport</label>
                <input value={idNumber} onChange={e => setIdNumber(e.target.value)} style={{ padding: 12 }} />
              </div>
              <div className="field">
                <label className="label">Contact</label>
                <input value={contactNumber} onChange={e => setContactNumber(e.target.value)} style={{ padding: 12 }} />
              </div>
            </div>

            <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }}></div>

            {/* Price Calculation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
              <span style={{ color: 'var(--text-muted)' }}>Price per Night</span>
              <span>LKR {currentRoomInfo.price.toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
              <span style={{ color: 'var(--text-muted)' }}>Duration</span>
              <span>{Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (86400000)))} Nights</span>
            </div>

            <div style={{ width: '100%', borderTop: '1px dashed var(--border)', margin: '8px 0' }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 800, marginTop: 8 }}>
              <span>Total Due</span>
              <span style={{ color: 'var(--primary)' }}>
                LKR {(currentRoomInfo.price * Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (86400000)))).toLocaleString()}
              </span>
            </div>

            {msg && <div style={{ background: msg.includes('✅') ? 'rgba(0,255,0,0.1)' : 'rgba(255,0,0,0.1)', padding: 10, borderRadius: 8, fontSize: 13, textAlign: 'center', color: msg.includes('✅') ? 'green' : 'red' }}>{msg}</div>}

            <button onClick={bookNow} disabled={loading} className="btn btn-accent" style={{ width: '100%', marginTop: 10, height: 50 }}>
              {loading ? "Processing..." : selectedRoomId ? "Confirm Booking" : "Select a Room First"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
