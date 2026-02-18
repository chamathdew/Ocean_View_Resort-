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
        </div>
    );
}
