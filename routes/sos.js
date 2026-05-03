const express = require("express");
const router = express.Router();

const EmergencyContact = require("../models/EmergencyContact");


/* GET CONTACTS OF LOGGED-IN USER */

router.get("/contacts/:userId", async (req, res) => {

  try {

    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const contacts = await EmergencyContact.find({ userId });

    res.json({
      success: true,
      contacts
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }

});


/* ADD CONTACT FOR LOGGED-IN USER */

router.post("/add-contact", async (req, res) => {

  try {

    const { userId, name, relation, phone } = req.body;

    if (!userId || !name || !phone) {
      return res.status(400).json({
        success: false,
        message: "userId, name and phone are required"
      });
    }

    const contact = await EmergencyContact.create({
      userId,
      name,
      relation,
      phone
    });

    res.json({
      success: true,
      message: "Emergency contact added successfully",
      contact
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }

});


module.exports = router;