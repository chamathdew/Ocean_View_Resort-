import { useState, useEffect } from "react";
import axios from "axios";
import { downloadInvoice } from "../utils/invoice";

const API = import.meta.env.DEV ? "http://localhost:8080" : "";

export default function ReservationList() {
  const [reservationNo, setReservationNo] = useState("");
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [updateData, setUpdateData] = useState({ checkIn: "", checkOut: "" });
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      setReservationNo(ref);
      search(ref);
    }
    
    if (user && user.email) {
      fetchHistory(user.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchHistory(email) {
    try {
      const res = await axios.get(`${API}/api/reservations/by-email/${email}`);
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  }

  async function search(refToSearch = reservationNo) {
    if (!refToSearch) return;
    setMsg("");
    setData(null);
    setLoading(true);

    try {
      const res = await axios.get(`${API}/api/reservations/by-ref/${refToSearch}`);
      setData(res.data);
      if (res.data) {
          setUpdateData({
              checkIn: res.data.checkIn ? res.data.checkIn.split('T')[0] : '',
              checkOut: res.data.checkOut ? res.data.checkOut.split('T')[0] : ''
          });
      }
    } catch (err) {
      setMsg(err?.response?.data?.message || "We couldn't find a reservation with that number. Please verify and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function cancelBooking() {
    if (!data) return;
    if (!window.confirm("Are you sure you want to cancel this reservation? This action cannot be undone.")) return;

    setLoading(true);
    try {
      await axios.delete(`${API}/api/reservations/${data.id || data._id}`);
      setMsg("Your reservation has been successfully cancelled.");
      setData(null);
      setReservationNo("");
    } catch (err) {
      console.error(err);
      setMsg("Failed to cancel the reservation. Please contact support.");
    } finally {
      setLoading(false);
    }
  }

  async function updateBooking() {
      if (!data) return;
      if (!updateData.checkIn || !updateData.checkOut) {
          alert("Please select both dates to update.");
          return;
      }
      setLoading(true);
      try {
          await axios.put(`${API}/api/reservations/${data.id || data._id}`, {
              checkIn: updateData.checkIn,
              checkOut: updateData.checkOut
          });
          setMsg("Your reservation has been updated.");
          search(data.reservationNo); // refresh data
      } catch (err) {
          console.error(err);
          setMsg("Failed to update reservation. It may conflict with another booking.");
      } finally {
          setLoading(false);
      }
  }

  return (
    <div className="container booking-list-container">
      <div className="section-title text-center mb-48">
        <span className="badge">Booking Recovery</span>
        <h2 className="recovery-title">Track Your Sanctuary</h2>
        <p className="text-muted mt-12">Enter your unique reservation code to access your booking details and status.</p>
      </div>

      <div className="glass-panel recovery-card">
        <div className="recovery-search-box">
          <div className="field flex-1">
            <input
              className="input recovery-input"
              placeholder="e.g. OVR-1712345678"
              value={reservationNo}
              onChange={(e) => setReservationNo(e.target.value)}
            />
          </div>
          <button className="btn btn-primary recovery-btn" onClick={() => search()} disabled={loading}>
            {loading ? "Searching..." : "Retrieve Details"}
          </button>
        </div>

        {msg && <p className="error-banner mt-24">{msg}</p>}

        {data && (
          <div className="recovery-results mt-48 animate-fade-in">
            <div className="results-grid">
              <div className="result-row">
                <span className="result-label">Reservation Reference</span>
                <div className="result-value-group">
                  <span className="result-value res-no">{data.reservationNo}</span>
                  <button onClick={() => downloadInvoice(data)} className="ghost download-btn">📄 Download PDF</button>
                </div>
              </div>
              <div className="result-row">
                <span className="result-label">Current Status</span>
                <span className="status-badge">
                  {data.status.replace('_', ' ')}
                </span>
              </div>
              <div className="result-row">
                <span className="result-label">Check-in Arrival</span>
                <span className="result-value">{new Date(data.checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="result-row">
                <span className="result-label">Check-out Departure</span>
                <span className="result-value">{new Date(data.checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>

              <div className="concierge-box mt-20" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <p>Need to make changes? You can update your dates below or contact our concierge desk at <br /> <strong className="primary-text">+94 11 234 5678</strong></p>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                   
                   <form onSubmit={(e) => { e.preventDefault(); updateBooking(); }} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
                      <p style={{ fontSize: '13px', fontWeight: 'bold' }}>Update Dates</p>
                      <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div>
                              <label style={{ fontSize: '12px' }}>Check-in</label>
                              <input type="date" className="input" style={{ padding: '8px' }} value={updateData.checkIn} onChange={e => setUpdateData({ ...updateData, checkIn: e.target.value })} />
                          </div>
                          <div>
                              <label style={{ fontSize: '12px' }}>Check-out</label>
                              <input type="date" className="input" style={{ padding: '8px' }} value={updateData.checkOut} onChange={e => setUpdateData({ ...updateData, checkOut: e.target.value })} />
                          </div>
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ padding: '8px', fontSize: '13px' }} disabled={loading}>
                        {loading ? "Updating..." : "Update Reservation"}
                      </button>
                   </form>

                   <div style={{ borderTop: '1px solid var(--border-color)', margin: '15px 0' }}></div>
                   
                   <p style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '10px' }}>Would you like to cancel this booking?</p>
                   <button onClick={cancelBooking} className="btn ghost" style={{ color: '#ef4444', borderColor: '#ef4444', width: '100%' }} disabled={loading}>
                     {loading ? "Processing..." : "Cancel Reservation"}
                   </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="mt-48">
          <h3 className="mb-24" style={{ textAlign: 'center', color: 'var(--text-main)' }}>Your Previous Bookings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
            {history.map(h => (
              <div key={h.id || h._id} className="glass-panel p-24" style={{ cursor: 'pointer', transition: 'transform 0.2s', hover: { transform: 'translateY(-4px)' } }} onClick={() => { setReservationNo(h.reservationNo); search(h.reservationNo); window.scrollTo(0,0); }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{h.reservationNo}</span>
                  <span className="status-badge" style={{ fontSize: '10px' }}>{h.status}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  <p>📅 {new Date(h.checkIn).toLocaleDateString()} - {new Date(h.checkOut).toLocaleDateString()}</p>
                  <p>🏨 {h.roomId?.roomNumber} ({h.roomId?.roomType})</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
