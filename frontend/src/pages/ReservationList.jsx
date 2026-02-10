import { useState } from "react";
import axios from "axios";
import { downloadInvoice } from "../utils/invoice";

const API = "http://localhost:5000";

export default function ReservationList() {
  const [reservationNo, setReservationNo] = useState("");
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function search() {
    if (!reservationNo) return;
    setMsg("");
    setData(null);
    setLoading(true);

    try {
      const res = await axios.get(`${API}/api/reservations/${reservationNo}`);
      setData(res.data);
    } catch (err) {
      setMsg(err?.response?.data?.message || "We couldn't find a reservation with that number. Please verify and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ paddingTop: 100, paddingBottom: 150, maxWidth: 700 }}>
      <div className="section-title" style={{ textAlign: "center", marginBottom: 48 }}>
        <span className="badge">Booking Recovery</span>
        <h2 style={{ fontSize: 42 }}>Track Your Sanctuary</h2>
        <p style={{ color: "var(--text-light)", marginTop: 12 }}>Enter your unique reservation code to access your booking details and status.</p>
      </div>

      <div style={{ background: "var(--card)", padding: 48, borderRadius: 32, boxShadow: 'var(--shadow-lg)', border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", gap: 16 }}>
          <div className="field" style={{ flex: 1 }}>
            <input
              placeholder="e.g. OVR-1712345678"
              value={reservationNo}
              onChange={(e) => setReservationNo(e.target.value)}
              style={{ height: 56, fontSize: 16, background: '#f8fafc' }}
            />
          </div>
          <button className="btn btn-primary" onClick={search} disabled={loading} style={{ height: 56, padding: "0 32px" }}>
            {loading ? "Searching..." : "Retrieve Details"}
          </button>
        </div>

        {msg && <p style={{ marginTop: 24, padding: '12px', background: '#fee2e2', color: '#991b1b', borderRadius: 12, textAlign: "center", fontSize: 14, fontWeight: 500 }}>{msg}</p>}

        {data && (
          <div style={{ marginTop: 48, paddingTop: 40, borderTop: "1px solid var(--border)", animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ display: "grid", gap: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
                <span style={{ color: "var(--text-light)", fontWeight: 500 }}>Reservation Reference</span>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontWeight: 800, color: "var(--primary)", fontSize: 18 }}>{data.reservationNo}</span>
                  <button onClick={() => downloadInvoice(data)} className="ghost" style={{ padding: "6px 14px", fontSize: 12 }}>📄 Download PDF</button>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
                <span style={{ color: "var(--text-light)", fontWeight: 500 }}>Current Status</span>
                <span style={{
                  padding: "6px 16px",
                  borderRadius: 100,
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  border: '1px solid rgba(212, 175, 55, 0.2)'
                }}>
                  {data.status.replace('_', ' ')}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
                <span style={{ color: "var(--text-light)", fontWeight: 500 }}>Check-in Arrival</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{new Date(data.checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
                <span style={{ color: "var(--text-light)", fontWeight: 500 }}>Check-out Departure</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{new Date(data.checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>

              <div style={{ marginTop: 20, padding: 24, background: 'var(--bg)', borderRadius: 20, border: '1px solid var(--border)', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--text-light)' }}>Need to make changes? Please contact our concierge desk at <br /> <strong style={{ color: 'var(--primary)' }}>+94 11 234 5678</strong></p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
