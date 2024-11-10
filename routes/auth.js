const express = require('express');
const { register, login, social, authCallback, instagramAuth } = require('../controllers/authController');

const router = express.Router();

// Register Route
router.post('/register', register);

// Login Route
router.post('/login', login);

router.get('/social', instagramAuth);
router.get('/callback', authCallback);

router.get('/instagram', instagramAuth)

module.exports = router;
