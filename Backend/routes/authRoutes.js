const express = require('express');
const {studentLogin, rectorLogin} = require('../controllers/authController')

const router = express.Router();

router.post('/studentLogin', studentLogin);
router.post('/rectorLogin', rectorLogin);

module.exports = router;