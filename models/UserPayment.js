const pool = require('../config/database');

const UserPayment = {
  // Create a new payment record
  async create(paymentData) {
    const {
      user_id,
      subscription_id,
      amount,
      payment_method,
      transaction_date,
      transaction_reference,
      receipt_file,
      notes,
    } = paymentData;

    const query = `
      INSERT INTO userPayments 
        (user_id, subscription_id, amount, payment_method, transaction_date, transaction_reference, receipt_file, notes, status) 
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
      RETURNING id, user_id, subscription_id, amount, payment_method, transaction_date, transaction_reference, status, created_at
    `;

    const values = [
      user_id,
      subscription_id,
      amount,
      payment_method,
      transaction_date,
      transaction_reference,
      receipt_file || null,
      notes || null,
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Approve or reject a payment
  async updateStatus(paymentId, status) {
    const query = `
      UPDATE userPayments
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, status, updated_at
    `;

    try {
      const result = await pool.query(query, [status, paymentId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Get all payments for a user
  async getByUser(userId) {
    const query = `
      SELECT * FROM userPayments 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `;

    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Get all payments (admin view)
  async getAll() {
    const query = `
      SELECT * FROM userPayments 
      ORDER BY created_at DESC
    `;

    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = UserPayment;
