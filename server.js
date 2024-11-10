const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const commonRoutes = require('./routes/common');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware to parse incoming JSON
app.use(express.json());
app.use(cors())

// Routes
app.use('/auth', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', commonRoutes)

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
