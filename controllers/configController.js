const TrainingConfig = require('../models/TrainingConfig');
const { z } = require('zod');

const vibrationSchema = z.object({
  type: z.enum(['pulse', 'double', 'ramp', 'continuous']).default('pulse'),
  intensity: z.number().min(0).max(100).default(70),
  duration: z.number().min(10).max(1000).default(150),
  frequency: z.number().min(0).max(500).optional(),
});

const phaseSchema = z.object({
  name: z.enum(['backswing', 'top', 'downswing', 'impact', 'followThrough']),
  duration: z.number().min(0),
  vibration: vibrationSchema.optional(),
});

const configSchema = z.object({
  ratio: z.number().min(2).max(4).default(3.1),
  totalTime: z.number().min(0.8).max(2.0).default(1.2),
  phases: z.array(phaseSchema).default([]),
  mode: z.enum(['realtime', 'device_run']).default('realtime'),
});

exports.createConfig = async (req, res, next) => {
  try {
    const data = configSchema.parse(req.body);
    const config = await TrainingConfig.create({ ...data, userId: req.user.userId });
    res.status(201).json({ config });
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
    next(err);
  }
};

exports.getConfig = async (req, res, next) => {
  try {
    const config = await TrainingConfig.findOne({ userId: req.user.userId })
      .sort({ updatedAt: -1 });
    if (!config) return res.status(404).json({ error: 'No config found' });
    res.json({ config });
  } catch (err) {
    next(err);
  }
};

exports.getAllConfigs = async (req, res, next) => {
  try {
    const configs = await TrainingConfig.find({ userId: req.user.userId }).sort({ updatedAt: -1 });
    res.json({ configs });
  } catch (err) {
    next(err);
  }
};

exports.updateConfig = async (req, res, next) => {
  try {
    const data = configSchema.partial().parse(req.body);
    const config = await TrainingConfig.findOneAndUpdate(
      { userId: req.user.userId },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ config });
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
    next(err);
  }
};
