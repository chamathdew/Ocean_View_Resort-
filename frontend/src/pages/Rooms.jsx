import React, { useEffect, useState } from "react";
import axios from "axios";

const API = `http://${window.location.hostname}:8080`;

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ roomNumber: "", roomType: "Single", status: "active" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/rooms`);
      console.log("data we got:", data);
      setRooms(data);
    } catch (err) {
      console.log("error getting rooms", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    load();
  }, [load]);

  async function addRoom(e) {
    e.preventDefault();
    setMsg("");
    const token = localStorage.getItem("token");
    try {
      await axios.post(`${API}/api/rooms`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ roomNumber: "", roomType: "Single", status: "active" });
      setMsg("Room saved!");
      load();
    } catch (err) {
      console.log(err);
      setMsg("Error saving room");
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

  const counts = { Single: 0, Double: 0, Family: 0, Suite: 0 };
  rooms.forEach(r => {
    if (r.status === 'active') counts[r.roomType] = (counts[r.roomType] || 0) + 1;
  });

  return (
    <div className="container" style={{ paddingTop: 60, paddingBottom: 100 }}>
      <div className="section-title">
        <span className="badge">Inventory</span>
        <h2>Manage Resort Suites</h2>
        <p style={{ color: 'var(--text-light)' }}>View and edit the available inventory of rooms and suites.</p>
      </div>

      {isAdmin ? (
        <div className="glass-panel" style={{ padding: 32, marginBottom: 48 }}>
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
                <option value="Single">Single ({counts.Single} Available)</option>
                <option value="Double">Double ({counts.Double} Available)</option>
                <option value="Family">Family ({counts.Family} Available)</option>
                <option value="Suite">Suite ({counts.Suite} Available)</option>
              </select>
            </div>

            <div className="field">
              <div className="label">Availablity Status</div>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">Available</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <button type="submit" className="btn btn-accent" style={{ height: 52 }}>Register Suite</button>
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
                    fontSize: 11,
                    background: r.status === "active" ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                    color: r.status === "active" ? "#4ade80" : "#f87171",
                    border: `1px solid ${r.status === "active" ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    {r.status === 'active' ? '● Available' : '○ Maintenance'}
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
