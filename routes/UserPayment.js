const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const UserPayment = require("../models/UserPayment");
const pool = require("../config/database"); // ✅ Make sure to import pool

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/receipts"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// POST /api/user-payments → create payment
router.post("/", upload.single("receipt"), async (req, res) => {
  try {
    const {
      subscriptionId,
      userId,
      initial_deposit,
      paymentMethod,
      transactionDate,
      transactionReference,
      notes,
    } = req.body;

    const paymentData = {
      user_id: userId,
      subscription_id: subscriptionId,
      amount: initial_deposit,
      payment_method: paymentMethod,
      transaction_date: transactionDate,
      transaction_reference: transactionReference,
      notes,
      receipt_file: req.file ? req.file.filename : null,
    };

    const payment = await UserPayment.create(paymentData);

    res.status(201).json({ success: true, payment });
  } catch (error) {
    console.error("Error creating payment:", error.message);
    res.status(500).json({ success: false, error: "Failed to create payment" });
  }
});

// PATCH /api/user-payments/:id/status → update status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updated = await UserPayment.updateStatus(id, status);
    res.json({ success: true, updated });
  } catch (error) {
    console.error("Error updating payment status:", error.message);
    res.status(500).json({ success: false, error: "Failed to update payment status" });
  }
});

// GET /api/user-payments/user/:userId → fetch user payments
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM userPayments WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json({ success: true, payments: result.rows });
  } catch (error) {
    console.error("Error fetching payments:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// GET /api/user-payments → fetch all payments
router.get("/", async (req, res) => {
  try {
    const payments = await UserPayment.getAll();
    res.json({ success: true, payments });
  } catch (error) {
    console.error("Error fetching all payments:", error.message);
    res.status(500).json({ success: false, error: "Failed to fetch payments" });
  }
});

module.exports = router;
