const express = require('express');
const router = express.Router();
const { createConfig, getConfig, getAllConfigs, updateConfig } = require('../controllers/configController');
const auth = require('../middleware/auth');

router.post('/', auth, createConfig);
router.get('/', auth, getConfig);
router.get('/all', auth, getAllConfigs);
router.put('/', auth, updateConfig);

module.exports = router;
