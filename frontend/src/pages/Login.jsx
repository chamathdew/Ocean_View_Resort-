import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${API}/api/auth/login`, { email, password });
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.href = "/"; // Refresh to update App state
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="container" style={{ maxWidth: 400, marginTop: 100 }}>
            <div className="search-card" style={{ padding: 30 }}>
                <h2>Sign In</h2>
                <form onSubmit={handleLogin}>
                    <div className="field">
                        <div className="label">Email</div>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="field" style={{ marginTop: 15 }}>
                        <div className="label">Password</div>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
                    <button type="submit" className="btn-accent" style={{ width: "100%", marginTop: 20 }}>Login</button>
                </form>
            </div>
        </div>
    );
}
