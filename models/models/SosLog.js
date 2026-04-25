const mongoose = require('mongoose');

const sosLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  latitude: { type: Number },
  longitude: { type: Number },
  contactsNotified: [{ name: String, phone: String, status: String }],
  triggeredAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('SosLog', sosLogSchema);