const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, image } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const lowerEmail = email.toLowerCase().trim();

    let userRole = role || 'Collaborator';
    if (lowerEmail.includes('admin')) {
      userRole = 'Admin';
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let existingUser = await User.findOne({ email: lowerEmail });
    if (existingUser) {
      if (!existingUser.password) {
        existingUser.name = name;
        existingUser.password = hashedPassword;
        existingUser.role = userRole;
        existingUser.image = image || '';
        await existingUser.save();
        return res.status(200).json({ success: true, message: 'Account fixed and registered successfully' });
      }
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const newUser = new User({
      name,
      email: lowerEmail,
      password: hashedPassword,
      role: userRole,
      image: image || ''
    });

    await newUser.save();
    res.status(201).json({ success: true, message: 'User registered successfully with role: ' + userRole });
  } catch (err) {
    console.error('Registration server error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

router.post('/jwt', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const lowerEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: lowerEmail });
    if (!user) {
      return res.status(400).json({ message: 'User not found with this email.' });
    }
    if (!user.password) {
      return res.status(400).json({ message: 'Password not set for this account. Please re-register.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }

    const payload = {
      email: user.email,
      role: user.role,
      name: user.name
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    }).json({ 
      success: true, 
      role: user.role, 
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        skills: user.skills,
        bio: user.bio
      },
      message: 'Logged in successfully' 
    });
  } catch (error) {
    console.error('Login server error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/users/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { $set: req.body },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/logout', (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    }).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;