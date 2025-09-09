// routes/payment.js
const express = require("express");
const router = express.Router();
const Admin = require("../models/payment"); // adjust path if needed

// ✅ Get all payments with user details
router.get("/all", async (req, res) => {
  try {
    const users = await Admin.getAllUsers();

    // Flatten into payment records with user info
    const payments = [];
    users.forEach((user) => {
      user.payments.forEach((payment) => {
        payments.push({
          id: payment.id,
          userId: user.id,
          userName: user.name,
          amount: parseFloat(payment.amount),
          date: payment.date,
          status: payment.status || "Completed", // fallback
          method: payment.method || "Unknown",
          note: payment.note,
        });
      });
    });

    res.json({ success: true, data: payments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ success: false, message: "Failed to fetch payments" });
  }
});

// ✅ Get payments by specific user
router.get("/user/:id", async (req, res) => {
  try {
    const payments = await Admin.getPaymentsByUser(req.params.id);
    res.json({ success: true, data: payments });
  } catch (error) {
    console.error("Error fetching user payments:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user payments" });
  }
});

// ✅ Create a new payment
router.post("/", async (req, res) => {
  try {
    const payment = await Admin.createPayment(req.body);
    res.json({ success: true, data: payment });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ success: false, message: "Failed to create payment" });
  }
});

// Get all payments with status filter
app.get('/api/user-payments', async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM usersPayments';
    let params = [];
    
    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update payment status
app.put('/api/user-payments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;
    
    const query = `
      UPDATE usersPayments 
      SET status = $1, admin_notes = $2, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $3 
      RETURNING *
    `;
    
    const result = await pool.query(query, [status, admin_notes, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new payment
app.post('/api/user-payments', async (req, res) => {
  try {
    const {
      name, contact, plot_taken, date_taken, initial_deposit,
      price_per_plot, payment_schedule, payment_method,
      transaction_reference, subscription_id, user_id
    } = req.body;

    const total_money_to_pay = plot_taken * price_per_plot;
    const total_balance = total_money_to_pay - initial_deposit;
    const status = initial_deposit >= total_money_to_pay ? 'completed' : 'pending';

    const query = `
      INSERT INTO usersPayments 
      (name, contact, plot_taken, date_taken, initial_deposit, 
       price_per_plot, payment_schedule, total_balance, total_money_to_pay,
       status, payment_method, transaction_reference, subscription_id, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const values = [
      name, contact, plot_taken, date_taken, initial_deposit,
      price_per_plot, payment_schedule, total_balance, total_money_to_pay,
      status, payment_method, transaction_reference, subscription_id, user_id
    ];

    const result = await pool.query(query, values);
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
module.exports = router;
