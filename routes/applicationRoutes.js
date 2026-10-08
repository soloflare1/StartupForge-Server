const express = require('express');
const Application = require('../models/Application');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

// Apply to Opportunity
router.post('/applications', verifyToken, async (req, res) => {
  try {
    const application = new Application(req.body);
    const result = await application.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Applications by Collaborator Email
router.get('/applications/collaborator/:email', verifyToken, async (req, res) => {
  try {
    const applications = await Application.find({ applicant_email: req.params.email })
      .populate({
        path: 'opportunity_id',
        populate: { path: 'startup_id' }
      });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Application Status - Accept/Reject by Founder
router.patch('/applications/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;