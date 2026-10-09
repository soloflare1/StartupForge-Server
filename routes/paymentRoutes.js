const express = require('express');
const Payment = require('../models/Payment');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.get('/payments', verifyToken, async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    const totalRevenue = payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    res.json({ payments, totalRevenue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/create-checkout-session', verifyToken, async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'STRIPE_SECRET_KEY is missing in backend environment variables' });
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { email } = req.body;
    
    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { 
            name: 'StartupForge Premium Founder Package',
            description: 'Unlock unlimited opportunity posts for your startup'
          },
          unit_amount: 4900,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `http://localhost:5173/founder-dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/founder-dashboard`,
      customer_email: email || undefined,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/save-payment', verifyToken, async (req, res) => {
  try {
    const { user_email, amount, transaction_id } = req.body;
    
    const existingPayment = await Payment.findOne({ transaction_id });
    if (existingPayment) {
      return res.status(400).json({ message: 'Transaction already recorded' });
    }

    const payment = new Payment({ 
      user_email, 
      amount, 
      transaction_id, 
      payment_status: 'Completed',
      paid_at: new Date()
    });
    
    await payment.save();
    res.status(201).json({ message: 'Payment recorded successfully', payment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;