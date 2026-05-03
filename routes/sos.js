const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

/* Emergency Contact Schema */

const EmergencyContact = mongoose.model(
  "EmergencyContact",
  new mongoose.Schema({
    name: String,
    relation: String,
    phone: String
  })
);

/* GET CONTACTS */

router.get("/contacts", async (req, res) => {

  try {

    const contacts = await EmergencyContact.find();

    res.json(contacts);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

/* ADD CONTACT */

router.post("/add-contact", async (req, res) => {

  try {

    const contact = new EmergencyContact(req.body);

    await contact.save();

    res.json({ success: true });

  } catch (err) {

    res.status(500).json({
      success: false
    });

  }

});

module.exports = router;