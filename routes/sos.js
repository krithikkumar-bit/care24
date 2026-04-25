const express = require('express');
const router = express.Router();
const SOSLog = require('../models/SosLog');
const auth = require('../middleware/auth');

router.post('/trigger', auth(['user']), async (req, res) => {
  try {
    const { patientId, latitude, longitude } = req.body;
    const sos = new SOSLog({
      userId: req.user._id, patientId: patientId || undefined,
      latitude, longitude,
      contactsNotified: []
    });
    await sos.save();
    res.json({ message: 'SOS alert triggered', sos });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/logs', auth(['admin']), async (req, res) => {
  try {
    const logs = await SOSLog.find().populate('userId patientId').sort({ triggeredAt: -1 }).limit(50);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;