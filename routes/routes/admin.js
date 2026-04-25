const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Caregiver = require('../models/Caregiver');
const Booking = require('../models/Booking');
const SOSLog = require('../models/SosLog');
const auth = require('../middleware/auth');

router.get('/stats', auth(['admin']), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCaregivers = await Caregiver.countDocuments({ verified: true });
    const pendingVerify = await Caregiver.countDocuments({ verified: false });
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const sosCount = await SOSLog.countDocuments();
    const recentBookings = await Booking.find().populate('serviceId caregiverId').sort({ createdAt: -1 }).limit(10);

    res.json({
      users: totalUsers,
      caregivers: totalCaregivers,
      pendingVerifications: pendingVerify,
      totalBookings,
      completedBookings,
      completionRate: totalBookings > 0 ? ((completedBookings / totalBookings) * 100).toFixed(1) + '%' : '0%',
      sosTriggers: sosCount,
      recentBookings
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/caregivers/:id/verify', auth(['admin']), async (req, res) => {
  try {
    const caregiver = await Caregiver.findByIdAndUpdate(req.params.id, { verified: true }, { new: true });
    if (!caregiver) return res.status(404).json({ message: 'Caregiver not found' });
    res.json({ message: 'Caregiver verified', caregiver });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/caregivers/:id/reject', auth(['admin']), async (req, res) => {
  try {
    const caregiver = await Caregiver.findByIdAndDelete(req.params.id);
    if (!caregiver) return res.status(404).json({ message: 'Caregiver not found' });
    res.json({ message: 'Caregiver rejected' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;