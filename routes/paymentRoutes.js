const express = require('express');
const Payment = require('../models/Payment');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

// Create Stripe Checkout Session for Premium Founder Package
router.post('/create-checkout-session', verifyToken, async (req, res) => {
  try {
    // Initialize stripe dynamically inside the route
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { email } = req.body;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { 
            name: 'StartupForge Premium Founder Package',
            description: 'Unlock unlimited opportunity posts for your startup'
          },
          unit_amount: 4900, // $49.00 USD
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/dashboard/founder/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard/founder/overview`,
      customer_email: email,
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save Successful Payment Transaction Record
router.post('/save-payment', verifyToken, async (req, res) => {
  try {
    const { user_email, amount, transaction_id } = req.body;
    
    // Check if transaction already exists to avoid duplicates
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