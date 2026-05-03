const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");


/* =====================================
   GET PATIENT PROFILE BY USER ID
===================================== */

router.get("/:userId", async (req, res) => {

  try {

    const userId = String(req.params.userId).trim();

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID required"
      });
    }

    const patient = await Patient.findOne({ userId });

    console.log("Fetching patient for userId:", userId);
    console.log("Patient found:", patient);

    return res.json(patient || null);

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

    const userId = String(req.params.userId).trim();

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID missing"
      });
    }

    const {
      name,
      age,
      gender,
      phone,                // ✅ ADDED
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
      return res.status(400).json({
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
        phone: phone || "",                 // ✅ ADDED
        bloodGroup: bloodGroup || "",
        conditions: conditions || "",
        specialRequirements: specialRequirements || "",
        address,
        emergencyName,
        emergencyPhone
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    console.log("Patient saved/updated for userId:", userId);

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

    const userId = String(req.params.userId).trim();

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID required"
      });
    }

    await Patient.deleteOne({ userId });

    console.log("Patient deleted for userId:", userId);

    res.json({
      success: true,
      message: "Patient deleted successfully"
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