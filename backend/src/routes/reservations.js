const router = require("express").Router();
const Reservation = require("../models/Reservation");
const Room = require("../models/Room");
const Guest = require("../models/Guest");

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
    const { fullName, address, contactNumber, idNumber, roomId, checkIn, checkOut } = req.body;

    if (new Date(checkOut) <= new Date(checkIn))
      return res.status(400).json({ message: "Invalid date range" });

    // create guest
    const guest = await Guest.create({ fullName, address, contactNumber, idNumber });

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

module.exports = router;
