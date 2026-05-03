const express = require('express');
const router = express.Router();

const SOSLog = require('../models/SosLog');
const EmergencyContact = require('../models/EmergencyContact');


/* ===============================
   TRIGGER SOS ALERT
=============================== */

router.post('/trigger', async (req, res) => {

  try {

    const { userId, patientId, latitude, longitude } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required"
      });
    }

    // Load user's saved emergency contacts
    const contacts = await EmergencyContact.find({
      userId: userId
    });

    const sos = new SOSLog({
      userId: userId,
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

router.post('/add-contact', async (req, res) => {

  try {

    const { userId, name, relation, phone } = req.body;

    if (!userId || !name || !phone) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const contact = new EmergencyContact({
      userId,
      name,
      relation,
      phone
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

router.get('/contacts/:userId', async (req, res) => {

  try {

    const contacts = await EmergencyContact.find({
      userId: req.params.userId
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

router.get('/logs', async (req, res) => {

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