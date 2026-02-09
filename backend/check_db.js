const mongoose = require("mongoose");
require("dotenv").config();

async function checkDatabase() {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error("❌ MONGO_URI is missing in .env");
            return;
        }

        console.log("Connecting to MongoDB...");
        await mongoose.connect(uri);
        console.log("✅ Connected successfully!");

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();

        if (collections.length === 0) {
            console.log("⚠️ No collections found in the database. Data might not have been sent yet.");
        } else {
            console.log("\n--- Database Statistics ---");
            for (let col of collections) {
                const count = await db.collection(col.name).countDocuments();
                console.log(`Collection [${col.name}]: ${count} documents`);
            }
            console.log("---------------------------\n");
        }

        await mongoose.connection.close();
        console.log("Disconnected from MongoDB.");
    } catch (error) {
        console.error("❌ Error checking database:", error.message);
    }
}

checkDatabase();
