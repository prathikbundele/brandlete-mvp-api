const express = require('express');
const { updateProfile, updateUserDetails, getUserDetails,  savePersonalDetails,
    saveAthleticDetails,
    saveAcademicDetails } = require('../controllers/profileController');
const verifyToken = require('../middleware/authMiddleware'); // Middleware for JWT verification

const router = express.Router();

// Update Profile Route
router.put('/profile', verifyToken, updateProfile);
router.put('/profile/personal', verifyToken, savePersonalDetails);
router.put('/profile/athletic', verifyToken, saveAthleticDetails);
router.put('/profile/academic', verifyToken, saveAcademicDetails);

//Update User Details Route
router.put('/user', verifyToken, updateUserDetails);

// Get User Details Route
router.get('/user', verifyToken, getUserDetails);

module.exports = router;
