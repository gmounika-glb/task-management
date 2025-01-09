const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Signup user
exports.signup = async (req, res) => {
  try {
    const {username, email, password} = req.body;
    const user = new User({username, email, password});
    await user.save();
    res.status(201).json({message: 'User registered successfully!'});
  } catch (err) {
    res.status(400).json({error: err.message});
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) return res.status(404).json({error: 'User not found!'});

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({error: 'Invalid credentials!'});

    // Generate JWT token
    const token = jwt.sign({id: user._id}, 'secretkey', {expiresIn: '1h'});
    res.json({message: 'Login successful!', token});
  } catch (err) {
    res.status(400).json({error: err.message});
  }
};
