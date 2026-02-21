import { useState } from "react";
import axios from "axios";
import { downloadInvoice } from "../utils/invoice";

const API = `http://${window.location.hostname}:5000`;

export default function ReservationList() {
  const [reservationNo, setReservationNo] = useState("");
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      setReservationNo(ref);
      search(ref);
    }
  }, []);

  async function search(refToSearch = reservationNo) {
    if (!refToSearch) return;
    setMsg("");
    setData(null);
    setLoading(true);

    try {
      const res = await axios.get(`${API}/api/reservations/${refToSearch}`);
      setData(res.data);
    } catch (err) {
      setMsg(err?.response?.data?.message || "We couldn't find a reservation with that number. Please verify and try again.");
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

              <div className="concierge-box mt-20">
                <p>Need to make changes? Please contact our concierge desk at <br /> <strong className="primary-text">+94 11 234 5678</strong></p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
