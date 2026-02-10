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
import About from "./pages/About";

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
          <span className="badge">Limited Offer: 20% Off Weekend Stays</span>
          <h1>Experience Luxury Between Sea and Sky</h1>
          <p>Indulge in an unforgettable escape at Ocean View Resort, where world-class comfort meets the tranquil beauty of the coast.</p>

          <div className="search-wrap">
            <div className="search-card glass">
              <div className="field">
                <div className="label">Check-in Date</div>
                <input type="date" />
              </div>

              <div className="field">
                <div className="label">Check-out Date</div>
                <input type="date" />
              </div>

              <div className="field">
                <div className="label">Preferred Suite</div>
                <select defaultValue="Deluxe">
                  <option value="Standard">Standard Room</option>
                  <option value="Deluxe">Deluxe Ocean View</option>
                  <option value="Suite">Presidential Suite</option>
                </select>
              </div>

              <button className="btn-accent">Check Availability</button>
            </div>
          </div>
        </div>
      </section>

      <main className="page">
        <div className="container">
          <div className="section-title">
            <span>Our Selection</span>
            <h2>Most Exquisite Rooms</h2>
            <p style={{ color: "var(--text-light)", marginTop: 10 }}>Handpicked for the ultimate comfort and aesthetic pleasure.</p>
          </div>

          <div className="room-grid">
            {loading ? (
              <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: 50 }}>
                <div className="loading-spinner"></div>
                <p>Curating your experience...</p>
              </div>
            ) : rooms.length > 0 ? (
              rooms.map((room) => (
                <article className="room-card" key={room._id}>
                  <div className="room-img-wrap">
                    <img
                      className="room-img"
                      src={
                        room.roomType === "Suite"
                          ? "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80"
                          : room.roomType === "Double"
                            ? "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
                            : "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
                      }
                      alt={room.roomType}
                      loading="lazy"
                    />
                  </div>
                  <div className="room-body">
                    <h3 className="room-name">
                      {room.roomType} Room {room.roomNumber}
                    </h3>
                    <div className="room-meta">
                      <span>• 25m²</span>
                      <span>• Ocean View</span>
                      <span>• Free Wi-Fi</span>
                    </div>
                    <div className="price-row">
                      <div className="price">
                        LKR {room.roomType === "Suite" ? "42,000" : "28,000"} <span>/ night</span>
                      </div>
                      <Link to="/book" className="btn btn-primary">
                        Reserve Now
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div style={{ textAlign: "center", gridColumn: "1 / -1", padding: "80px", background: '#fff', borderRadius: 24 }}>
                <p>Welcome to Ocean View Resort. We are preparing our first rooms.</p>
                <Link to="/rooms" className="btn btn-primary" style={{ display: "inline-block", marginTop: "20px" }}>
                  Manage Inventory
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
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));

    // theme init
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const isAdmin = user && user.role === "admin";

  return (
    <div className="app-container">
      <header className="ov-header">
        <div className="container bar">
          <Link to="/" className="brand" aria-label="Ocean View Resort" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className="brand-dot" />
            Ocean View Resort
          </Link>

          <nav className="header-nav">
            {isAdmin && <Link to="/rooms" className="nav-link">Inventory</Link>}
            <Link to="/about" className="nav-link">About Us</Link>
            <Link to="/book" className="nav-link">Book Room</Link>
            <Link to="/search" className="nav-link">My Booking</Link>
          </nav>

          <div className="header-actions">
            <button onClick={toggleTheme} className="ghost" style={{ padding: '8px 12px', marginRight: 15, fontSize: 18 }}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{user.name}</div>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--accent)' }}>{user.role} Member</div>
                </div>
                <button onClick={logout} className="ghost" style={{ padding: '8px 16px' }}>Logout</button>
              </div>
            ) : (
              <>
                <Link to="/register" className="nav-link" style={{ marginRight: 10 }}>Register</Link>
                <Link to="/login" className="btn btn-primary" style={{ textDecoration: "none" }}>Member Sign In</Link>
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
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <Link to="/" className="brand" style={{ color: '#fff', marginBottom: 20 }}>
                <span className="brand-dot" /> Ocean View
              </Link>
              <p style={{ opacity: 0.6, fontSize: 14 }}>
                A sanctuary of peace and luxury since 1998. Located on the pristine southern coast, offering breathtaking views and world-class hospitality.
              </p>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/about">Our Story</Link></li>
                <li><Link to="/rooms">All Suites</Link></li>
                <li><Link to="/book">Reservations</Link></li>
                <li><Link to="/login">Member Portal</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Contact Us</h4>
              <ul className="footer-links">
                <li>📍 Galle Road, South Coast, Sri Lanka</li>
                <li>📞 +94 11 234 5678</li>
                <li>✉️ stay@oceanviewresort.com</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Ocean View Resort · Redefining coastal luxury · Crafted by Dewmovies</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

