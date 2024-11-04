const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db"); // Import the database connection
const initializeRoutes = require("./routes"); // Import the route initializer

const authRoutes = require("./routes/auth");
const checklistRoutes = require("./routes/checklist");
const orderRoutes = require("./routes/order");

const app = express();
app.use(cors());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to Procurement Management API");
});

// Routes
initializeRoutes(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
