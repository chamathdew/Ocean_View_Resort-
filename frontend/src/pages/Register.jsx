import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API = "http://localhost:5000";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/api/auth/register`, form);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="container" style={{ maxWidth: 500, paddingTop: 100, paddingBottom: 100 }}>
            <div style={{ background: "var(--card)", padding: 48, borderRadius: 32, boxShadow: 'var(--shadow-lg)', border: "1px solid var(--border)" }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <h2 style={{ fontSize: 32, marginBottom: 8 }}>Join the Resort</h2>
                    <p style={{ color: 'var(--text-light)', margin: 0 }}>Create an account to unlock exclusive benefits.</p>
                </div>

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div className="field">
                        <div className="label">Full Name</div>
                        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="John Doe" />
                    </div>
                    <div className="field">
                        <div className="label">Email Address</div>
                        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="name@example.com" />
                    </div>
                    <div className="field">
                        <div className="label">Secure Password</div>
                        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required placeholder="••••••••" />
                    </div>
                    <div className="field">
                        <div className="label">Membership Type (Internal Use Only)</div>
                        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                            <option value="user">Standard Member</option>
                            <option value="admin">Resort Administrator</option>
                        </select>
                    </div>

                    {error && <p style={{ color: "#b91c1c", fontSize: 13, textAlign: 'center', margin: 0, fontWeight: 500 }}>{error}</p>}

                    <button type="submit" className="btn btn-primary" style={{ width: "100%", height: 52, marginTop: 10 }}>Create Account</button>
                </form>

                <div style={{ marginTop: 32, textAlign: 'center', fontSize: 14, color: 'var(--text-light)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
                </div>
            </div>
        </div>
    );
}
