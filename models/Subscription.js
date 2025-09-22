// models/Subscription.js
const pool = require('../config/database');
const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const Subscription = {
  create: async (data) => {
    // Map frontend field names to database column names
    const fieldMap = {
      title: 'title',
      name: 'name',
      residentialAddress: 'residential_address',
      occupation: 'occupation',
      officeAddress: 'office_address',
      dob: 'dob',
      stateOfOrigin: 'state_of_origin',
      lga: 'lga',
      sex: 'sex',
      telephone: 'telephone',
      nationality: 'nationality',
      officeNumber: 'office_number',
      homeNumber: 'home_number',
      postalAddress: 'postal_address',
      email: 'email',
      identification: 'identification',
      utilityBill: 'utility_bill',
      passportPhoto: 'passport_photo',
      identificationFile: 'identification_file',
      utilityBillFile: 'utility_bill_file',
      nextOfKinName: 'next_of_kin_name',
      nextOfKinAddress: 'next_of_kin_address',
      nextOfKinRelationship: 'next_of_kin_relationship',
      nextOfKinTel: 'next_of_kin_tel',
      nextOfKinOccupation: 'next_of_kin_occupation',
      nextOfKinOfficeAddress: 'next_of_kin_office_address',
      nextOfKinEmail: 'next_of_kin_email',
      estateName: 'estate_name',
      numberOfPlots: 'number_of_plots',
      proposedUse: 'proposed_use',
      proposedType: 'proposed_type',
      price:'price',
      plotSize: 'plot_size',
      paymentTerms: 'payment_terms',
      altContactName: 'alt_contact_name',
      altContactAddress: 'alt_contact_address',
      altContactRelationship: 'alt_contact_relationship',
      altContactTel: 'alt_contact_tel',
      altContactEmail: 'alt_contact_email',
      referralAgentName: 'referral_agent_name',
      referralAgentContact: 'referral_agent_contact',
      agreedToTerms: 'agreed_to_terms',
      signatureText: 'signature_text',
      signatureFile: 'signature_file',
      plotId: 'plot_id', 
    };

    // Filter out undefined values and map to database columns
    const columns = [];
    const values = [];
    const placeholders = [];
    
    let paramCount = 1;
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null && fieldMap[key]) {
        columns.push(fieldMap[key]);
        values.push(value);
        placeholders.push(`$${paramCount}`);
        paramCount++;
      }
    }

    if (columns.length === 0) {
      throw new Error('No valid data provided for insertion');
    }

    const query = `
      INSERT INTO subscriptions (${columns.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *;
    `;

    try {
      console.log('Executing query:', query);
      console.log('With values:', values);
      
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },

  getAll: async () => {
    const query = 'SELECT * FROM subscriptions ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  },

  getById: async (id) => {
    const query = 'SELECT * FROM subscriptions WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
  // In models/Subscription.js
findByEmail: async (email) => {
  const query = 'SELECT * FROM subscriptions WHERE email = $1 ORDER BY created_at DESC';
  const result = await pool.query(query, [email]);
  return result.rows;
},
updateStatus: async (id, status) => {
  const query = "UPDATE subscriptions SET status = $1 WHERE id = $2 RETURNING *";
  const values = [status, id];
  const result = await pool.query(query, values);
  return result.rows[0];
},

};


module.exports = Subscription;