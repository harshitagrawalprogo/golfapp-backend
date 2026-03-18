const express = require('express');
const router = express.Router();
const { createSession, getSessions, getSession } = require('../controllers/sessionController');
const auth = require('../middleware/auth');

router.post('/', auth, createSession);
router.get('/', auth, getSessions);
router.get('/:id', auth, getSession);

module.exports = router;
