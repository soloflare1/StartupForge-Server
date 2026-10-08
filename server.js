const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', process.env.CLIENT_URL || 'http://localhost:3000'],
  credentials: true
}));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/startupRoutes'));
app.use('/api', require('./routes/opportunityRoutes'));
app.use('/api', require('./routes/applicationRoutes'));
app.use('/api', require('./routes/paymentRoutes'));
app.use('/api', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
  res.send('StartupForge Server is Running Smoothly');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

