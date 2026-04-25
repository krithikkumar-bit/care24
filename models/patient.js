const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true, min: 1, max: 120 },
  gender: { type: String, enum: ['Male','Female','Other'], required: true },
  bloodGroup: { type: String },
  conditions: { type: String },
  specialRequirements: { type: String },
  address: { type: String, required: true },
  emergencyName: { type: String, required: true },
  emergencyPhone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Patient', patientSchema);