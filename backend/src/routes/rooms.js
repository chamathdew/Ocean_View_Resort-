const router = require("express").Router();
const Room = require("../models/Room");
const { auth, admin } = require("../middleware/auth");

// CREATE room (Admin Only)
router.post("/", auth, admin, async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: "Room number already exists" });
    res.status(400).json({ message: e.message });
  }
});

// READ all rooms (Public or User)
router.get("/", async (req, res) => {
  const rooms = await Room.find().sort({ createdAt: -1 });
  res.json(rooms);
});

// UPDATE room (Admin Only)
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const updated = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "Room not found" });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// DELETE room (Admin Only)
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const deleted = await Room.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Room not found" });
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
