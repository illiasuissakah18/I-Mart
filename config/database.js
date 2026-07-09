const mongoose = require("mongoose");

async function connectDatabase() {

    try {

        console.log(
            "Mongo URI:",
            process.env.MONGODB_URI ? "Loaded ✅" : "Missing ❌"
        );

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("✅ MongoDB Connected Successfully");

    } catch (error) {

        console.error("❌ MongoDB Connection Failed");
        console.error(error);

        throw error;

    }

}

module.exports = connectDatabase;