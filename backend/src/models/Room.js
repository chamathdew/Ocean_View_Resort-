const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true, trim: true },
    roomType: {
      type: String,
      required: true,
      enum: ["Single", "Double", "Family", "Suite"],
    },
    status: { type: String, enum: ["active", "maintenance"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
