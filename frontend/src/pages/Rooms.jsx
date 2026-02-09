import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ roomNumber: "", roomType: "Single", status: "active" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/rooms`);
      setRooms(data);
    } catch (err) {
      console.error("Load failed", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addRoom(e) {
    e.preventDefault();
    setMsg("");
    try {
      await axios.post(`${API}/api/rooms`, form);
      setForm({ roomNumber: "", roomType: "Single", status: "active" });
      setMsg("✅ Room added successfully");
      load();
    } catch (err) {
      setMsg(err?.response?.data?.message || "❌ Error adding room");
    }
  }

  async function deleteRoom(id) {
    if (!window.confirm("Delete this room?")) return;
    try {
      await axios.delete(`${API}/api/rooms/${id}`);
      load();
    } catch (err) {
      alert("Delete failed");
    }
  }

  return (
    <div className="container" style={{ padding: "40px 18px" }}>
      <div className="section-title">
        <h2>Manage Rooms</h2>
        <span className="badge">{rooms.length} Total Rooms</span>
      </div>

      <div style={{ background: "#fff", padding: 24, borderRadius: 18, border: "1px solid var(--border)", marginBottom: 30 }}>
        <h3 style={{ marginTop: 0, marginBottom: 15, fontSize: 18 }}>Add New Room</h3>
        <form onSubmit={addRoom} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 15, alignItems: "end" }}>
          <div className="field">
            <div className="label">Room Number</div>
            <input
              placeholder="e.g. A101"
              value={form.roomNumber}
              onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
              required
            />
          </div>

          <div className="field">
            <div className="label">Type</div>
            <select value={form.roomType} onChange={(e) => setForm({ ...form, roomType: e.target.value })}>
              <option>Single</option>
              <option>Double</option>
              <option>Family</option>
              <option>Suite</option>
            </select>
          </div>

          <div className="field">
            <div className="label">Status</div>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <button type="submit" className="btn-accent" style={{ height: 46 }}>Add Room</button>
        </form>
        {msg && <p style={{ marginTop: 15, fontSize: 14 }}>{msg}</p>}
      </div>

      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid var(--border)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border)" }}>
              <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 13, color: "var(--muted)" }}>ROOM</th>
              <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 13, color: "var(--muted)" }}>TYPE</th>
              <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 13, color: "var(--muted)" }}>STATUS</th>
              <th style={{ textAlign: "right", padding: "14px 20px", fontSize: 13, color: "var(--muted)" }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ padding: 40, textAlign: "center" }}>Loading...</td></tr>
            ) : rooms.map((r) => (
              <tr key={r._id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "14px 20px", fontWeight: 700 }}>{r.roomNumber}</td>
                <td style={{ padding: "14px 20px" }}>{r.roomType}</td>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: 6,
                    fontSize: 12,
                    background: r.status === "active" ? "#e8f5e9" : "#fff3e0",
                    color: r.status === "active" ? "#2e7d32" : "#ef6c00",
                    fontWeight: 700
                  }}>
                    {r.status}
                  </span>
                </td>
                <td style={{ padding: "14px 20px", textAlign: "right" }}>
                  <button onClick={() => deleteRoom(r._id)} style={{ padding: "6px 12px", background: "#fee2e2", color: "#b91c1c", fontSize: 12 }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!loading && !rooms.length && (
              <tr>
                <td colSpan="4" style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>No rooms added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

