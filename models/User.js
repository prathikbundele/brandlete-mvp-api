const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const metricSchema = new mongoose.Schema({
  name: { type: String, required: false },
  value: { type: Number, required: false }
});

const athleticSchema = new mongoose.Schema({
  sport: { type: String, required: false },
  position: { type: String, required: false },
  metrics: [metricSchema] 
});

const academicSchema = new mongoose.Schema({
  gpa: { type: Number, required: false },
  testScore: { type: Number, required: false },
  scoreCategory: { type: String, required: false },
});

const socialSchema = new mongoose.Schema({
  socialHandle: {type: String, required: false },
  followers: { type: Number, required: false },
  engagement: { type: Number, required: false },
  average_likes: {type: Number, required: false },
  total_posts: {type: Number, required: false}
});

// Define User schema
const userSchema = mongoose.Schema({
  about : {
    type : String,
    required : false
  },
  profilePicture: {
    type: String,
    default: '',
  },
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
    required: false,
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
  academicDetails: academicSchema, 
  athleticDetails: athleticSchema, 
  socialDetails: socialSchema,
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  // const decodedPassword = CryptoJS.enc.Base64.parse(this.password).toString(CryptoJS.enc.Utf8);
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
