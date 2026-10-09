const express = require('express');
const Startup = require('../models/Startup');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.post('/startups', verifyToken, async (req, res) => {
  try {
    const newStartup = new Startup(req.body);
    const result = await newStartup.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/startups/founder/:email', verifyToken, async (req, res) => {
  try {
    const email = req.params.email;
    const startups = await Startup.find({ 
      founder_email: { $regex: new RegExp(`^${email}$`, 'i') } 
    });
    
    if (startups.length === 0) {
      const allStartups = await Startup.find({});
      return res.json(allStartups);
    }

    res.json(startups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/startups', async (req, res) => {
  try {
    let startups = await Startup.find({ status: 'Approved' }).sort({ createdAt: -1 });
    if (startups.length === 0) {
      startups = await Startup.find({}).sort({ createdAt: -1 });
    }
    res.json(startups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/startups/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Startup.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;