const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');

const SECRET_KEY = 'your_secret_key'; 

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
};

exports.register = async (req, res) => {
  const { firstName, lastName, email, username, password, college, instagram, sport } = req.body;
  const decodedPassword = CryptoJS.enc.Base64.parse(password).toString(CryptoJS.enc.Utf8);
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ firstName, lastName, email, username, password : decodedPassword, college, instagram, sport });
    await user.save();

    const token = generateToken(user);
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const decodedPassword = CryptoJS.enc.Base64.parse(password).toString(CryptoJS.enc.Utf8);

  try {
    const user = await User.findOne({ username : username });
    if (!user) return res.status(400).json({ message: 'User not found with ', username });
    const isMatch = await user.matchPassword(decodedPassword);
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

exports.social = async (req, res) => {
  const platform = req.query.platform; 
  const authUrl = `https://api.sandbox.getphyllo.com/oauth/authorize?client_id=${process.env.PHYLLO_CLIENT_ID}&redirect_uri=${process.env.PHYLLO_REDIRECT_URI}&scope=user_profile,user_media&response_type=code&platform=twitter`;
  res.redirect(authUrl);
};

exports.authCallback = async (req, res) => {
  const authorizationCode = req.query.code;

  try {
    const tokenResponse = await axios.post(
      'https://api.sandbox.getphyllo.com/oauth/token',
      {
        client_id: process.env.PHYLLO_CLIENT_ID,
        client_secret: process.env.PHYLLO_CLIENT_SECRET,
        code: authorizationCode,
        grant_type: 'authorization_code',
        redirect_uri: process.env.PHYLLO_REDIRECT_URI,
      }
    );

    const accessToken = tokenResponse.data.access_token;
    res.redirect(`http://localhost:3001/profile?token=${accessToken}`);
  } catch (error) {
    console.error("Error during token exchange:", error);
    res.status(500).send('Authentication failed');
  }
}

exports.instagramAuth = async (req, res) => {
  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${process.env.META_CLIENT_ID}&redirect_uri=${process.env.META_REDIRECT_URL}&scope=user_profile,user_media&response_type=code`;
  res.redirect(authUrl);
}
