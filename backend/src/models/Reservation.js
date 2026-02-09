const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    reservationNo: { type: String, unique: true, required: true },

    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: true,
    },

    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },

    status: {
      type: String,
      enum: ["booked", "checked_in", "checked_out", "canceled"],
      default: "booked",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
