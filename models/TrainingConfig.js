const mongoose = require('mongoose');

const vibrationSchema = new mongoose.Schema({
  type: { type: String, enum: ['pulse', 'double', 'ramp', 'continuous'], default: 'pulse' },
  intensity: { type: Number, min: 0, max: 100, default: 70 },
  duration: { type: Number, min: 10, max: 1000, default: 150 }, // ms
  frequency: { type: Number, min: 0, max: 500 }, // Hz, optional
}, { _id: false });

const phaseSchema = new mongoose.Schema({
  name: { type: String, enum: ['backswing', 'top', 'downswing', 'impact', 'followThrough'], required: true },
  duration: { type: Number, required: true, min: 0 }, // seconds
  vibration: vibrationSchema,
}, { _id: false });

const trainingConfigSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ratio: { type: Number, min: 2, max: 4, default: 3.1 }, // backswing:downswing ratio
  totalTime: { type: Number, min: 0.8, max: 2.0, default: 1.2 }, // seconds
  phases: { type: [phaseSchema], default: [] },
  mode: { type: String, enum: ['realtime', 'device_run'], default: 'realtime' },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});

module.exports = mongoose.model('TrainingConfig', trainingConfigSchema);
