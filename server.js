const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const User = require('./models/User');
const Admin = require('./models/Admin');

// Load env vars
dotenv.config();

const app = express();

// ====================== FILE UPLOADS FIX ======================
// Make sure uploads folder always exists (Render resets FS)
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Serve uploaded files
app.use("/uploads", express.static(uploadPath));

// ===============================================================

// Security middleware
app.use(helmet());

// CORS middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://musabaha-home-ltd.onrender.com",
  "https://musabaha-homes.vercel.app", // ✅ correct frontend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ====================== ROUTES ======================
const userSubsequentPaymentsRoutes = require("./routes/userSubsequentPayments");
app.use("/api/user-subsequent-payments", userSubsequentPaymentsRoutes);

const plotRoutes = require("./routes/plots");
app.use("/api/plots", plotRoutes);

const subscriptionRoutes = require("./routes/subscriptions");
app.use("/api/subscriptions", subscriptionRoutes);

const userPaymentRoutes = require("./routes/UserPayment");
app.use("/api/user-payments", userPaymentRoutes);

// Example test upload route (optional)
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.json({
    success: true,
    file: `/uploads/${req.file.filename}`,
  });
});

// ====================== HEALTH CHECK ======================
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Musabaha Homes API server is running!" });
});

// ====================== ERROR HANDLING ======================
app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

app.use((error, req, res, next) => {
  console.error("Server error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// ====================== SERVER START ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Health check: http://localhost:${PORT}/api/health`);
});
