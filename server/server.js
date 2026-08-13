const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const profileRoutes = require("./routes/profileRoutes");
const skillRoutes = require("./routes/skillRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/profile", profileRoutes);
app.use("/api/skills", skillRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("CareerVault Backend is Running!");
});

// API test route
app.get("/api/test", (req, res) => {
  res.json({
    message: "API is working"
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`CareerVault server running on port ${PORT}`);
  console.log(`Profile API: http://localhost:${PORT}/api/profile`);
  console.log(`Skills API: http://localhost:${PORT}/api/skills`);
});