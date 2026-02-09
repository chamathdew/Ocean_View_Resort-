import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="container" style={{ maxWidth: 400, marginTop: 100 }}>
            <div className="search-card" style={{ padding: 30 }}>
                <h2>Create Account</h2>
                <form onSubmit={handleRegister}>
                    <div className="field">
                        <div className="label">Full Name</div>
                        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="field" style={{ marginTop: 15 }}>
                        <div className="label">Email</div>
                        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <div className="field" style={{ marginTop: 15 }}>
                        <div className="label">Password</div>
                        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                    </div>
                    <div className="field" style={{ marginTop: 15 }}>
                        <div className="label">Role</div>
                        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
                    <button type="submit" className="btn-accent" style={{ width: "100%", marginTop: 20 }}>Register</button>
                </form>
            </div>
        </div>
    );
}
