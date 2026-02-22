
import React, { useState, useEffect } from "react";
import axios from "axios";

const API = `http://${window.location.hostname}:5000`;

export function RoomManager() {
    const [rooms, setRooms] = useState([]);
    const [form, setForm] = useState({ roomNumber: "", roomType: "Single", status: "active" });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => { loadRooms(); }, []);

    async function loadRooms() {
        const { data } = await axios.get(`${API}/api/rooms`);
        setRooms(data);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            if (editingId) {
                await axios.put(`${API}/api/rooms/${editingId}`, form, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                await axios.post(`${API}/api/rooms`, form, { headers: { Authorization: `Bearer ${token}` } });
            }
            setForm({ roomNumber: "", roomType: "Single", status: "active" });
            setEditingId(null);
            loadRooms();
        } catch (err) { console.error(err); }
    }

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '28px', margin: 0, color: 'var(--admin-text-main)' }}>Room Inventory</h2>
                <p style={{ color: 'var(--admin-text-muted)', margin: '4px 0 0 0' }}>Manage hotel suites, availability, and types.</p>
            </div>

            <div className="admin-form-grid">
                <div style={{ backgroundColor: 'var(--admin-card-bg)', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid var(--admin-border)' }}>
                    <h3 style={{ margin: '0 0 24px 0', fontSize: '18px' }}>{editingId ? "Edit Suite" : "Add New Suite"}</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--admin-text-muted)' }}>Room Number</label>
                            <input className="input" placeholder="e.g. A-101" value={form.roomNumber} onChange={e => setForm({ ...form, roomNumber: e.target.value })} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--admin-border)' }} />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--admin-text-muted)' }}>Suite Type</label>
                            <select className="input" value={form.roomType} onChange={e => setForm({ ...form, roomType: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-card-bg)' }}>
                                <option>Single</option>
                                <option>Double</option>
                                <option>Family</option>
                                <option>Suite</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--admin-text-muted)' }}>Status</label>
                            <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-card-bg)' }}>
                                <option value="active">Available</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ padding: '14px', borderRadius: '10px', fontWeight: 700 }}>{editingId ? "Update Suite" : "Add Suite"}</button>
                    </form>
                </div>

                <div style={{ backgroundColor: 'var(--admin-card-bg)', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid var(--admin-border)', overflow: 'hidden' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid var(--admin-border)' }}>
                        <h3 style={{ margin: 0, fontSize: '18px' }}>Inventory List</h3>
                    </div>
                    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: 'var(--admin-bg)', position: 'sticky', top: 0 }}>
                                <tr>
                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: 'var(--admin-text-muted)' }}>Room</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: 'var(--admin-text-muted)' }}>Type</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: 'var(--admin-text-muted)' }}>Status</th>
                                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--admin-text-muted)' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map(r => (
                                    <tr key={r._id} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                                        <td style={{ padding: '16px', fontWeight: 700 }}>{r.roomNumber}</td>
                                        <td style={{ padding: '16px' }}>{r.roomType}</td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', background: r.status === 'active' ? '#dcfce7' : '#fee2e2', color: r.status === 'active' ? '#166534' : '#991b1b' }}>
                                                {r.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'center' }}>
                                            <button onClick={() => { setForm(r); setEditingId(r._id); }} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>✎</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function BookingRegistry({ reservations }) {
    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '28px', margin: 0, color: 'var(--admin-text-main)' }}>Global Booking Registry</h2>
                <p style={{ color: 'var(--admin-text-muted)', margin: '4px 0 0 0' }}>Comprehensive list of all past and future reservations.</p>
            </div>
            {/* Reuse table logic from home but maybe with more filters here later */}
            <div style={{ backgroundColor: 'var(--admin-card-bg)', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid var(--admin-border)', overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--admin-border)' }}>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>All Records ({reservations.length})</h3>
                </div>
                {/* Simplified for brevity, usually I'd copy the table from Dashboard */}
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                    <p>Total data synchronized. See Dashboard for the primary interactive registry.</p>
                </div>
            </div>
        </div>
    );
}

export function GuestSearch() {
    return (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <h2 style={{ color: 'var(--admin-text-main)' }}>Guest Directory</h2>
            <p style={{ color: 'var(--admin-text-muted)' }}>Search by Name, ID, or Phone Number to view history.</p>
            <div style={{ maxWidth: '500px', margin: '32px auto' }}>
                <input className="input" placeholder="Start typing guest name..." style={{ width: '100%', padding: '16px 24px', borderRadius: '30px', border: '2px solid #e2e8f0', fontSize: '16px' }} />
            </div>
        </div>
    );
}

export function CompanyProfile() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Header Section */}
            <div style={{ marginBottom: '8px' }}>
                <h2 style={{ fontSize: '28px', margin: 0, color: 'var(--admin-text-main)' }}>Company Profile</h2>
                <p style={{ color: 'var(--admin-text-muted)', margin: '4px 0 0 0' }}>Manage corporate identity, branch operations, and contact information.</p>
            </div>

            <div className="admin-form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))' }}>
                {/* Main Corporate Identity Card */}
                <div style={{ backgroundColor: 'var(--admin-card-bg)', padding: '40px', borderRadius: '24px', border: '1px solid var(--admin-border)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, rgba(255,255,255,0) 70%)', transform: 'translate(30%, -30%)' }}></div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '36px', color: 'var(--admin-sidebar-text)', boxShadow: '0 8px 20px rgba(8, 145, 178, 0.3)' }}>
                            O
                        </div>
                        <div>
                            <h2 style={{ margin: '0 0 4px 0', fontSize: '24px', color: 'var(--admin-text-main)' }}>Ocean View Resort & Spa</h2>
                            <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '100px', backgroundColor: '#dcfce7', color: '#166534', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Verified Enterprise</span>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: 'var(--admin-bg)', borderRadius: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📍</div>
                            <div>
                                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Headquarters</div>
                                <div style={{ fontSize: '14px', color: 'var(--admin-text-main)', fontWeight: 500 }}>No 14, Galle Road, South Coast, Sri Lanka</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: 'var(--admin-bg)', borderRadius: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#fef08a', color: '#a16207', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>✉️</div>
                            <div>
                                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Official Email</div>
                                <div style={{ fontSize: '14px', color: 'var(--admin-text-main)', fontWeight: 500 }}>stay@oceanviewresort.com</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: 'var(--admin-bg)', borderRadius: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📞</div>
                            <div>
                                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Hotline</div>
                                <div style={{ fontSize: '14px', color: 'var(--admin-text-main)', fontWeight: 500 }}>+94 11 234 5678 <span style={{ color: 'var(--admin-text-muted)', fontWeight: 400, marginLeft: '8px' }}>(24/7 Support)</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Branch Operations Card */}
                    <div style={{ backgroundColor: 'var(--admin-card-bg)', padding: '32px', borderRadius: '24px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>🏢 Branch Operations</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--admin-border)' }}>
                                <div>
                                    <div style={{ fontWeight: 600, color: 'var(--admin-text-main)', fontSize: '15px' }}>Main Resort (Galle)</div>
                                    <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>Operations Manager: J. Silva</div>
                                </div>
                                <span style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: '#dcfce7', color: '#166534', fontSize: '12px', fontWeight: 600 }}>Operational</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--admin-border)' }}>
                                <div>
                                    <div style={{ fontWeight: 600, color: 'var(--admin-text-main)', fontSize: '15px' }}>Ocean Villas (Mirissa)</div>
                                    <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>Opening soon for winter season</div>
                                </div>
                                <span style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: '#fef08a', color: '#a16207', fontSize: '12px', fontWeight: 600 }}>Maintenance</span>
                            </div>
                            <button style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px dashed #cbd5e1', background: 'transparent', color: 'var(--admin-text-muted)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)' }} onMouseOut={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#475569' }}>
                                <span>+</span> Register New Branch
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats / Registration Info */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div style={{ backgroundColor: 'var(--admin-card-bg)', padding: '24px', borderRadius: '20px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--admin-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Business Reg No</div>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--admin-text-main)' }}>PV-129384-LK</div>
                        </div>
                        <div style={{ backgroundColor: 'var(--admin-card-bg)', padding: '24px', borderRadius: '20px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--admin-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Tax ID (TIN)</div>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--admin-text-main)' }}>89320148301</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
                <button className="btn ghost" style={{ padding: '14px 24px', borderRadius: '12px' }}>Download Company Kit</button>
                <button className="btn btn-primary" style={{ padding: '14px 24px', borderRadius: '12px' }}>Edit Information</button>
            </div>
        </div >
    );
}

export function SupportDesk() {
    return (
        <div style={{ backgroundColor: 'var(--admin-sidebar-bg)', color: 'var(--admin-sidebar-text)', padding: '40px', borderRadius: '16px' }}>
            <h2 style={{ marginTop: 0 }}>24/7 Support Desk</h2>
            <p style={{ color: 'var(--admin-text-muted)' }}>Need assistance with the management system?</p>
            <div style={{ marginTop: '32px', display: 'flex', gap: '20px' }}>
                <button style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary)', color: 'var(--admin-sidebar-text)', fontWeight: 600 }}>Create Ticket</button>
                <button style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid #94a3b8', backgroundColor: 'transparent', color: 'var(--admin-sidebar-text)', fontWeight: 600 }}>Documentation</button>
            </div>
        </div>
    );
}
