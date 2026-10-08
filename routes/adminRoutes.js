const express = require('express');
const User = require('../models/User');
const Startup = require('../models/Startup');
const Payment = require('../models/Payment');
const Opportunity = require('../models/Opportunity');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');
const router = express.Router();

// Admin Statistics 
router.get('/admin/stats', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStartups = await Startup.countDocuments();
    const totalOpportunities = await Opportunity.countDocuments();
    const payments = await Payment.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
    ]);
    const totalRevenue = payments[0]?.totalRevenue || 0;

    res.json({ totalUsers, totalStartups, totalOpportunities, totalRevenue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Manage Users - Block/Unblock
router.patch('/admin/users/:id/block', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { isBlocked } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { isBlocked }, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Manage Startups - Approve/Remove
router.patch('/admin/startups/:id/status', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;     // 'Approved' or 'Rejected'
    const updatedStartup = await Startup.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updatedStartup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// View All Transactions
router.get('/admin/transactions', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const transactions = await Payment.find().sort({ paid_at: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;