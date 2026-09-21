const mongoose = require("mongoose");

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
      console.log(
        "MongoDB readyState:",
        mongoose.connection.readyState
      );

      await mongoose.connection.db.admin().ping();

      console.log("MongoDB Ping Successful");

      mongoose.connection.on("disconnected", () => {
        console.log("MongoDB Disconnected");
      });

      mongoose.connection.on("error", (error) => {
        console.log("MongoDB Runtime Error:", error.message);
      });

      return;
    } catch (error) {
      console.log(
        `MongoDB connection attempt ${attempt} failed:`,
        error.message
      );

      if (attempt < maxRetries) {
        console.log("Retrying in 3 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 3000));
      } else {
        console.log("MongoDB Connection Failed after all retries");
        throw error;
      }
    }
  }
};

module.exports = connectDB;