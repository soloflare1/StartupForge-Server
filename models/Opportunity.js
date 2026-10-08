const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  startup_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
  role_title: { type: String, required: true },
  required_skills: [{ type: String, required: true }],
  work_type: { type: String, enum: ['Remote', 'On-site', 'Hybrid'], required: true },
  commitment_level: { type: String, enum: ['Full-time', 'Part-time', 'Contract'], required: true },
  deadline: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Opportunity', opportunitySchema);