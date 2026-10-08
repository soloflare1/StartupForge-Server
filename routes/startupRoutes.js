const express = require('express');
const Startup = require('../models/Startup');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

//  Startup Create
router.post('/startups', verifyToken, async (req, res) => {
  try {
    const newStartup = new Startup(req.body);
    const result = await newStartup.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Startup by Founder Email
router.get('/startups/founder/:email', verifyToken, async (req, res) => {
  try {
    const startup = await Startup.findOne({ founder_email: req.params.email });
    res.json(startup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Approved Startups 
router.get('/startups', async (req, res) => {
  try {
    const startups = await Startup.find({ status: 'Approved' }).sort({ createdAt: -1 });
    res.json(startups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Startup
router.put('/startups/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Startup.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;