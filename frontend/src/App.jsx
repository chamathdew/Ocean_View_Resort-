import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./App.css";

// Import Pages
import Rooms from "./pages/Rooms";
import Reservations from "./pages/Reservations";
import ReservationList from "./pages/ReservationList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Help from "./pages/Help";
import RoomDetails from "./pages/RoomDetails";
import AdminDashboard from "./pages/AdminDashboard";
import { ROOM_DATA } from "./utils/roomData";
import ScrollToTop from "./components/ScrollToTop";
import logoImage from "./assets/logo1.png";

const API = import.meta.env.DEV ? "http://localhost:8080" : "";

function Home() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);



  const [transports, setTransports] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [suiteType, setSuiteType] = useState("Double");
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [transportForm, setTransportForm] = useState({ 
    location: "", 
    startDate: "", 
    endDate: "" 
  });
  const [transportSuccess, setTransportSuccess] = useState(false);
  const navigate = useNavigate();

  const handleBookTransport = (item) => {
    setSelectedTransport(item);
    setShowTransportModal(true);
    setTransportSuccess(false);
  };

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e - s);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays === 0 ? 1 : diffDays; // Minimum 1 day
  };

  const calculateTotal = () => {
    if (!selectedTransport || !selectedTransport.price) return 0;
    const priceStr = selectedTransport.price.replace(/[^0-9.]/g, ''); // Extract numbers from price string (e.g., "5,000 LKR")
    const price = parseFloat(priceStr);
    const days = calculateDays(transportForm.startDate, transportForm.endDate);
    return isNaN(price) ? 0 : price * days;
  };

  const confirmTransportBooking = () => {
    if (!transportForm.startDate || !transportForm.endDate) {
      alert("Please enter both Start Date and End Date.");
      return;
    }
    
    // Check if end date is before start date
    if (new Date(transportForm.endDate) < new Date(transportForm.startDate)) {
      alert("End Date cannot be before Start Date.");
      return;
    }

    // Prepare booking data to send to backend or show in success

    setTransportSuccess(true);
    setTimeout(() => {
      setShowTransportModal(false);
      setTransportForm({ location: "", startDate: "", endDate: "" });
      setTransportSuccess(false);
    }, 4000); // Increased timeout to let user read the simulated bill
  };

  const handleCheckAvailability = () => {
    if (!checkIn || !checkOut) {
      alert("Please select both Check-in and Check-out dates.");
      return;
    }
    navigate(`/book?checkIn=${checkIn}&checkOut=${checkOut}&type=${suiteType}`);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [roomsRes, transportsRes, attractionsRes] = await Promise.all([
          axios.get(`${API}/api/rooms`),
          axios.get(`${API}/api/transports`),
          axios.get(`${API}/api/attractions`)
        ]);

        setRooms(roomsRes.data);
        setTransports(transportsRes.data);
        setAttractions(attractionsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const counts = { Single: 0, Double: 0, Family: 0, Suite: 0 };
  rooms.forEach(r => {
    if (r.status === 'active') counts[r.roomType] = (counts[r.roomType] || 0) + 1;
  });

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
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
              </div>

              <div className="field">
                <div className="label">Check-out Date</div>
                <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
              </div>

              <div className="field">
                <div className="label">Preferred Suite</div>
                <select value={suiteType} onChange={(e) => setSuiteType(e.target.value)}>
                  <option value="Single">Single ({counts.Single} Available)</option>
                  <option value="Double">Double ({counts.Double} Available)</option>
                  <option value="Family">Family ({counts.Family} Available)</option>
                  <option value="Suite">Suite ({counts.Suite} Available)</option>
                </select>
              </div>

              <button onClick={handleCheckAvailability} className="btn btn-accent" style={{ justifyContent: 'center' }}>Check Availability</button>
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
                    <article className="room-card" key={room.id}>
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
                            <div className="price" style={{display: 'flex', flexDirection: 'column'}}>
                              <span>LKR {info.price.toLocaleString()} <span style={{fontSize: '14px', fontWeight: 'normal', color: 'var(--text-light)'}}>/ night</span></span>
                              <span style={{fontSize: '13px', fontWeight: 'bold', color: counts[room.roomType] > 0 ? '#16a34a' : '#dc2626', marginTop: '4px'}}>
                                {counts[room.roomType] > 0 ? `${counts[room.roomType]} Rooms Available` : 'Sold Out'}
                              </span>
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

      <section className="section section-transport">
        <div className="container">
          <div className="section-title">
            <span>Explore Freely</span>
            <h2>Rent A Vehicle</h2>
            <p style={{ color: "var(--text-light)", marginTop: 10 }}>Choose your preferred vehicle to explore the coast.</p>
          </div>

          <div className="transport-grid">
            {transports.length > 0 ? transports.map((item, i) => (
              <div key={i} className="transport-card">
                <div className="transport-img-wrap" style={{ width: '100%', height: '180px', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
                  <img src={item.image || item.icon} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h3>{item.name}</h3>
                <div className="price-tag" style={{ marginTop: '10px' }}>{item.price} / day</div>
                <button 
                  onClick={() => handleBookTransport(item)}
                  className="btn btn-sm btn-accent" 
                  style={{ marginTop: 15, width: '100%' }}
                >
                  Book Vehicle
                </button>
              </div>
            )) : (
              <p style={{ color: "var(--text-muted)" }}>No vehicle options available at the moment.</p>
            )}
          </div>
        </div>
      </section>

      <section className="section section-attractions">
        <div className="container">
          <div className="section-title">
            <span>Discover Galle</span>
            <h2>Nearby Attractions</h2>
            <p style={{ color: "var(--text-light)", marginTop: 10 }}>Immerse yourself in history and nature just minutes away.</p>
          </div>

          <div className="attraction-grid">
            {attractions.length > 0 ? attractions.map((place, i) => (
              <div key={i} className="attraction-card horizontal">
                <div className="attraction-img-wrap">
                  <img src={place.img} alt={place.name} loading="lazy" />
                </div>
                <div className="attraction-info">
                  <h3>{place.name}</h3>
                  <p style={{ marginBottom: '16px' }}>
                    {place.desc.length > 200 ? place.desc.substring(0, 200) + '...' : place.desc}
                  </p>
                  <button 
                    onClick={() => setSelectedAttraction(place)}
                    className="btn btn-sm ghost" 
                    style={{ width: 'fit-content' }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            )) : (
              <p style={{ color: "var(--text-muted)" }}>No attractions listed at the moment.</p>
            )}
          </div>
        </div>
      </section>

      {/* Transport Booking Modal */}
      {showTransportModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div className="modal-content" style={{ width: '90%', maxWidth: '450px', backgroundColor: 'var(--card-bg)', padding: '32px', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--border-color)', position: 'relative', animation: 'modalSlideUp 0.3s ease-out' }}>
            {transportSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
                <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>Vehicle Reserved!</h3>
                <p style={{ color: 'var(--text-light)', lineHeight: '1.6', marginBottom: '20px' }}>Our concierge will contact you shortly to arrange the delivery of your {selectedTransport?.name}.</p>
                <div style={{ padding: '16px', backgroundColor: 'var(--input-bg)', borderRadius: '12px', border: '1px dashed var(--border-color)', textAlign: 'left' }}>
                    <div style={{ fontWeight: 'bold', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '8px' }}>Rental Invoice Summary</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}><span>Vehicle:</span> <span>{selectedTransport?.name}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}><span>Duration:</span> <span>{calculateDays(transportForm.startDate, transportForm.endDate)} Day(s)</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}><span>Total Rent:</span> <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{calculateTotal().toLocaleString()} LKR</span></div>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ margin: 0, fontSize: '20px' }}>Rent {selectedTransport?.name}</h3>
                  <button onClick={() => setShowTransportModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-light)' }}>×</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Start Date</label>
                        <input 
                            type="date" 
                            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-main)' }}
                            value={transportForm.startDate}
                            onChange={(e) => setTransportForm({ ...transportForm, startDate: e.target.value })}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>End Date</label>
                         <input 
                            type="date" 
                            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-main)' }}
                            value={transportForm.endDate}
                            onChange={(e) => setTransportForm({ ...transportForm, endDate: e.target.value })}
                        />
                    </div>
                </div>

                {transportForm.startDate && transportForm.endDate && new Date(transportForm.endDate) >= new Date(transportForm.startDate) && (
                    <div style={{ padding: '16px', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', marginBottom: '28px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-main)' }}>
                            <span>Rate ({selectedTransport?.price}/day) x {calculateDays(transportForm.startDate, transportForm.endDate)} days</span>
                            <span style={{ fontWeight: 'bold' }}>{calculateTotal().toLocaleString()} LKR</span>
                        </div>
                    </div>
                )}

                <button 
                  onClick={confirmTransportBooking}
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '14px', borderRadius: '12px' }}
                >
                  Confirm Rental Request
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Attraction Info Modal */}
      {selectedAttraction && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div className="modal-content" style={{ width: '90%', maxWidth: '750px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--card-bg)', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--border-color)', position: 'relative', animation: 'modalSlideUp 0.3s ease-out', overflow: 'hidden' }}>
            <div style={{ height: '350px', width: '100%', position: 'relative', flexShrink: 0 }}>
              <img src={selectedAttraction.img} alt={selectedAttraction.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button 
                onClick={() => setSelectedAttraction(null)} 
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', fontSize: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)', transition: 'background 0.3s' }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '32px 40px', overflowY: 'auto' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '32px', background: 'linear-gradient(90deg, var(--text), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>
                {selectedAttraction.name}
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '16px', margin: 0 }}>
                {selectedAttraction.desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
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
      {!isAdminRoute && (
        <header className="ov-header">
          <div className="container bar">
            <Link to="/" className="brand" aria-label="Ocean View Resort" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
              <img src={logoImage} alt="Ocean View Resort" style={{ height: '60px', objectFit: 'contain' }} />
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
              <Link to="/help" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Help Center</Link>
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
      )}

      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/book" element={<Reservations />} />
        <Route path="/search" element={<ReservationList />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path="/room/:type" element={<RoomDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {isAdmin && <Route path="/admin" element={<AdminDashboard />} />}
      </Routes>

      {!isAdminRoute && (
        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              <div className="footer-col">
                <Link to="/" className="brand" style={{ color: '#fff', marginBottom: 20, display: 'flex', alignItems: 'center' }}>
                  <img src={logoImage} alt="Ocean View Resort" style={{ height: '60px', objectFit: 'contain' }} />
                </Link>
                <p style={{ opacity: 0.6, fontSize: 14 }}>
                  A sanctuary of peace and luxury since 1998. Located on the pristine southern coast, offering breathtaking views and world-class hospitality.
                </p>
              </div>
              <div className="footer-col">
                <h4>Quick Links</h4>
                <ul className="footer-links">
                  <li><Link to="/about">Our Story</Link></li>
                  <li><Link to="/help">Help & FAQ</Link></li>
                  <li><Link to="/rooms">All Suites</Link></li>
                  <li><Link to="/book">Reservations</Link></li>
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
              <p>© 2026 Ocean View Resort · All Rights Reserved</p>
            </div>
          </div>
        </footer>
      )}
    </div >
  );
}

