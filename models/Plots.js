// models/Plots.js
const pool = require('../config/database');

const Plots = {
  async createPlot(plotData) {
 const { number, location, dimension, price, status, owner } = plotData;

const query = `
  INSERT INTO plots (number, location, dimension, price, status, owner)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *
`;

const values = [number, location, dimension, price, status || 'Available', owner || null];


    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getAllPlots() {
    const query = 'SELECT * FROM plots ORDER BY id ASC';
    const result = await pool.query(query);
    return result.rows;
  },

  async getPlotById(id) {
    const query = 'SELECT * FROM plots WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async updatePlot(id, plotData) {
    const { number, location, dimension, price, status, owner } = plotData;

    const query = `
      UPDATE plots
      SET number = $1, location = $2, dimension = $3, price = $4, status = $5, owner = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `;

    const values = [number, location, dimension, price, status, owner, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async deletePlot(id) {
    const query = 'DELETE FROM plots WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = Plots;
