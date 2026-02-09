const router = require("express").Router();
const Room = require("../models/Room");

// CREATE room
router.post("/", async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (e) {
    // duplicate key (unique roomNumber)
    if (e.code === 11000) return res.status(409).json({ message: "Room number already exists" });
    res.status(400).json({ message: e.message });
  }
});

// READ all rooms
router.get("/", async (req, res) => {
  const rooms = await Room.find().sort({ createdAt: -1 });
  res.json(rooms);
});

// UPDATE room
router.put("/:id", async (req, res) => {
  try {
    const updated = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "Room not found" });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// DELETE room
router.delete("/:id", async (req, res) => {
  const deleted = await Room.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Room not found" });
  res.json({ message: "Deleted" });
});

module.exports = router;
