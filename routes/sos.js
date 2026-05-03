const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const SOSLog = require("../models/SosLog");
const EmergencyContact = require("../models/EmergencyContact");


/* ===============================
   TRIGGER SOS ALERT
=============================== */

router.post("/trigger", async (req, res) => {
  try {

    const { userId, patientId, latitude, longitude } = req.body;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid userId"
      });
    }

    // Load emergency contacts
    const contacts = await EmergencyContact.find({ userId });

    const sos = new SOSLog({
      userId,
      patientId: mongoose.Types.ObjectId.isValid(patientId)
        ? patientId
        : undefined,
      latitude,
      longitude,
      contactsNotified: contacts.map(contact => ({
        name: contact.name,
        phone: contact.phone,
        status: "pending"
      }))
    });

    await sos.save();

    res.json({
      message: "SOS alert triggered successfully",
      sos
    });

  } catch (err) {

    console.error("SOS trigger error:", err.message);

    res.status(500).json({
      message: "Failed to trigger SOS alert"
    });

  }
});


/* ===============================
   ADD EMERGENCY CONTACT
=============================== */

router.post('/add-contact', async (req, res) => {

  try {

    let { userId, name, relation, phone } = req.body;

    if (!userId || !name || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // allow both MongoDB _id AND website id
    userId = String(userId);

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
   GET CONTACTS BY USER ID
=============================== */

router.get("/contacts/:userId", async (req, res) => {

  try {

    const { userId } = req.params;

    // Prevent crash if invalid ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.json([]);
    }

    const contacts = await EmergencyContact.find({ userId });

    res.json(contacts);

  } catch (err) {

    console.error("Fetch contacts error:", err.message);

    res.status(500).json({
      message: "Failed to fetch emergency contacts"
    });

  }

});


/* ===============================
   ADMIN: VIEW SOS LOGS
=============================== */

router.get("/logs", async (req, res) => {

  try {

    const logs = await SOSLog.find()
      .sort({ triggeredAt: -1 })
      .limit(50);

    res.json(logs);

  } catch (err) {

    console.error("Fetch logs error:", err.message);

    res.status(500).json({
      message: "Failed to fetch SOS logs"
    });

  }

});


module.exports = router;