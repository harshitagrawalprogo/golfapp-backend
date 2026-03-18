const Session = require('../models/Session');
const { z } = require('zod');

const sessionSchema = z.object({
  configId: z.string().optional(),
  presetId: z.string().optional(),
  duration: z.number().min(0).default(0),
  swingCount: z.number().min(0).default(0),
  metrics: z.object({
    consistency: z.number().min(0).max(100).optional(),
    avgRatio: z.number().optional(),
    avgBackswingTime: z.number().optional(),
    avgDownswingTime: z.number().optional(),
    clubSpeed: z.number().optional(),
    smashFactor: z.number().optional(),
    attackAngle: z.number().optional(),
    carryDistance: z.number().optional(),
  }).optional(),
  deviceId: z.string().optional(),
  notes: z.string().max(500).optional(),
});

exports.createSession = async (req, res, next) => {
  try {
    const data = sessionSchema.parse(req.body);
    const session = await Session.create({ ...data, userId: req.user.userId });
    res.status(201).json({ session });
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
    next(err);
  }
};

exports.getSessions = async (req, res, next) => {
  try {
    const { limit = 20, skip = 0 } = req.query;
    const sessions = await Session.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip))
      .populate('configId', 'ratio totalTime');
    const total = await Session.countDocuments({ userId: req.user.userId });
    res.json({ sessions, total });
  } catch (err) {
    next(err);
  }
};

exports.getSession = async (req, res, next) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, userId: req.user.userId })
      .populate('configId');
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json({ session });
  } catch (err) {
    next(err);
  }
};
