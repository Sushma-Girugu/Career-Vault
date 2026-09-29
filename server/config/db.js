const mongoose = require("mongoose");
const dns = require("dns");

// Use reliable DNS servers for MongoDB Atlas SRV lookup
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
    const maxRetries = 5;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`MongoDB connection attempt ${attempt}/${maxRetries}...`);

            await mongoose.connect(process.env.MONGO_URI, {
                family: 4,
                serverSelectionTimeoutMS: 15000,
                connectTimeoutMS: 15000,
                socketTimeoutMS: 45000
            });

            console.log("MongoDB Connected Successfully");
            console.log("MongoDB readyState:", mongoose.connection.readyState);

            // Test MongoDB connection
            await mongoose.connection.db.admin().ping();

            console.log("MongoDB Ping Successful");

            return;

        } catch (error) {
            console.error(
                `MongoDB connection attempt ${attempt} failed:`,
                error.message
            );

            if (attempt < maxRetries) {
                console.log("Retrying in 3 seconds...");

                await new Promise(resolve => {
                    setTimeout(resolve, 3000);
                });
            } else {
                console.error("MongoDB Connection Failed after all retries");
                process.exit(1);
            }
        }
    }
};

module.exports = connectDB;