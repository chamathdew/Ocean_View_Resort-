const express = require("express");
const router = express.Router();
const Transport = require("../models/Transport");

// Get all transports
router.get("/", async (req, res) => {
    try {
        const transports = await Transport.find();
        res.json(transports);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add new transport
router.post("/", async (req, res) => {
    const transport = new Transport({
        name: req.body.name,
        icon: req.body.icon,
        price: req.body.price,
        desc: req.body.desc,
    });

    try {
        const newTransport = await transport.save();
        res.status(201).json(newTransport);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update transport
router.put("/:id", async (req, res) => {
    try {
        const transport = await Transport.findById(req.params.id);
        if (!transport) return res.status(404).json({ message: "Transport not found" });

        if (req.body.name) transport.name = req.body.name;
        if (req.body.icon) transport.icon = req.body.icon;
        if (req.body.price) transport.price = req.body.price;
        if (req.body.desc) transport.desc = req.body.desc;

        const updatedTransport = await transport.save();
        res.json(updatedTransport);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete transport
router.delete("/:id", async (req, res) => {
    try {
        const transport = await Transport.findById(req.params.id);
        if (!transport) return res.status(404).json({ message: "Transport not found" });

        await transport.deleteOne();
        res.json({ message: "Transport deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
