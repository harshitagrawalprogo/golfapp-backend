const express = require('express');
const router = express.Router();
const { createPreset, getPresets, updatePreset, deletePreset } = require('../controllers/presetController');
const auth = require('../middleware/auth');

router.post('/', auth, createPreset);
router.get('/', auth, getPresets);
router.put('/:id', auth, updatePreset);
router.delete('/:id', auth, deletePreset);

module.exports = router;
