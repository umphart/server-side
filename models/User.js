const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const User = {
  // Create a new user
  async create(userData) {
    const { name, email, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (name, email, password) 
      VALUES ($1, $2, $3) 
      RETURNING id, name, email, created_at
    `;
    
    const values = [name, email, hashedPassword];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('User with this email already exists');
      }
      throw error;
    }
  },

  
  // Find user by email
  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    
    try {
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Find user by ID
  async findById(id) {
    const query = 'SELECT id, name, email, created_at FROM users WHERE id = $1';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
  

  // Verify password
  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },
  // Get all users
async getAll() {
  const query = 'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC';
  
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

};

module.exports = User;