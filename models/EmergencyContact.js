const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  name: {
    type: String,
    required: true
  },

  relation: String,

  phone: {
    type: String,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);