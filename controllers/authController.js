const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_KEY = 'your_secret_key'; // Move to config if necessary

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
};

// User Registration
exports.register = async (req, res) => {
  const { firstName, lastName, email, username, password, college, instagram, sport } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ firstName, lastName, email, username, password, college, instagram, sport });
    await user.save();

    const token = generateToken(user);
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// User Login
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = generateToken(user);
    res.status(200).json({ token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
     });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};
