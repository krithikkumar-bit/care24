const mongoose = require("mongoose");

const emergencyContactSchema = new mongoose.Schema({

  userId: String,
  name: String,
  relation: String,
  phone: String

});

module.exports = mongoose.model(
  "EmergencyContact",
  emergencyContactSchema
);