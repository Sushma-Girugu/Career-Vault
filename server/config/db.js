const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB...");

        await mongoose.connect(process.env.MONGO_URI, {
            family: 4,
            serverSelectionTimeoutMS: 15000,
            connectTimeoutMS: 15000,
            socketTimeoutMS: 45000
        });

        console.log("MongoDB Connected Successfully");
        console.log("MongoDB readyState:", mongoose.connection.readyState);

        await mongoose.connection.db.admin().ping();

        console.log("MongoDB Ping Successful");

        mongoose.connection.on("connected", () => {
            console.log("MongoDB connection established");
        });

        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB connection lost");
        });

        mongoose.connection.on("error", (error) => {
            console.log("MongoDB Runtime Error:", error.message);
        });

    } catch (error) {
        console.log("MongoDB Connection Failed:");
        console.log(error.message);

        process.exit(1);
    }
};

module.exports = connectDB;