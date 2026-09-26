const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const connectDB = require("./config/db");

const profileRoutes = require("./routes/profileRoutes");
const skillRoutes = require("./routes/skillRoutes");
const jobApplicationRoutes = require("./routes/jobApplicationRoutes");
const projectRoutes = require("./routes/projectRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use(
  "/api/profile",
  profileRoutes
);

app.use(
  "/api/skills",
  skillRoutes
);

app.use(
  "/api/job-applications",
  jobApplicationRoutes
);

app.use(
  "/api/projects",
  projectRoutes
);

app.get("/", (req, res) => {
  res.send("CareerVault Backend is Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`CareerVault server running on port ${PORT}`);
  console.log(`Profile API: http://localhost:${PORT}/api/profile`);
  console.log(`Skills API: http://localhost:${PORT}/api/skills`);
  console.log(
    `Job Applications API: http://localhost:${PORT}/api/job-applications`
  );
  console.log(
    `Projects API: http://localhost:${PORT}/api/projects`
  );
});