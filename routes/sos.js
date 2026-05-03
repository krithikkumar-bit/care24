const express = require("express");
const router = express.Router();

const EmergencyContact = require("../models/EmergencyContact");
const SosLog = require("../models/SosLog");


/*
========================================
GET CONTACTS FOR LOGGED-IN USER
========================================
*/

router.get("/contacts/:userId", async (req, res) => {
  try {

    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID required"
      });
    }

    const contacts = await EmergencyContact.find({ userId });

    res.json(contacts);

  } catch (err) {

    console.error("Load contacts error:", err);

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
});


/*
========================================
ADD NEW EMERGENCY CONTACT
========================================
*/

router.post("/add-contact", async (req, res) => {
  try {

    const { userId, name, relation, phone } = req.body;

    if (!userId || !name || !relation || !phone) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const newContact = new EmergencyContact({
      userId,
      name,
      relation,
      phone
    });

    await newContact.save();

    res.json({
      success: true,
      message: "Contact added successfully",
      contact: newContact
    });

  } catch (err) {

    console.error("Add contact error:", err);

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
});


/*
========================================
DELETE CONTACT (OPTIONAL BUT USEFUL)
========================================
*/

router.delete("/delete-contact/:id", async (req, res) => {
  try {

    await EmergencyContact.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Contact deleted"
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
});


/*
========================================
TRIGGER SOS ALERT
========================================
*/

router.post("/trigger", async (req, res) => {
  try {

    const { userId, latitude, longitude } = req.body;

    if (!userId || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Missing location data"
      });
    }

    const contacts = await EmergencyContact.find({ userId });

    const contactsNotified = contacts.map(contact => ({
      name: contact.name,
      phone: contact.phone,
      status: "notified"
    }));

    const sosEntry = new SosLog({
      userId,
      latitude,
      longitude,
      contactsNotified
    });

    await sosEntry.save();

    res.json({
      success: true,
      message: "SOS alert triggered successfully",
      contactsNotified
    });

  } catch (err) {

    console.error("SOS trigger error:", err);

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
});


module.exports = router;