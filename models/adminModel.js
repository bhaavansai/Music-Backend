const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    mobilenumber: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String, required: true, enum: ['Male', 'Female'] },
    timezone: { type: String, required: true }
  }
);

module.exports = mongoose.model('Admin', adminSchema);
