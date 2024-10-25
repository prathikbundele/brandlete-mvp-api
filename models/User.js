const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define Game Metrics as Key-Value Pairs for Dynamic Fields
const metricSchema = new mongoose.Schema({
  name: { type: String, required: false }, // Name of the metric (e.g., "Points", "Assists")
  value: { type: Number, required: false } // Value for the metric (e.g., 25, 7, etc.)
});

// Define the Athletic Details Schema for each sport
const athleticSchema = new mongoose.Schema({
  sport: { type: String, required: false }, // Sport the athlete plays (e.g., "Basketball", "Soccer")
  position: { type: String, required: false }, // Athlete's position (e.g., "Striker", "Goalkeeper")
  metrics: [metricSchema] // Array of key-value pairs for metrics
});

// Define the Academic Details Schema
const academicSchema = new mongoose.Schema({
  gpa: { type: Number, required: false }, // GPA (e.g., 3.8)
  testScore: { type: Number, required: false }, // Test score (e.g., SAT score)
  scoreCategory: { type: String, required: false }, // Test type (e.g., SAT, ACT)
});

// Define the Academic Details Schema
const socialSchema = new mongoose.Schema({
  followers: { type: Number, required: false }, // GPA (e.g., 3.8)
  engagement: { type: Number, required: false }, // Test score (e.g., SAT score)
});

// Define User schema
const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dob : {
    type : Date,
    required : false
  },
  college: {
    type: String,
    required: true,
  },
  gradYear : {
    type : Number,
    required : false,
  },
  sport: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  },
  instagram: {
    type: String,
    required: true,
  },
  hometown : {
    type : String,
  },
  score: {
    type: Number,
    default: 0,
  },
  height: { type: Number, required: false },
  weight: { type: Number, required: false },
  description: { type: String, required: false },
  location: { type: String, required: false },
  academicDetails: academicSchema, // Embed academic details
  athleticDetails: athleticSchema, // Array of athletic details (multiple sports supported)
  socialDetails: socialSchema,
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
