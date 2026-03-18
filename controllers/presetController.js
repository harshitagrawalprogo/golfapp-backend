const Preset = require('../models/Preset');
const { z } = require('zod');

const presetSchema = z.object({
  name: z.string().min(1).max(50),
  label: z.enum(['advanced', 'beginner', 'rehab', 'custom']).default('custom'),
  description: z.string().max(200).optional(),
  configId: z.string().optional(),
  isActive: z.boolean().optional(),
});

exports.createPreset = async (req, res, next) => {
  try {
    const data = presetSchema.parse(req.body);
    // Deactivate others if this is being set active
    if (data.isActive) {
      await Preset.updateMany({ userId: req.user.userId }, { isActive: false });
    }
    const preset = await Preset.create({ ...data, userId: req.user.userId });
    res.status(201).json({ preset });
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
    next(err);
  }
};

exports.getPresets = async (req, res, next) => {
  try {
    const presets = await Preset.find({ userId: req.user.userId })
      .populate('configId')
      .sort({ createdAt: -1 });
    res.json({ presets });
  } catch (err) {
    next(err);
  }
};

exports.updatePreset = async (req, res, next) => {
  try {
    const data = presetSchema.partial().parse(req.body);
    if (data.isActive) {
      await Preset.updateMany({ userId: req.user.userId }, { isActive: false });
    }
    const preset = await Preset.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $set: data },
      { new: true }
    );
    if (!preset) return res.status(404).json({ error: 'Preset not found' });
    res.json({ preset });
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
    next(err);
  }
};

exports.deletePreset = async (req, res, next) => {
  try {
    const preset = await Preset.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!preset) return res.status(404).json({ error: 'Preset not found' });
    res.json({ message: 'Preset deleted' });
  } catch (err) {
    next(err);
  }
};
