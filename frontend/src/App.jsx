import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";

// Import Pages
import Rooms from "./pages/Rooms";
import Reservations from "./pages/Reservations";
import ReservationList from "./pages/ReservationList";
import Login from "./pages/Login";
import Register from "./pages/Register";

const API = "http://localhost:5000";

function Home() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const { data } = await axios.get(`${API}/api/rooms`);
        setRooms(data.slice(0, 3)); // show first 3
      } catch (err) {
        console.error("Error fetching rooms:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="badge">🌴 Beachside stays · Best deals</span>
          <h1>Find your perfect ocean-view room</h1>
          <p>Check availability, compare room types, and reserve instantly.</p>

          <div className="search-wrap">
            <div className="search-card">
              <div className="search-grid">
                <div className="field">
                  <div className="label">Check-in</div>
                  <input type="date" />
                </div>

                <div className="field">
                  <div className="label">Check-out</div>
                  <input type="date" />
                </div>

                <div className="field">
                  <div className="label">Room type</div>
                  <select defaultValue="Deluxe">
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe Ocean View</option>
                    <option value="Suite">Luxury Suite</option>
                  </select>
                </div>

                <div className="field">
                  <div className="label">&nbsp;</div>
                  <button className="btn-accent">Search</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="page">
        <div className="container">
          <div className="section-title">
            <h2>Popular rooms</h2>
            <span className="badge">Free Wi‑Fi · Breakfast options</span>
          </div>

          <div className="room-grid">
            {loading ? (
              <p>Loading rooms...</p>
            ) : rooms.length > 0 ? (
              rooms.map((room) => (
                <article className="room-card" key={room._id}>
                  <img
                    className="room-img"
                    src={
                      room.roomType === "Suite"
                        ? "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=60"
                        : room.roomType === "Double"
                          ? "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=60"
                          : "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=60"
                    }
                    alt={room.roomType}
                    loading="lazy"
                  />
                  <div className="room-body">
                    <h3 className="room-name">
                      {room.roomType} (Room {room.roomNumber})
                    </h3>
                    <div className="room-meta">
                      Balcony · King bed · Free Wi‑Fi
                    </div>
                    <div className="price-row">
                      <div>
                        <div className="price">
                          LKR {room.roomType === "Suite" ? "42,000" : "28,000"}
                        </div>
                        <div className="per">per night</div>
                      </div>
                      <Link to="/book" className="btn-primary">
                        Reserve
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div style={{ textAlign: "center", gridColumn: "1 / -1", padding: "40px" }}>
                <p>No rooms found in the backend. Add some in the Manage Rooms page!</p>
                <Link to="/rooms" className="btn-primary" style={{ display: "inline-block", marginTop: "10px" }}>
                  Go to Manage Rooms
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="app-container">
      <header className="ov-header">
        <div className="container bar">
          <Link to="/" className="brand" aria-label="Ocean View Resort" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className="brand-dot" />
            Ocean View Resort
          </Link>

          <nav className="header-nav">
            <Link to="/rooms" className="nav-link">Rooms</Link>
            <Link to="/book" className="nav-link">Book Now</Link>
            <Link to="/search" className="nav-link">Find Reservation</Link>
          </nav>

          <div className="header-actions">
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{user.name} ({user.role})</span>
                <button onClick={logout} className="ghost">Logout</button>
              </div>
            ) : (
              <>
                <Link to="/register" className="ghost">Register</Link>
                <Link to="/login" className="btn-primary" style={{ textDecoration: "none" }}>Sign in</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/book" element={<Reservations />} />
        <Route path="/search" element={<ReservationList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      <footer className="footer">
        <div className="container">
          <small>© 2026 Ocean View Resort · All rights reserved</small>
        </div>
      </footer>
    </div>
  );
}

