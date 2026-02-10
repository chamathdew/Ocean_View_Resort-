import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ roomNumber: "", roomType: "Single", status: "active" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    load();
  }, []);

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

  async function addRoom(e) {
    e.preventDefault();
    setMsg("");
    const token = localStorage.getItem("token");
    try {
      await axios.post(`${API}/api/rooms`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ roomNumber: "", roomType: "Single", status: "active" });
      setMsg("✅ Room added successfully");
      load();
    } catch (err) {
      setMsg(err?.response?.data?.message || "❌ Error adding room");
    }
  }

  async function deleteRoom(id) {
    if (!window.confirm("Delete this room?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API}/api/rooms/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      load();
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  }

  const isAdmin = user && user.role === "admin";

  return (
    <div className="container" style={{ paddingTop: 60, paddingBottom: 100 }}>
      <div className="section-title">
        <span className="badge">Inventory</span>
        <h2>Manage Resort Suites</h2>
        <p style={{ color: 'var(--text-light)' }}>View and edit the available inventory of rooms and suites.</p>
      </div>

      {isAdmin ? (
        <div style={{ background: "var(--card)", padding: 32, borderRadius: 24, boxShadow: 'var(--shadow-md)', border: "1px solid var(--border)", marginBottom: 48 }}>
          <h3 style={{ marginTop: 0, marginBottom: 24, fontSize: 22 }}>Add New Suite</h3>
          <form onSubmit={addRoom} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24, alignItems: "end" }}>
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
              <div className="label">Suite Type</div>
              <select value={form.roomType} onChange={(e) => setForm({ ...form, roomType: e.target.value })}>
                <option>Single</option>
                <option>Double</option>
                <option>Family</option>
                <option>Suite</option>
              </select>
            </div>

            <div className="field">
              <div className="label">Availablity Status</div>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">Available</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <button type="submit" className="btn-accent" style={{ height: 50 }}>Register Suite</button>
          </form>
          {msg && <p style={{ marginTop: 20, fontSize: 14, fontWeight: 600, color: msg.includes('✅') ? 'green' : 'red' }}>{msg}</p>}
        </div>
      ) : (
        <div style={{ marginBottom: 48, padding: 24, background: "var(--accent-soft)", borderRadius: 16, border: '1px solid var(--accent)' }}>
          <p style={{ margin: 0, color: "var(--primary)", fontWeight: 600 }}>ℹ️ Restricted Access: Administrative privileges are required to modify the inventory.</p>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Suite No</th>
              <th>Category</th>
              <th>Inventory Status</th>
              {isAdmin && <th style={{ textAlign: "right" }}>Control</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ padding: 60, textAlign: "center" }}>Refreshing database...</td></tr>
            ) : rooms.map((r) => (
              <tr key={r._id}>
                <td style={{ fontWeight: 700, fontSize: 16 }}>{r.roomNumber}</td>
                <td style={{ color: 'var(--text-light)' }}>{r.roomType} Suite</td>
                <td>
                  <span style={{
                    padding: "6px 14px",
                    borderRadius: 100,
                    fontSize: 12,
                    background: r.status === "active" ? "#dcfce7" : "#fee2e2",
                    color: r.status === "active" ? "#166534" : "#991b1b",
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {r.status === 'active' ? 'Available' : 'Maintenance'}
                  </span>
                </td>
                {isAdmin && (
                  <td style={{ textAlign: "right" }}>
                    <button onClick={() => deleteRoom(r._id)} className="ghost" style={{ padding: "6px 16px", color: "#b91c1c", borderColor: 'var(--border)', background: 'var(--card)' }}>
                      Remove
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {!loading && !rooms.length && (
              <tr>
                <td colSpan="4" style={{ padding: 60, textAlign: "center", color: "var(--text-light)" }}>No suites currently registered in the system.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
