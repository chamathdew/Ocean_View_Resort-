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
import RoomDetails from "./pages/RoomDetails";
import AdminDashboard from "./pages/AdminDashboard";
import { ROOM_DATA } from "./utils/roomData";

const API = `http://${window.location.hostname}:5000`;

function Home() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const { data } = await axios.get(`${API}/api/rooms`);
        // Show all rooms from database
        setRooms(data);
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
            <div className="search-card">
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
                <select defaultValue="Double">
                  <option value="Single">Standard Room</option>
                  <option value="Double">Deluxe Ocean View</option>
                  <option value="Family">Coastal Family Haven</option>
                  <option value="Suite">Presidential Suite</option>
                </select>
              </div>

              <Link to="/book" className="btn btn-accent" style={{ textDecoration: 'none', justifyContent: 'center' }}>Check Availability</Link>
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
              rooms
                .filter((room, index, self) => index === self.findIndex((r) => r.roomType === room.roomType))
                .map((room) => {
                  const info = ROOM_DATA[room.roomType] || ROOM_DATA.Double;
                  return (
                    <article className="room-card" key={room._id}>
                      <Link to={`/room/${room.roomType}`} style={{ textDecoration: 'none' }}>
                        <div className="room-img-wrap">
                          <img
                            className="room-img"
                            src={info.images[0]}
                            alt={room.roomType}
                            loading="lazy"
                          />
                        </div>
                        <div className="room-body">
                          <h3 className="room-name">
                            {info.name}
                          </h3>
                          <div className="room-meta">
                            <span>• {info.capacity}</span>
                            <span>• Ocean View</span>
                            <span>• {info.amenities[1]}</span>
                          </div>
                          <div className="price-row">
                            <div className="price">
                              LKR {info.price.toLocaleString()} <span>/ night</span>
                            </div>
                            <span className="btn btn-primary btn-sm">
                              View Details
                            </span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  );
                })
            ) : (
              <div className="glass-panel" style={{ textAlign: "center", gridColumn: "1 / -1", padding: "80px", color: 'var(--text-muted)' }}>
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            style={{ display: 'none', background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'var(--primary)' }}
          >
            ☰
          </button>

          <nav className={`header-nav ${mobileMenuOpen ? 'open' : ''}`}>
            {isAdmin && <Link to="/admin" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>}
            {isAdmin && <Link to="/rooms" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Inventory</Link>}
            <Link to="/about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
            {!isAdmin && <Link to="/book" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Book Room</Link>}
            <Link to="/search" className="nav-link" onClick={() => setMobileMenuOpen(false)}>My Booking</Link>
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
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/book" element={<Reservations />} />
        <Route path="/search" element={<ReservationList />} />
        <Route path="/about" element={<About />} />
        <Route path="/room/:type" element={<RoomDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {isAdmin && <Route path="/admin" element={<AdminDashboard />} />}
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
    </div >
  );
}

