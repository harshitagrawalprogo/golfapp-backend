const express = require('express');
const router = express.Router();
const { signup, login, refresh, logout } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', auth, logout);

module.exports = router;
