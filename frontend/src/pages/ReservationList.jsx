import { useState } from "react";
import axios from "axios";

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
    } catch {
      setMsg("Reservation not found. Please check the number.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ padding: "60px 18px", maxWidth: 600 }}>
      <div className="section-title" style={{ justifyContent: "center", textAlign: "center", flexDirection: "column" }}>
        <h2>Find Your Reservation</h2>
        <p style={{ color: "var(--muted)", marginTop: 8 }}>Enter your OVR number to see booking details.</p>
      </div>

      <div style={{ background: "#fff", padding: 30, borderRadius: 20, border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <div className="field" style={{ flex: 1 }}>
            <input
              placeholder="e.g. OVR-1712345678"
              value={reservationNo}
              onChange={(e) => setReservationNo(e.target.value)}
              style={{ height: 50, fontSize: 16 }}
            />
          </div>
          <button className="btn-primary" onClick={search} disabled={loading} style={{ height: 50, padding: "0 25px" }}>
            {loading ? "..." : "Search"}
          </button>
        </div>

        {msg && <p style={{ marginTop: 20, textAlign: "center", color: "#d32f2f", fontSize: 14 }}>{msg}</p>}

        {data && (
          <div style={{ marginTop: 30, paddingTop: 25, borderTop: "2px dashed var(--border)" }}>
            <div style={{ display: "grid", gap: 15 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)" }}>Reservation No</span>
                <span style={{ fontWeight: 800, color: "var(--primary)" }}>{data.reservationNo}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)" }}>Status</span>
                <span style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: "#e3f2fd",
                  color: "#0d47a1",
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase"
                }}>
                  {data.status}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)" }}>Check-in</span>
                <span style={{ fontWeight: 600 }}>{new Date(data.checkIn).toLocaleDateString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)" }}>Check-out</span>
                <span style={{ fontWeight: 600 }}>{new Date(data.checkOut).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

