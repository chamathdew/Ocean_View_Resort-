const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String, required: true },
    price: { type: String, required: true },
    desc: { type: String, required: true },
});

module.exports = mongoose.model('Transport', transportSchema);
