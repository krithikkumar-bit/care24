const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

router.get('/', auth(['user','caregiver','admin']), async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'user') query.userId = req.user._id;
    if (req.user.role === 'caregiver') query.caregiverId = req.user._id;
    const bookings = await Booking.find(query).populate('patientId serviceId caregiverId').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/', auth(['user']), async (req, res) => {
  try {
    const { patientId, serviceId, caregiverId, date, time, durationType } = req.body;
    if (!patientId || !serviceId || !caregiverId || !date || !durationType) {
      return res.status(400).json({ message: 'All fields required' });
    }
    const Service = require('../models/Service');
    const service = await Service.findById(serviceId);
    const costs = { hourly: service.price * 4, daily: service.price * 10, weekly: service.price * 70, monthly: service.price * 300 };
    const booking = new Booking({
      userId: req.user._id, patientId, serviceId, caregiverId,
      date, time, durationType, cost: costs[durationType] || 0, status: 'pending'
    });
    await booking.save();
    res.status(201).json({ message: 'Booking created', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:id/status', auth(['caregiver']), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted','active','completed','cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Status updated', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;