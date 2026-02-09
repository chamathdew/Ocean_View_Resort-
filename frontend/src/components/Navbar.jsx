import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkStyle = ({ isActive }) => ({
    padding: "8px 14px",
    textDecoration: "none",
    borderRadius: 8,
    color: isActive ? "#fff" : "#ddd",
    background: isActive ? "#1e88e5" : "transparent",
  });

  return (
    <nav style={{ display: "flex", gap: 10, padding: 15, borderBottom: "1px solid #333" }}>
      <NavLink to="/" style={linkStyle}>New Reservation</NavLink>
      <NavLink to="/rooms" style={linkStyle}>Rooms</NavLink>
      <NavLink to="/list" style={linkStyle}>Reservation List</NavLink>
    </nav>
  );
}
