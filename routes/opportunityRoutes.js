const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opportunity'); // Model import

router.get('/opportunities', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || '';

    let query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    let dbQuery = Opportunity.find(query);
    
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

module.exports = router;