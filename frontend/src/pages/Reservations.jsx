import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { downloadInvoice } from "../utils/invoice";
import { ROOM_DATA } from "../utils/roomData";

const API = `http://${window.location.hostname}:8080`;

export default function Reservations() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // --- STATE ---
  const [roomType, setRoomType] = useState(queryParams.get("type") || "Double");
  const [checkIn, setCheckIn] = useState(queryParams.get("checkIn") || "2026-03-01");
  const [checkOut, setCheckOut] = useState(queryParams.get("checkOut") || "2026-03-05");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [counts, setCounts] = useState({ Single: 0, Double: 0, Family: 0, Suite: 0 });

  useEffect(() => {
    // Fetch all rooms to compute availability counts for the dropdown
    axios.get(`${API}/api/rooms`).then(({ data }) => {
      const c = { Single: 0, Double: 0, Family: 0, Suite: 0 };
      data.forEach(r => {
        if (r.status === 'active') c[r.roomType] = (c[r.roomType] || 0) + 1;
      });
      setCounts(c);
      
      // Auto-trigger search if navigated with dates
      if (queryParams.get("checkIn") && queryParams.get("checkOut")) {
        setAvailableRooms(data.filter(r => r.roomType === (queryParams.get("type") || "Double") && r.status === 'active'));
      }
    }).catch(console.error);
    // eslint-disable-next-line
  }, []);

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
      const { data } = await axios.get(`${API}/api/rooms`);
      setAvailableRooms(data.filter(r => r.roomType === roomType && r.status === 'active'));
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
      const { data } = await axios.post(`http://localhost:8082/api/scan-id`, formData, {
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

  const handleWhatsAppShare = () => {
    if (!reservationData) return;
    const message = `*Ocean View Resort - Booking Confirmation* 🏝️\n\n` +
      `Hello! My booking at Ocean View Resort is confirmed.\n\n` +
      `*Reservation No:* ${reservationData.reservationNo}\n` +
      `*Check-in:* ${new Date(checkIn).toLocaleDateString()}\n` +
      `*Check-out:* ${new Date(checkOut).toLocaleDateString()}\n\n` +
      `You can view my digital invoice here: ${window.location.origin}/search?ref=${reservationData.reservationNo}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${contactNumber.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

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
          <button onClick={handleWhatsAppShare} className="btn btn-accent" style={{ width: "100%", marginBottom: 24, background: '#25D366', color: 'white', border: 'none' }}>
            Get Invoice on WhatsApp 💬
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
      <div className="booking-hero">
        <h1>Book Your Paradise</h1>
        <p>Select your dates and suite to instantly view availability.</p>
      </div>

      {/* FLOATING SEARCH BAR */}
      <div className="booking-search-container">
        <div className="booking-search-bar glass-panel">
          {/* Date Inputs */}
          <div className="search-dates">
            <div className="search-field">
              <span className="search-icon">📅</span>
              <div className="search-input-group">
                <label>Check-in</label>
                <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
              </div>
            </div>
            <span className="search-divider">|</span>
            <div className="search-field">
              <div className="search-input-group">
                <label>Check-out</label>
                <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Room Select */}
          <div className="search-experience">
            <div className="search-field">
              <span className="search-icon">🛏️</span>
              <div className="search-input-group">
                <label>Experience</label>
                <select value={roomType} onChange={e => { setRoomType(e.target.value); setSelectedRoomId(""); }}>
                  <option value="Single">Single ({counts.Single} Available)</option>
                  <option value="Double">Double ({counts.Double} Available)</option>
                  <option value="Family">Family ({counts.Family} Available)</option>
                  <option value="Suite">Suite ({counts.Suite} Available)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="search-actions">
            <button onClick={handleSearch} className="btn btn-primary search-btn">
              {loading ? "Searching..." : "Check Availability"}
            </button>
          </div>
        </div>
      </div>

      <div className="booking-content-grid">
        {/* LEFT COLUMN: ROOMS */}
        <div className="booking-main">
          <div className="section-header">
            <h3>
              {availableRooms.length > 0 ? `Available Suites (${availableRooms.length})` : "Start Your Search"}
            </h3>
            {loading && <span className="loading-badge">Refreshing...</span>}
          </div>

          <div className="room-list">
            {!loading && availableRooms.length === 0 && (
              <div className="empty-search-state">
                <div className="empty-icon">🗓️</div>
                <p>Select your dates and experience above, then click <b>Check Availability</b> to find your room.</p>
              </div>
            )}

            {availableRooms.map(room => {
              const rId = room.id || room._id;
              return (
              <div key={rId} onClick={() => setSelectedRoomId(rId)}
                className={`booking-room-card glass-panel ${selectedRoomId === rId ? 'selected' : ''}`}>
                <div className="room-card-img">
                  <img src={currentRoomInfo.images[0]} alt="" />
                </div>
                <div className="room-card-details">
                  <div className="room-card-header">
                    <h4>Suite {room.roomNumber}</h4>
                    {selectedRoomId === rId && <span className="selected-tag">SELECTED</span>}
                  </div>
                  <p className="room-card-features">Ocean Facing • 2nd Floor • King Bed</p>
                  <div className="room-card-price">
                    <span className="price-amount">LKR {currentRoomInfo.price.toLocaleString()}</span>
                    <span className="price-unit">/ night</span>
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>

        {/* RIGHT COLUMN: CHECKOUT */}
        <div className="booking-sidebar">
          <div className="glass-panel checkout-panel">
            <h3>Guest Details</h3>

            <div className="checkout-form">
              {/* Scanner */}
              <div className="scanner-container">
                <input type="file" id="idscan" style={{ display: 'none' }} accept="image/*" onChange={handleIdUpload} disabled={scanningId} />
                <label htmlFor="idscan" className="scanner-label">
                  {scanningId ? "Scanning..." : "📸 Scan ID to Auto-fill"}
                </label>
              </div>

              <div className="field">
                <label className="label">Full Name</label>
                <input className="input" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your Name" />
              </div>

              <div className="form-row">
                <div className="field">
                  <label className="label">ID/Passport</label>
                  <input className="input" value={idNumber} onChange={e => setIdNumber(e.target.value)} placeholder="ID Number" />
                </div>
                <div className="field">
                  <label className="label">Contact</label>
                  <input className="input" value={contactNumber} onChange={e => setContactNumber(e.target.value)} placeholder="Phone" />
                </div>
              </div>

              <div className="divider"></div>

              {/* Price Calculation */}
              <div className="calc-row">
                <span className="label">Price per Night</span>
                <span>LKR {currentRoomInfo.price.toLocaleString()}</span>
              </div>

              <div className="calc-row">
                <span className="label">Duration</span>
                <span>{Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (86400000)))} Nights</span>
              </div>

              <div className="divider-dashed"></div>

              <div className="total-due">
                <span>Total Due</span>
                <span className="total-amount">
                  LKR {(currentRoomInfo.price * Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (86400000)))).toLocaleString()}
                </span>
              </div>

              {msg && <div className={`msg-banner ${msg.includes('✅') ? 'success' : 'error'}`}>{msg}</div>}

              <button onClick={bookNow} disabled={loading} className="btn btn-accent confirm-btn">
                {loading ? "Processing..." : selectedRoomId ? "Confirm Booking" : "Select a Room First"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
