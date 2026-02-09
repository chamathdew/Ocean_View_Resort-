import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Reservations from "./pages/Reservations";
import Rooms from "./pages/Rooms";
import ReservationList from "./pages/ReservationList";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Reservations />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/list" element={<ReservationList />} />
      </Routes>
    </>
  );
}
