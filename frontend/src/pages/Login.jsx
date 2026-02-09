import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = "http://localhost:5000";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${API}/api/auth/login`, { email, password });
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.href = "/";
        } catch (err) {
            setError(err.response?.data?.message || "Authentication failed. Please verify your credentials.");
        }
    };

    return (
        <div className="container" style={{ maxWidth: 500, paddingTop: 100, paddingBottom: 100 }}>
            <div style={{ background: "#fff", padding: 48, borderRadius: 32, boxShadow: 'var(--shadow-lg)', border: "1px solid var(--border)" }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <h2 style={{ fontSize: 32, marginBottom: 8 }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-light)', margin: 0 }}>Sign in to manage your resort experience.</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div className="field">
                        <div className="label">Email Address</div>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@example.com" />
                    </div>
                    <div className="field">
                        <div className="label">Secure Password</div>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
                    </div>

                    {error && <p style={{ color: "#b91c1c", fontSize: 13, textAlign: 'center', margin: 0, fontWeight: 500 }}>{error}</p>}

                    <button type="submit" className="btn btn-primary" style={{ width: "100%", height: 52 }}>Sign In to Account</button>
                </form>

                <div style={{ marginTop: 32, textAlign: 'center', fontSize: 14, color: 'var(--text-light)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>Register Here</Link>
                </div>
            </div>
        </div>
    );
}
