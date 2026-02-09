import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ roomNumber: "", roomType: "Single", status: "active" });
  const [msg, setMsg] = useState("");

  async function load() {
    const { data } = await axios.get(`${API}/api/rooms`);
    setRooms(data);
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
      setMsg("✅ Room added");
      load();
    } catch (err) {
      setMsg(err?.response?.data?.message || "❌ Error");
    }
  }

  async function deleteRoom(id) {
    await axios.delete(`${API}/api/rooms/${id}`);
    load();
  }

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "0 auto" }}>
      <h2>Rooms</h2>

      <form onSubmit={addRoom} style={{ display: "flex", gap: 10, marginBottom: 15 }}>
        <input
          placeholder="Room Number (A101)"
          value={form.roomNumber}
          onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
          required
        />

        <select value={form.roomType} onChange={(e) => setForm({ ...form, roomType: e.target.value })}>
          <option>Single</option>
          <option>Double</option>
          <option>Family</option>
          <option>Suite</option>
        </select>

        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="active">active</option>
          <option value="maintenance">maintenance</option>
        </select>

        <button type="submit">Add</button>
      </form>

      {msg && <p>{msg}</p>}

      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Room</th>
            <th>Type</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rooms.map((r) => (
            <tr key={r._id}>
              <td>{r.roomNumber}</td>
              <td>{r.roomType}</td>
              <td>{r.status}</td>
              <td>
                <button onClick={() => deleteRoom(r._id)}>Delete</button>
              </td>
            </tr>
          ))}
          {!rooms.length && (
            <tr>
              <td colSpan="4">No rooms yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
