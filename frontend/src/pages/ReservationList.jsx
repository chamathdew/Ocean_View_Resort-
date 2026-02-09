import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function ReservationList() {
  const [reservationNo, setReservationNo] = useState("");
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState("");

  async function search() {
    setMsg("");
    setData(null);

    try {
      const res = await axios.get(`${API}/api/reservations/${reservationNo}`);
      setData(res.data);
    } catch {
      setMsg("Reservation not found");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Reservation Search</h2>

      <input
        placeholder="Reservation Number"
        value={reservationNo}
        onChange={(e) => setReservationNo(e.target.value)}
      />
      <button onClick={search}>Search</button>

      {msg && <p>{msg}</p>}

      {data && (
        <div style={{ marginTop: 15, border: "1px solid #333", padding: 12 }}>
          <p><b>Reservation No:</b> {data.reservationNo}</p>
          <p><b>Status:</b> {data.status}</p>
          <p><b>Check-in:</b> {data.checkIn.slice(0,10)}</p>
          <p><b>Check-out:</b> {data.checkOut.slice(0,10)}</p>
        </div>
      )}
    </div>
  );
}
