const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./src/models/User");
require("dotenv").config();

async function createAdmin() {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error("❌ MONGO_URI is missing in .env");
            return;
        }

        console.log("Connecting to MongoDB...");
        await mongoose.connect(uri);
        console.log("✅ Connected successfully!");

        const adminEmail = "admin@oceanview.com";
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log("⚠️ Admin account already exists.");
        } else {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            const newAdmin = new User({
                name: "System Admin",
                email: adminEmail,
                password: hashedPassword,
                role: "admin",
            });

            await newAdmin.save();
            console.log("✅ Admin account created: admin@oceanview.com / admin123");
        }

        await mongoose.connection.close();
        console.log("Disconnected from MongoDB.");
    } catch (error) {
        console.error("❌ Error creating admin:", error.message);
    }
}

createAdmin();
