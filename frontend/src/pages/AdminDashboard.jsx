import React, { useEffect, useState } from "react";
import axios from "axios";
import { downloadInvoice } from "../utils/invoice";

const API = `http://${window.location.hostname}:5000`;

export default function AdminDashboard() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        loadReservations();
    }, []);

    async function loadReservations() {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                window.location.href = "/login";
                return;
            }

            const { data } = await axios.get(`${API}/api/reservations/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReservations(data);
        } catch (err) {
            console.error("Fetch error:", err);
            setMsg("Failed to load reservations.");
        } finally {
            setLoading(false);
        }
    }

    // Calculate stats
    const totalBookings = reservations.length;
    const recentBookings = reservations.slice(0, 5); // Just simplified logic for UI

    return (
        <div className="container" style={{ paddingTop: 60, paddingBottom: 100 }}>
            {/* Header */}
            <div className="section-title">
                <span className="badge">Overview</span>
                <h2>Admin Dashboard</h2>
                <p style={{ color: "var(--text-light)" }}>Manage hotel operations and view latest bookings.</p>
            </div>

            {/* Stats Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, marginBottom: 48 }}>
                <div className="glass-panel" style={{ padding: 24 }}>
                    <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1, color: "var(--text-light)" }}>Total Bookings</div>
                    <div style={{ fontSize: 36, fontWeight: 800, color: "var(--primary)", marginTop: 8 }}>{totalBookings}</div>
                </div>
                <div className="glass-panel" style={{ padding: 24 }}>
                    <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1, color: "var(--text-light)" }}>Pending Check-ins</div>
                    <div style={{ fontSize: 36, fontWeight: 800, color: "var(--accent)", marginTop: 8 }}>
                        {reservations.filter(r => r.status === "booked").length}
                    </div>
                </div>
            </div>

            {/* Recent Reservations Table */}
            <div className="glass-panel" style={{ padding: 32 }}>
                <h3 style={{ marginTop: 0, marginBottom: 24 }}>Recent Reservations</h3>

                {loading ? (
                    <p>Loading data...</p>
                ) : reservations.length > 0 ? (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Booking No</th>
                                    <th>Guest Name</th>
                                    <th>Suite</th>
                                    <th>Check-In</th>
                                    <th>Check-Out</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.map((res) => (
                                    <tr key={res._id}>
                                        <td style={{ fontWeight: 600 }}>{res.reservationNo}</td>
                                        <td>{res.guestId?.fullName || "N/A"}</td>
                                        <td>{res.roomId?.roomNumber} ({res.roomId?.roomType})</td>
                                        <td>{new Date(res.checkIn).toLocaleDateString()}</td>
                                        <td>{new Date(res.checkOut).toLocaleDateString()}</td>
                                        <td>
                                            <span className="badge" style={{
                                                background: res.status === "booked" ? "var(--accent-soft)" : "var(--bg)",
                                                color: res.status === "booked" ? "var(--primary)" : "var(--text-light)"
                                            }}>
                                                {res.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => downloadInvoice({ ...res, reservationNo: res.reservationNo })}
                                                className="btn btn-primary"
                                                style={{ padding: "6px 12px", fontSize: 12 }}
                                            >
                                                Invoice
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p style={{ color: "var(--text-light)" }}>No reservations found.</p>
                )}
            </div>

            <TransportManager />
            <AttractionManager />
        </div>

    );
}

function TransportManager() {
    const [transports, setTransports] = useState([]);
    const [form, setForm] = useState({ name: "", icon: "", price: "", desc: "" });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchTransports();
    }, []);

    async function fetchTransports() {
        const { data } = await axios.get(`${API}/api/transports`);
        setTransports(data);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${API}/api/transports/${editingId}`, form);
            } else {
                await axios.post(`${API}/api/transports`, form);
            }
            setForm({ name: "", icon: "", price: "", desc: "" });
            setEditingId(null);
            fetchTransports();
        } catch (err) {
            console.error("Error saving transport:", err);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`${API}/api/transports/${id}`);
            fetchTransports();
        } catch (err) {
            console.error("Error deleting transport:", err);
        }
    }

    function handleEdit(item) {
        setForm(item);
        setEditingId(item._id);
    }

    return (
        <div className="glass-panel" style={{ padding: 32, marginTop: 40 }}>
            <h3>Manage Transport Options</h3>
            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                    <label>Transport Name</label>
                    <input className="input" placeholder="e.g. Tuk Tuk" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label>Icon Emoji</label>
                    <input className="input" placeholder="e.g. 🛺" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label>Price Rate</label>
                    <input className="input" placeholder="e.g. 2,500 LKR" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label>Short Description</label>
                    <input className="input" placeholder="Brief details..." value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} required />
                </div>
                <button type="submit" className="btn btn-primary full-width">{editingId ? "Update" : "Add"} Transport</button>
            </form>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th width="80">Icon</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Description</th>
                            <th width="120">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transports.map(t => (
                            <tr key={t._id}>
                                <td data-label="Icon" style={{ fontSize: 24, textAlign: 'center' }}>{t.icon}</td>
                                <td data-label="Name" style={{ fontWeight: 600 }}>{t.name}</td>
                                <td data-label="Price">{t.price}</td>
                                <td data-label="Description" className="text-muted">{t.desc}</td>
                                <td data-label="Actions">
                                    <div className="action-buttons">
                                        <button onClick={() => handleEdit(t)} className="btn-icon edit" title="Edit">✎</button>
                                        <button onClick={() => handleDelete(t._id)} className="btn-icon delete" title="Delete">🗑</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function AttractionManager() {
    const [attractions, setAttractions] = useState([]);
    const [form, setForm] = useState({ name: "", img: "", desc: "" });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchAttractions();
    }, []);

    async function fetchAttractions() {
        const { data } = await axios.get(`${API}/api/attractions`);
        setAttractions(data);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${API}/api/attractions/${editingId}`, form);
            } else {
                await axios.post(`${API}/api/attractions`, form);
            }
            setForm({ name: "", img: "", desc: "" });
            setEditingId(null);
            fetchAttractions();
        } catch (err) {
            console.error("Error saving attraction:", err);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`${API}/api/attractions/${id}`);
            fetchAttractions();
        } catch (err) {
            console.error("Error deleting attraction:", err);
        }
    }

    function handleEdit(item) {
        setForm(item);
        setEditingId(item._id);
    }

    return (
        <div className="glass-panel" style={{ padding: 32, marginTop: 40 }}>
            <h3>Manage Attractions</h3>
            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                    <label>Attraction Name</label>
                    <input className="input" placeholder="Place Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label>Image URL</label>
                    <input className="input" placeholder="https://..." value={form.img} onChange={e => setForm({ ...form, img: e.target.value })} required />
                </div>
                <div className="form-group full-width">
                    <label>Description</label>
                    <input className="input" placeholder="Brief description of the place..." value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} required />
                </div>
                <button type="submit" className="btn btn-primary full-width">{editingId ? "Update" : "Add"} Attraction</button>
            </form>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th width="100">Image</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th width="120">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attractions.map(a => (
                            <tr key={a._id}>
                                <td data-label="Image">
                                    <div className="table-img-wrap">
                                        <img src={a.img} alt={a.name} />
                                    </div>
                                </td>
                                <td data-label="Name" style={{ fontWeight: 600 }}>{a.name}</td>
                                <td data-label="Description" className="text-muted">{a.desc}</td>
                                <td data-label="Actions">
                                    <div className="action-buttons">
                                        <button onClick={() => handleEdit(a)} className="btn-icon edit" title="Edit">✎</button>
                                        <button onClick={() => handleDelete(a._id)} className="btn-icon delete" title="Delete">🗑</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
