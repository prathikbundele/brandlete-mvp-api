const express = require('express');
const { getUniversityList } = require('../controllers/commonController');

const router = express.Router();

router.get('/getUniversityList', getUniversityList);

module.exports = router;
