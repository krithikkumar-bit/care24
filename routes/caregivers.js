const express = require('express');
const router = express.Router();
const Caregiver = require('../models/Caregiver');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    let query = {};
    if (req.query.specialty) query.specialty = req.query.specialty;
    if (req.query.city) query.city = req.query.city;
    if (req.query.available !== undefined) query.available = req.query.available === 'true';
    const caregivers = await Caregiver.find(query).sort({ rating: -1 });
    res.json(caregivers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const cg = await Caregiver.findById(req.params.id);
    if (!cg) return res.status(404).json({ message: 'Caregiver not found' });
    res.json(cg);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;