const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  duration: String,
  icon: String,
  description: String
}, { collection: 'services' }); // force correct collection

module.exports = mongoose.model('Service', serviceSchema);