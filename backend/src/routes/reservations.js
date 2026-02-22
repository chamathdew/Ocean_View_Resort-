const router = require("express").Router();
const Reservation = require("../models/Reservation");
const Room = require("../models/Room");
const Guest = require("../models/Guest");
const { auth, admin } = require("../middleware/auth");
const { sendWhatsAppMessage } = require("../services/whatsappService");

/* 0️⃣ GET ALL RESERVATIONS (ADMIN) */
router.get("/", auth, admin, async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("guestId roomId")
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/* 1️⃣ GET AVAILABLE ROOMS */
router.get("/available", async (req, res) => {
  const { roomType, checkIn, checkOut } = req.query;

  if (!roomType || !checkIn || !checkOut)
    return res.status(400).json({ message: "Missing data" });

  const rooms = await Room.find({ roomType, status: "active" });

  const available = [];

  for (const room of rooms) {
    const conflict = await Reservation.findOne({
      roomId: room._id,
      status: { $in: ["booked", "checked_in"] },
      checkIn: { $lt: new Date(checkOut) },
      checkOut: { $gt: new Date(checkIn) },
    });

    if (!conflict) available.push(room);
  }

  res.json(available);
});

/* 2️⃣ CREATE RESERVATION */
router.post("/", async (req, res) => {
  try {
    const { fullName, address, contactNumber, idNumber, dateOfBirth, gender, roomId, checkIn, checkOut } = req.body;

    if (new Date(checkOut) <= new Date(checkIn))
      return res.status(400).json({ message: "Invalid date range" });

    // create guest
    const guest = await Guest.create({ fullName, address, contactNumber, idNumber, dateOfBirth, gender });

    // conflict check
    const conflict = await Reservation.findOne({
      roomId,
      status: { $in: ["booked", "checked_in"] },
      checkIn: { $lt: new Date(checkOut) },
      checkOut: { $gt: new Date(checkIn) },
    });

    if (conflict)
      return res.status(409).json({ message: "Room already booked" });

    // reservation number
    const reservationNo = "OVR-" + Date.now();

    const reservation = await Reservation.create({
      reservationNo,
      guestId: guest._id,
      roomId,
      checkIn,
      checkOut,
    });

    const populated = await Reservation.findById(reservation._id).populate("guestId roomId");

    // --- SEND WHATSAPP MESSAGE ---
    if (guest.contactNumber) {
      const msg = `🎉 *Booking Confirmed!*\n\nHi ${guest.fullName},\n\nThank you for choosing Ocean View Resort. Here are your booking details:\n\n*Reservation No:* ${reservationNo}\n*Room:* ${populated.roomId.roomNo} (${populated.roomId.roomType})\n*Check-In:* ${new Date(checkIn).toDateString()}\n*Check-Out:* ${new Date(checkOut).toDateString()}\n\nLooking forward to hosting you!`;

      // Fire and forget (don't block the API response)
      sendWhatsAppMessage(guest.contactNumber, msg);
    }

    res.status(201).json(populated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});


/* 3️⃣ GET RESERVATION BY NO */
router.get("/:reservationNo", async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      reservationNo: req.params.reservationNo,
    }).populate("guestId roomId");

    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });

    res.json(reservation);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/* 4️⃣ UPDATE PAYMENT STATUS (ADMIN) */
router.patch("/:id/payment", auth, admin, async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { isPaid: req.body.isPaid },
      { new: true }
    );
    res.json(reservation);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/* 5️⃣ DELETE RESERVATION (ADMIN) */
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate("guestId roomId");
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });

    // Send WhatsApp cancellation message
    if (reservation.guestId && reservation.guestId.contactNumber) {
      const msg = `⚠️ *Booking Cancelled*\n\nHi ${reservation.guestId.fullName},\n\nYour reservation (No: ${reservation.reservationNo}) at Ocean View Resort has been cancelled.\n\nIf you believe this is a mistake, please contact our concierge desk at +94 11 234 5678.`;
      sendWhatsAppMessage(reservation.guestId.contactNumber, msg);
    }

    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ message: "Reservation deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
