require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("./services/whatsappService"); // Initialize WhatsApp Service

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Ocean View Resort API ✅"));
app.use("/api/rooms", require("./routes/rooms"));
app.use("/api/reservations", require("./routes/reservations"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/idScan"));
app.use("/api/transports", require("./routes/transport"));
app.use("/api/attractions", require("./routes/attractions"));



connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  });
