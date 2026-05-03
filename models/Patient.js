const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");

/*
========================================
ADD OR UPDATE PATIENT PROFILE
POST /api/patient/add
========================================
*/

router.post("/add", async (req, res) => {

  try {

    const {
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
    } = req.body;

    if (
      !userId ||
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

    /* UPDATE IF PROFILE EXISTS */

    const patient = await Patient.findOneAndUpdate(
      { userId },
      {
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

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server error while saving patient"
    });

  }

});


/*
========================================
GET PATIENT PROFILE
GET /api/patient/:userId
========================================
*/

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

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server error while fetching patient"
    });

  }

});


module.exports = router;