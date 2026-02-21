const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    img: { type: String, required: true },
    desc: { type: String, required: true },
});

module.exports = mongoose.model('Attraction', attractionSchema);
