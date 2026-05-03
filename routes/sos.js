const express = require("express");
const router = express.Router();
const EmergencyContact = require("../models/EmergencyContact");

router.get("/contacts", async (req,res)=>{

  try{

    const contacts = await EmergencyContact.find();

    res.json(contacts);

  }
  catch(err){

    res.status(500).json({
      error: err.message
    });

  }

});

module.exports = router;