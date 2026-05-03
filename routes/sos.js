const express = require('express');
const router = express.Router();

const SOSLog = require('../models/SosLog');
const EmergencyContact = require('../models/EmergencyContact');

const auth = require('../middleware/auth');


/* ===============================
   TRIGGER SOS ALERT
=============================== */

router.post('/trigger', auth(['user']), async (req, res) => {

  try {

    const { patientId, latitude, longitude } = req.body;

    // Load user's saved emergency contacts
    const contacts = await EmergencyContact.find({
      userId: req.user._id
    });

    const sos = new SOSLog({
      userId: req.user._id,
      patientId: patientId || undefined,
      latitude,
      longitude,
      contactsNotified: contacts.map(c => ({
        name: c.name,
        phone: c.phone,
        status: "pending"
      }))
    });

    await sos.save();

    res.json({
      message: 'SOS alert triggered successfully',
      sos
    });

  } catch (err) {

    res.status(500).json({
      message: 'Server error',
      error: err.message
    });

  }

});


/* ===============================
   ADD EMERGENCY CONTACT
=============================== */

router.post('/add-contact', auth(['user']), async (req, res) => {

  try {

    const contact = new EmergencyContact({
      userId: req.user._id,
      name: req.body.name,
      relation: req.body.relation,
      phone: req.body.phone
    });

    await contact.save();

    res.json({
      message: "Emergency contact added successfully",
      contact
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

});


/* ===============================
   GET USER CONTACTS
=============================== */

router.get('/contacts', auth(['user']), async (req, res) => {

  try {

    const contacts = await EmergencyContact.find({
      userId: req.user._id
    });

    res.json(contacts);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

});


/* ===============================
   ADMIN: VIEW SOS LOGS
=============================== */

router.get('/logs', auth(['admin']), async (req, res) => {

  try {

    const logs = await SOSLog.find()
      .populate('userId patientId')
      .sort({ triggeredAt: -1 })
      .limit(50);

    res.json(logs);

  } catch (err) {

    res.status(500).json({
      message: 'Server error',
      error: err.message
    });

  }

});


module.exports = router;