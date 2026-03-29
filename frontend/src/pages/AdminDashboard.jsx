import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { downloadInvoice } from "../utils/invoice";
import { useNavigate } from "react-router-dom";
import { RoomManager, BookingRegistry, CompanyProfile, ReportsDashboard } from "./AdminDashboardComponents";
import logoImage from "../assets/logo2.png";

const API = import.meta.env.DEV ? `http://${window.location.hostname}:8080` : "";

export default function AdminDashboard() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("reservations");
    const [user, setUser] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const loadReservations = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                window.location.href = "/login";
                return;
            }

            const { data } = await axios.get(`${API}/api/reservations`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReservations(data);
        } catch (err) {
            console.error("Fetch error:", err);
            alert("Failed to load reservations.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) setUser(JSON.parse(savedUser));
        (async () => {
            await loadReservations();
        })();
    }, [loadReservations]);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
    };


    async function togglePaymentStatus(id, currentStatus) {
        try {
            const token = localStorage.getItem("token");
            await axios.patch(`${API}/api/reservations/${id}/payment`, { isPaid: !currentStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            loadReservations(); // Refresh data
        } catch (err) {
            console.error("Payment update failed:", err);
            alert("Failed to update payment status.");
        }
    }

    async function deleteReservation(id) {
        if (!window.confirm("Are you sure you want to delete this reservation? This will send a WhatsApp cancellation message to the guest.")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API}/api/reservations/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            loadReservations(); // Refresh data
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete reservation.");
        }
    }

    // Calculate stats
    const totalBookings = reservations.length;

    return (
        <div className="admin-layout">
            <div className={`admin-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>

            {/* Premium Sidebar */}
            <aside className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <img src={logoImage} alt="Logo" style={{ height: '60px', objectFit: 'contain' }} />
                    <div style={{ textAlign: 'center' }}>
                        
                        <div style={{ fontSize: '10px', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Management System</div>
                    </div>
                </div>

                {/* Sidebar Links */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '32px' }}>
                        <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--admin-text-muted)', fontWeight: 600, letterSpacing: '1px', margin: '20px 0 12px 12px' }}>Main Menu</div>

                        <button
                            onClick={() => { setActiveTab('reservations'); setIsMobileMenuOpen(false); }}
                            style={{
                                padding: '12px 16px', textAlign: 'left', border: 'none', borderRadius: '10px',
                                fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                                background: activeTab === 'reservations' ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: activeTab === 'reservations' ? '#fff' : '#94a3b8',
                                transition: 'all 0.2s',
                                borderLeft: activeTab === 'reservations' ? '4px solid var(--primary)' : '4px solid transparent'
                            }}
                        >
                            <span style={{ fontSize: '18px' }}>📊</span> Dashboard
                        </button>
                        <button
                            onClick={() => { setActiveTab('reports'); setIsMobileMenuOpen(false); }}
                            style={{
                                padding: '12px 16px', textAlign: 'left', border: 'none', borderRadius: '10px',
                                fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                                background: activeTab === 'reports' ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: activeTab === 'reports' ? '#fff' : '#94a3b8',
                                transition: 'all 0.2s',
                                borderLeft: activeTab === 'reports' ? '4px solid var(--primary)' : '4px solid transparent'
                            }}
                        >
                            <span style={{ fontSize: '18px' }}>📈</span> Business Reports
                        </button>
                        <button
                            onClick={() => { setActiveTab('transport'); setIsMobileMenuOpen(false); }}
                            style={{
                                padding: '12px 16px', textAlign: 'left', border: 'none', borderRadius: '10px',
                                fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                                background: activeTab === 'transport' ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: activeTab === 'transport' ? '#fff' : '#94a3b8',
                                transition: 'all 0.2s',
                                borderLeft: activeTab === 'transport' ? '4px solid var(--primary)' : '4px solid transparent'
                            }}
                        >
                            <span style={{ fontSize: '18px' }}>🚗</span> Vehicles
                        </button>
                        <button
                            onClick={() => { setActiveTab('attractions'); setIsMobileMenuOpen(false); }}
                            style={{
                                padding: '12px 16px', textAlign: 'left', border: 'none', borderRadius: '10px',
                                fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                                background: activeTab === 'attractions' ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: activeTab === 'attractions' ? '#fff' : '#94a3b8',
                                transition: 'all 0.2s',
                                borderLeft: activeTab === 'attractions' ? '4px solid var(--primary)' : '4px solid transparent'
                            }}
                        >
                            <span style={{ fontSize: '18px' }}>🌴</span> Attractions
                        </button>
                    </nav>

                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--admin-text-muted)', fontWeight: 600, letterSpacing: '1px', margin: '0 0 12px 12px' }}>Site Management</div>
                        {[
                            { id: 'inventory', label: 'Room Inventory', icon: '🏨' },
                            { id: 'all-bookings', label: 'Bookings', icon: '📝' },
                            { id: 'company', label: 'Company Info', icon: 'ℹ️' }
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                                style={{
                                    padding: '10px 16px', textAlign: 'left', border: 'none', borderRadius: '10px',
                                    fontWeight: 500, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                                    background: activeTab === item.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    color: activeTab === item.id ? '#fff' : '#94a3b8',
                                    transition: 'all 0.2s',
                                    borderLeft: activeTab === item.id ? '4px solid var(--primary)' : '4px solid transparent'
                                }}
                            >
                                <span style={{ fontSize: '16px' }}>{item.icon}</span> {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Sidebar Footer */}
                <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'var(--admin-footer-bg)' }}>
                    {user && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>
                                    {user.name?.charAt(0) || 'A'}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--admin-sidebar-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>{user.role} Account</div>
                                </div>
                            </div>
                            <button onClick={logout} style={{ width: '100%', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <span>🚪</span> Logout Securely
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {/* Top Header Bar */}
                <header className="admin-header">
                    <div className="admin-header-left">
                        <button className="mobile-toggle-btn" onClick={() => setIsMobileMenuOpen(true)}>☰</button>
                        <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--admin-text-main)' }}>
                            {activeTab === 'reservations' ? 'Dashboard Overview' :
                                activeTab === 'reports' ? 'Business Intelligence' :
                                    activeTab === 'transport' ? 'Vehicle Management' :
                                        activeTab === 'attractions' ? 'Nearby Attractions' :
                                            activeTab === 'inventory' ? 'Room Inventory Management' :
                                                activeTab === 'all-bookings' ? 'Extended Booking Registry' : 'Company Profile'}
                        </div>
                        <div style={{ padding: '4px 12px', borderRadius: '20px', backgroundColor: 'var(--admin-table-head)', fontSize: '12px', color: 'var(--admin-text-muted)' }} className="hide-on-mobile">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                    <div className="admin-header-right">
                        <div className="search-bar" style={{ position: 'relative' }}>
                            <input type="text" placeholder="Search data..." style={{ padding: '10px 16px 10px 40px', borderRadius: '10px', border: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-bg)', width: '250px', fontSize: '14px' }} />
                            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>🔍</span>
                        </div>
                        <button style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', opacity: 0.6 }}>🔔</button>
                        <button onClick={() => navigate('/')} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-card-bg)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>View Website</button>
                    </div>
                </header>

                {/* Independent Scrollable Content Area */}
                <div className="admin-content">
                    {activeTab === 'reservations' && (
                        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

                            {/* Stats Summary Rows */}
                            <div className="admin-grid-stats">
                                <div style={{ backgroundColor: 'var(--admin-card-bg)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📅</div>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Bookings</div>
                                        <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--admin-text-main)', marginTop: '4px' }}>{totalBookings}</div>
                                    </div>
                                </div>
                                <div style={{ backgroundColor: 'var(--admin-card-bg)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🛬</div>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending Arrival</div>
                                        <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--admin-text-main)', marginTop: '4px' }}>
                                            {reservations.filter(r => r.status === "booked").length}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ backgroundColor: 'var(--admin-card-bg)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>💰</div>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Revenue (MTD)</div>
                                        <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--admin-text-main)', marginTop: '4px' }}>1.2M LKR</div>
                                    </div>
                                </div>
                            </div>

                            {/* Data Table Section */}
                            <div style={{ backgroundColor: 'var(--admin-card-bg)', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid var(--admin-border)', overflow: 'hidden' }}>
                                <div style={{ padding: '24px', borderBottom: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--admin-text-main)' }}>Recent Reservation Registry</h3>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-card-bg)', fontSize: '13px', fontWeight: 600 }}>Filter</button>
                                        <button style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: 'var(--admin-sidebar-text)', fontSize: '13px', fontWeight: 600 }}>Export Report</button>
                                    </div>
                                </div>

                                {loading ? (
                                    <p>Loading data...</p>
                                ) : reservations.length > 0 ? (
                                    <div className="table-container" style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ backgroundColor: 'var(--admin-bg)', borderBottom: '2px solid var(--admin-border)' }}>
                                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Booking No</th>
                                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Guest Name</th>
                                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Suite</th>
                                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Date Range</th>
                                                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Status</th>
                                                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Payment</th>
                                                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reservations.map((res, index) => (
                                                    <tr key={res.id || res._id} style={{ borderBottom: '1px solid var(--admin-border)', backgroundColor: index % 2 === 0 ? 'var(--admin-card-bg)' : 'var(--admin-hover)', transition: 'background 0.2s' }}>
                                                        <td style={{ padding: '16px', fontWeight: 700, color: 'var(--admin-text-main)' }}>#{res.reservationNo}</td>
                                                        <td style={{ padding: '16px', fontSize: '14px', color: 'var(--admin-text-muted)' }}>{res.guestId?.fullName || "N/A"}</td>
                                                        <td style={{ padding: '16px', fontSize: '14px', color: 'var(--admin-text-muted)' }}>
                                                            <div style={{ fontWeight: 600 }}>{res.roomId?.roomType}</div>
                                                            <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>Unit {res.roomId?.roomNumber}</div>
                                                        </td>
                                                        <td style={{ padding: '16px', fontSize: '13px', color: 'var(--admin-text-muted)' }}>
                                                            {new Date(res.checkIn).toLocaleDateString()} - {new Date(res.checkOut).toLocaleDateString()}
                                                        </td>
                                                        <td style={{ padding: '16px', textAlign: 'center' }}>
                                                            <span style={{
                                                                padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                                                                background: res.status === "booked" ? "rgba(59, 130, 246, 0.1)" : "#f1f5f9",
                                                                color: res.status === "booked" ? "#3b82f6" : "#64748b"
                                                            }}>
                                                                {res.status.toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '16px' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <button
                                                                    onClick={() => togglePaymentStatus(res.id || res._id, res.isPaid)}
                                                                    style={{
                                                                        padding: '6px 12px', borderRadius: '8px', border: '1px solid',
                                                                        background: res.isPaid ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                                                                        color: res.isPaid ? "#10b981" : "#ef4444",
                                                                        borderColor: res.isPaid ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)",
                                                                        fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                                                                    }}
                                                                >
                                                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
                                                                    {res.isPaid ? "PAID" : "UNPAID"}
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '16px' }}>
                                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                                <button onClick={() => downloadInvoice(res)} title="Download Invoice" style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-card-bg)', cursor: 'pointer' }}>📄</button>
                                                                <button onClick={() => deleteReservation(res.id || res._id)} title="Delete Reservation" style={{ padding: '8px', borderRadius: '6px', border: '1px solid #fee2e2', backgroundColor: '#fef2f2', color: '#ef4444', cursor: 'pointer' }}>🗑</button>
                                                            </div>
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
                    )}

                    {activeTab === 'reports' && <div style={{ maxWidth: '1400px', margin: '0 auto' }}><ReportsDashboard /></div>}
                    {activeTab === 'transport' && <div style={{ maxWidth: '1400px', margin: '0 auto' }}><TransportManager /></div>}
                    {activeTab === 'attractions' && <div style={{ maxWidth: '1400px', margin: '0 auto' }}><AttractionManager /></div>}
                    {activeTab === 'inventory' && <div style={{ maxWidth: '1400px', margin: '0 auto' }}><RoomManager /></div>}
                    {activeTab === 'all-bookings' && <div style={{ maxWidth: '1400px', margin: '0 auto' }}><BookingRegistry reservations={reservations} /></div>}
                    {activeTab === 'search' && <div style={{ maxWidth: '1400px', margin: '0 auto' }}><div style={{textAlign:'center', padding: '100px'}}>Search module restricted.</div></div>}
                    {activeTab === 'company' && <div style={{ maxWidth: '1400px', margin: '0 auto' }}><CompanyProfile /></div>}
                </div>
            </main>
        </div>

    );
}

function TransportManager() {
    const [transports, setTransports] = useState([]);
    const [form, setForm] = useState({ name: "", image: "", price: "", location: "" });
    const [editingId, setEditingId] = useState(null);
    // Component-scope fetch so other handlers can call it
    const fetchTransports = useCallback(async () => {
        try {
            const { data } = await axios.get(`${API}/api/transports`);
            setTransports(data.map(t => ({ ...t, id: t.id || t._id })));
        } catch (err) {
            console.error("Error fetching transports:", err);
        }
    }, []);

    useEffect(() => {
        (async () => {
            await fetchTransports();
        })();
    }, [fetchTransports]);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${API}/api/transports/${editingId}`, form);
            } else {
                await axios.post(`${API}/api/transports`, form);
            }
            setForm({ name: "", image: "", price: "", location: "" });
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
        setEditingId(item.id || item._id);
    }

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '28px', margin: 0, color: 'var(--admin-text-main)' }}>Vehicle Fleet</h2>
                <p style={{ color: 'var(--admin-text-muted)', margin: '4px 0 0 0' }}>Add or modify vehicle options for guest rentals.</p>
            </div>

            <div className="admin-form-grid">
                {/* Form Card */}
                <div style={{ backgroundColor: 'var(--admin-card-bg)', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid var(--admin-border)' }}>
                    <h3 style={{ margin: '0 0 24px 0', fontSize: '18px' }}>{editingId ? "Edit Vehicle" : "Add New Vehicle"}</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--admin-text-muted)' }}>Vehicle Name</label>
                            <input className="input" placeholder="e.g. Luxury Mini Van" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--admin-border)' }} />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--admin-text-muted)' }}>Vehicle Image URL</label>
                            <input className="input" placeholder="https://images.unsplash.com/..." value={form.image || form.icon} onChange={e => setForm({ ...form, image: e.target.value })} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--admin-border)' }} />
                            <small style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '4px', display: 'block' }}>Paste a direct image link for best results.</small>
                        </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--admin-text-muted)' }}>Rate (Per Day)</label>
                                <input className="input" placeholder="e.g. 5,000 LKR" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--admin-border)' }} />
                            </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '14px', borderRadius: '10px', fontWeight: 700 }}>{editingId ? "Save Changes" : "Register Vehicle"}</button>
                            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: "", image: "", price: "", location: "" }); }} className="btn ghost" style={{ flex: 1 }}>Cancel</button>}
                        </div>
                    </form>
                </div>

                {/* List Card */}
                <div style={{ backgroundColor: 'var(--admin-card-bg)', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid var(--admin-border)', overflow: 'hidden' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid var(--admin-border)' }}>
                        <h3 style={{ margin: 0, fontSize: '18px' }}>Active Fleet</h3>
                    </div>
                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        <div className="table-container">
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ backgroundColor: 'var(--admin-bg)', position: 'sticky', top: 0 }}>
                                    <tr>
                                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', color: 'var(--admin-text-muted)' }}>Vehicle</th>
                                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', color: 'var(--admin-text-muted)' }}>Price</th>
                                        <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', textTransform: 'uppercase', color: 'var(--admin-text-muted)' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transports.map(t => (
                                        <tr key={t.id || t._id} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <img src={t.image || t.icon} alt={t.name} style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }} />
                                                    <span style={{ fontWeight: 600, color: 'var(--admin-text-main)' }}>{t.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px', color: 'var(--admin-text-muted)', fontSize: '14px' }}>{t.price}</td>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                                    <button onClick={() => handleEdit(t)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-card-bg)', cursor: 'pointer' }}>✎</button>
                                                    <button onClick={() => handleDelete(t.id || t._id)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #fee2e2', backgroundColor: '#fef2f2', color: '#ef4444', cursor: 'pointer' }}>🗑</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AttractionManager() {
    const [attractions, setAttractions] = useState([]);
    const [form, setForm] = useState({ name: "", img: "", desc: "" });
    const [editingId, setEditingId] = useState(null);

    // Component-scope fetch so other handlers can call it
    const fetchAttractions = useCallback(async () => {
        try {
            const { data } = await axios.get(`${API}/api/attractions`);
            setAttractions(data.map(a => ({ ...a, id: a.id || a._id })));
        } catch (err) {
            console.error("Error fetching attractions:", err);
        }
    }, []);

    useEffect(() => {
        (async () => {
            await fetchAttractions();
        })();
    }, [fetchAttractions]);

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
        setForm({
            name: item.name,
            img: item.img,
            desc: item.desc
        });
        setEditingId(item.id || item._id);
    }

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '28px', margin: 0, color: 'var(--admin-text-main)' }}>Nearby Attractions</h2>
                <p style={{ color: 'var(--admin-text-muted)', margin: '4px 0 0 0' }}>Manage local points of interest for guests.</p>
            </div>

            <div className="admin-form-grid">
                {/* Form Card */}
                <div style={{ backgroundColor: 'var(--admin-card-bg)', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid var(--admin-border)' }}>
                    <h3 style={{ margin: '0 0 24px 0', fontSize: '18px' }}>{editingId ? "Edit Attraction" : "Add New Attraction"}</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--admin-text-muted)' }}>Place Name</label>
                            <input className="input" placeholder="e.g. Unawatuna Beach" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--admin-border)' }} />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--admin-text-muted)' }}>Image URL</label>
                            <input className="input" placeholder="https://..." value={form.img} onChange={e => setForm({ ...form, img: e.target.value })} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--admin-border)' }} />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--admin-text-muted)' }}>Description</label>
                            <textarea className="input" placeholder="Tell guests why they should visit..." value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--admin-border)', minHeight: '120px', fontFamily: 'inherit' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '14px', borderRadius: '10px', fontWeight: 700 }}>{editingId ? "Update Info" : "Publish Attraction"}</button>
                            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: "", img: "", desc: "" }); }} className="btn ghost" style={{ flex: 1 }}>Cancel</button>}
                        </div>
                    </form>
                </div>

                {/* List Card */}
                <div style={{ backgroundColor: 'var(--admin-card-bg)', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid var(--admin-border)', overflow: 'hidden' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid var(--admin-border)' }}>
                        <h3 style={{ margin: 0, fontSize: '18px' }}>Existing Locations</h3>
                    </div>
                    <div style={{ maxHeight: '600px', overflowY: 'auto', padding: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {attractions.map(a => (
                                <div key={a.id || a._id} style={{ display: 'flex', gap: '20px', padding: '16px', borderRadius: '12px', backgroundColor: 'var(--admin-bg)', border: '1px solid var(--admin-border)' }}>
                                    <img src={a.img} alt={a.name} style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover' }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--admin-text-main)' }}>{a.name}</h4>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <button onClick={() => handleEdit(a)} style={{ border: 'none', background: 'none', fontSize: '14px', cursor: 'pointer', opacity: 0.6 }}>✎</button>
                                                <button onClick={() => handleDelete(a.id || a._id)} style={{ border: 'none', background: 'none', fontSize: '14px', cursor: 'pointer', opacity: 0.6, color: '#ef4444' }}>🗑</button>
                                            </div>
                                        </div>
                                        <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: 'var(--admin-text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
