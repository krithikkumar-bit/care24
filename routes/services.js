const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

router.get('/', async (req, res) => {
  try {
    const services = await Service.find({});
    console.log("SERVICES:", services); // debug log
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;