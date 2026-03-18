const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  configId: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainingConfig' },
  presetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Preset' },
  duration: { type: Number, default: 0 }, // seconds
  swingCount: { type: Number, default: 0 },
  metrics: {
    consistency: { type: Number, min: 0, max: 100, default: 0 }, // percentage
    avgRatio: { type: Number },
    avgBackswingTime: { type: Number },
    avgDownswingTime: { type: Number },
    clubSpeed: { type: Number },
    smashFactor: { type: Number },
    attackAngle: { type: Number },
    carryDistance: { type: Number },
  },
  deviceId: { type: String },
  notes: { type: String, maxlength: 500 },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Session', sessionSchema);
