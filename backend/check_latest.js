const mongoose = require("mongoose");
require("dotenv").config();

async function checkLatestData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Using dynamic models to avoid schema issues if they differ
        const Reservation = mongoose.connection.db.collection("reservations");
        const Guest = mongoose.connection.db.collection("guests");

        const latestReservation = await Reservation.find().sort({ _id: -1 }).limit(1).toArray();

        if (latestReservation.length > 0) {
            console.log("\n--- Latest Reservation Details ---");
            console.log(JSON.stringify(latestReservation[0], null, 2));

            const guestId = latestReservation[0].guestId;
            if (guestId) {
                const guest = await Guest.findOne({ _id: guestId });
                console.log("\n--- Associated Guest Details ---");
                console.log(JSON.stringify(guest, null, 2));
            }
        } else {
            console.log("No reservations found.");
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error("Error:", error);
    }
}

checkLatestData();
