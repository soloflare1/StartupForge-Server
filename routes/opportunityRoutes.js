const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opportunity');
const verifyToken = require('../middleware/verifyToken');

router.get('/opportunities', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || '';
    const work_type = req.query.work_type || '';

    let query = {};
    if (search) {
      query.role_title = { $regex: search, $options: 'i' };
    }
    if (work_type) {
      query.work_type = work_type;
    }

    let dbQuery = Opportunity.find(query).populate('startup_id');
    
    if (limit > 0) {
      const skip = (page - 1) * limit;
      dbQuery = dbQuery.skip(skip).limit(limit);
    }

    const opportunities = await dbQuery.exec();
    const total = await Opportunity.countDocuments(query);

    res.json({
      opportunities,
      total,
      currentPage: page,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 1
    });
  } catch (err) {
    console.error('Error fetching opportunities:', err);
    res.status(500).json({ error: 'Failed to fetch opportunities' });
  }
});

router.post('/opportunities', verifyToken, async (req, res) => {
  try {
    
    const payload = {
      ...req.body,
      commitment_level: req.body.commitment_level || 'Full-time'
    };

    const newOpportunity = new Opportunity(payload);
    const result = await newOpportunity.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;