const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');


/* =====================================
   GET PATIENT PROFILE BY USER ID
===================================== */

router.get('/:userId', async (req, res) => {

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
      message: "Server error loading patient"
    });

  }

});


/* =====================================
   CREATE OR UPDATE PATIENT PROFILE
===================================== */

router.post('/:userId', async (req, res) => {

  try {

    const userId = req.params.userId;

    const existingPatient = await Patient.findOne({ userId });

    if (existingPatient) {

      await Patient.updateOne(
        { userId },
        req.body
      );

      return res.json({
        success: true,
        message: "Patient profile updated"
      });

    }

    const newPatient = new Patient({
      ...req.body,
      userId
    });

    await newPatient.save();

    res.json({
      success: true,
      message: "Patient profile created"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server error saving patient"
    });

  }

});


/* =====================================
   DELETE PATIENT PROFILE
===================================== */

router.delete('/:userId', async (req, res) => {

  try {

    await Patient.deleteOne({
      userId: req.params.userId
    });

    res.json({
      success: true,
      message: "Patient deleted"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server error deleting patient"
    });

  }

});


module.exports = router;