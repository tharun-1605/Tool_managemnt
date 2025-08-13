import express from 'express';
import ToolRequest from '../models/ToolRequest.js';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Operator submits a tool request
router.post('/request', authenticate, authorize('operator'), async (req, res) => {
  try {
    const { toolName, category, reason } = req.body;
    const operator = req.user._id;
    const supervisor = await User.findOne({
      email: req.user.supervisorEmail,
      role: 'supervisor',
      companyName: req.user.companyName
    });
    if (!supervisor) {
      return res.status(404).json({ message: 'Supervisor not found' });
    }
    const request = new ToolRequest({
      operator,
      supervisor: supervisor._id,
      toolName,
      category,
      reason
    });
    await request.save();
    res.status(201).json({ message: 'Tool request submitted', request });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Supervisor views all requests sent to them
router.get('/requests', authenticate, authorize('supervisor'), async (req, res) => {
  try {
    const requests = await ToolRequest.find({ supervisor: req.user._id })
      .populate('operator', 'name email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
