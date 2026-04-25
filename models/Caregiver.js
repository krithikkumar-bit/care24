const mongoose = require('mongoose');

const caregiverSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  photo: { type: String, default: 'nurse1face' },
  specialty: { 
    type: String, 
    enum: ['Nursing','Elderly Care','Physiotherapy','Post-Hospital','Dementia Care','Palliative Care'], 
    required: true 
  },
  qualification: { type: String, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: { type: Number, default: 0 },
  experience: { type: Number, required: true },
  city: { type: String, required: true },
  hourlyRate: { type: Number, required: true },
  about: { type: String, required: true },
  languages: { type: String, default: 'Hindi, English' },
  verified: { type: Boolean, default: false },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Caregiver', caregiverSchema);