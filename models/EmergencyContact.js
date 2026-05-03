const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  relation: {
    type: String,
    trim: true
  },

  phone: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/   // ensures valid 10-digit number
  }

}, { timestamps: true });

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);