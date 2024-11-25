const express = require('express');
const { updateProfile, updateUserDetails, getUserDetails, uploadProfilePicture, getUserProfilePicture,
    getRefreshedBasicSocialDetails, getRefreshedPublicProfileAnalytics} = require('../controllers/profileController');
const path = require('path');
const verifyToken = require('../middleware/authMiddleware'); // Middleware for JWT verification
const multer =  require('multer');
const router = express.Router();

// Configure Multer storage for uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage });

// Update Profile Route
router.put('/profile', verifyToken, updateProfile);

//Update User Details Route
router.put('/user', verifyToken, updateUserDetails);

// Get User Details Route
router.get('/user', verifyToken, getUserDetails);

// Route to upload profile picture
router.post('user/:id/uploadProfilePicture', upload.single('profilePicture'), uploadProfilePicture);

// Route to get user profile picture
router.get('user/:id/profilePicture', getUserProfilePicture);

//Route to get Basic Instagram Details
router.get('/social/profile', getRefreshedBasicSocialDetails);

//Route to get Profile Analytics
router.get('/social/analytics', getRefreshedPublicProfileAnalytics);


module.exports = router;
