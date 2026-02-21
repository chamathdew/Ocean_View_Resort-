const express = require("express");
const router = express.Router();
const Attraction = require("../models/Attraction");

// Get all attractions
router.get("/", async (req, res) => {
    try {
        const attractions = await Attraction.find();
        res.json(attractions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add new attraction
router.post("/", async (req, res) => {
    const attraction = new Attraction({
        name: req.body.name,
        img: req.body.img,
        desc: req.body.desc,
    });

    try {
        const newAttraction = await attraction.save();
        res.status(201).json(newAttraction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update attraction
router.put("/:id", async (req, res) => {
    try {
        const attraction = await Attraction.findById(req.params.id);
        if (!attraction) return res.status(404).json({ message: "Attraction not found" });

        if (req.body.name) attraction.name = req.body.name;
        if (req.body.img) attraction.img = req.body.img;
        if (req.body.desc) attraction.desc = req.body.desc;

        const updatedAttraction = await attraction.save();
        res.json(updatedAttraction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete attraction
router.delete("/:id", async (req, res) => {
    try {
        const attraction = await Attraction.findById(req.params.id);
        if (!attraction) return res.status(404).json({ message: "Attraction not found" });

        await attraction.deleteOne();
        res.json({ message: "Attraction deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
