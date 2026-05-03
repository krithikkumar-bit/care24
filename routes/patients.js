const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");


/* =====================================
   GET PATIENT PROFILE BY USER ID
===================================== */

router.get("/:userId", async (req, res) => {

  try {

    const patient = await Patient.findOne({
      userId: req.params.userId
    });

    if (!patient) {
      return res.json(null);
    }

    res.json(patient);

  } catch (err) {

    console.error("Patient fetch error:", err);

    res.status(500).json({
      success: false,
      message: "Server error loading patient"
    });

  }

});


/* =====================================
   CREATE OR UPDATE PATIENT PROFILE
===================================== */

router.post("/:userId", async (req, res) => {

  try {

    const userId = req.params.userId;

    const {
      name,
      age,
      gender,
      bloodGroup,
      conditions,
      specialRequirements,
      address,
      emergencyName,
      emergencyPhone
    } = req.body;

    if (
      !name ||
      !age ||
      !gender ||
      !address ||
      !emergencyName ||
      !emergencyPhone
    ) {
      return res.json({
        success: false,
        message: "Missing required fields"
      });
    }

    const patient = await Patient.findOneAndUpdate(
      { userId },
      {
        userId,
        name,
        age,
        gender,
        bloodGroup,
        conditions,
        specialRequirements,
        address,
        emergencyName,
        emergencyPhone
      },
      {
        new: true,
        upsert: true
      }
    );

    res.json({
      success: true,
      patient
    });

  } catch (err) {

    console.error("Patient save error:", err);

    res.status(500).json({
      success: false,
      message: "Server error saving patient"
    });

  }

});


/* =====================================
   DELETE PATIENT PROFILE
===================================== */

router.delete("/:userId", async (req, res) => {

  try {

    await Patient.deleteOne({
      userId: req.params.userId
    });

    res.json({
      success: true,
      message: "Patient deleted"
    });

  } catch (err) {

    console.error("Patient delete error:", err);

    res.status(500).json({
      success: false,
      message: "Server error deleting patient"
    });

  }

});


module.exports = router;