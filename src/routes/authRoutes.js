const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');


// Naye routes
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

module.exports = router;