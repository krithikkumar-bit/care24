const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  caregiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Caregiver', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  durationType: { type: String, enum: ['hourly','daily','weekly','monthly'], required: true },
  status: { type: String, enum: ['pending','accepted','active','completed','cancelled'], default: 'pending' },
  cost: { type: Number, required: true },
  careNotes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Booking', bookingSchema);