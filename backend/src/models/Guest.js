const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    address: String,
    contactNumber: { type: String, required: true },
    idNumber: { type: String, required: true },
    dateOfBirth: String,
    gender: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Guest", guestSchema);
