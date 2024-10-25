const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3000;


// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/BrandleteSampleDB')
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Define a schema for the User collection
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  email: String,
  password: String,
  instagram : String,
  college : String,
  sport : String,
});

// Create a User model based on the schema
const User = mongoose.model('User', userSchema);


app.use(express.json())
app.use(cors())

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    jwt.verify(token, 'secret', (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      req.user = decoded;
      next();
    });
  };
  
  // Route to register a new user
  app.post('/api/register', async (req, res) => {
    try {
      // Check if the email already exists
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
      // Create a new user
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        instagram: req.body.instagram,
        college: req.body.college,
        sport: req.body.sport
      });
      
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Route to authenticate and log in a user
  app.post('/api/login', async (req, res) => {
    try {
      // Check if the email exists
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Compare passwords
      const passwordMatch = await bcrypt.compare(req.body.password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ email: user.email }, 'secret');
      res.status(200).json({ token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
       });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Protected route to get user details
  app.get('/api/user', async (req, res) => {

    console.log("query email : ", req.query)
    try {
      // Fetch user details using decoded token
      const user = await User.findOne({ email: req.query.email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

app.get('/', (req,res) => {
    res.status(200).json({message : "new response from server"})
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });