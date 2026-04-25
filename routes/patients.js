const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const auth = require('../middleware/auth');

router.get('/', auth(['user','admin']), async (req, res) => {
  try {
    const patients = await Patient.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/', auth(['user','admin']), async (req, res) => {
  try {
    const { name, age, gender, bloodGroup, conditions, specialRequirements, address, emergencyName, emergencyPhone } = req.body;
    if (!name || !age || !address || !emergencyName || !emergencyPhone) {
      return res.status(400).json({ message: 'Required fields: name, age, address, emergency contact' });
    }
    const patient = new Patient({
      userId: req.user._id, name, age, gender, bloodGroup, conditions, specialRequirements, address, emergencyName, emergencyPhone
    });
    await patient.save();
    res.status(201).json({ message: 'Patient created', patient });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/:id', auth(['user','admin']), async (req, res) => {
  try {
    const deleted = await Patient.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Patient not found' });
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;