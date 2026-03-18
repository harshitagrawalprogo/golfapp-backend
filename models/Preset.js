const mongoose = require('mongoose');

const presetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true, maxlength: 50 },
  label: { type: String, enum: ['advanced', 'beginner', 'rehab', 'custom'], default: 'custom' },
  description: { type: String, maxlength: 200 },
  configId: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainingConfig' },
  isActive: { type: Boolean, default: false },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Preset', presetSchema);
