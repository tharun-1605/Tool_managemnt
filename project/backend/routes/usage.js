import express from 'express';
import Usage from '../models/Usage.js';
import Tool from '../models/Tool.js';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get usage history
router.get('/', authenticate, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'operator') {
      query.operator = req.user._id;
    } else if (req.user.role === 'supervisor') {
      query.supervisor = req.user._id;
    }

    const usage = await Usage.find(query)
      .populate('tool', 'name category instanceNumber')
      .populate('parentTool', 'name category')
      .populate('operator', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(usage);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get detailed usage analytics for supervisor
router.get('/supervisor-analytics', authenticate, authorize('supervisor'), async (req, res) => {
  try {
    const { period = '7d', toolId } = req.query;
    
    let dateFilter = new Date();
    switch (period) {
      case '24h':
        dateFilter.setHours(dateFilter.getHours() - 24);
        break;
      case '7d':
        dateFilter.setDate(dateFilter.getDate() - 7);
        break;
      case '30d':
        dateFilter.setDate(dateFilter.getDate() - 30);
        break;
      default:
        dateFilter.setDate(dateFilter.getDate() - 7);
    }

    let matchQuery = { 
      supervisor: req.user._id,
      createdAt: { $gte: dateFilter } 
    };
    
    if (toolId) {
      matchQuery.parentTool = toolId;
    }

    // Get detailed usage by tool and operator
    const detailedUsage = await Usage.find(matchQuery)
      .populate('operator', 'name email')
      .populate('parentTool', 'name category')
      .populate('tool', 'instanceNumber status')
      .sort({ createdAt: -1 });

    // Group by tool and operator
    const usageByTool = {};
    detailedUsage.forEach(usage => {
      const toolKey = usage.parentTool._id.toString();
      const operatorKey = usage.operator._id.toString();
      
      if (!usageByTool[toolKey]) {
        usageByTool[toolKey] = {
          toolName: usage.toolName,
          toolCategory: usage.toolCategory,
          operators: {}
        };
      }
      
      if (!usageByTool[toolKey].operators[operatorKey]) {
        usageByTool[toolKey].operators[operatorKey] = {
          operatorName: usage.operator.name,
          operatorEmail: usage.operator.email,
          instances: [],
          totalDuration: 0,
          totalSessions: 0
        };
      }
      
      usageByTool[toolKey].operators[operatorKey].instances.push({
        instanceNumber: usage.instanceNumber,
        startTime: usage.startTime,
        endTime: usage.endTime,
        duration: usage.duration,
        isActive: usage.isActive,
        status: usage.tool.status
      });
      
      usageByTool[toolKey].operators[operatorKey].totalDuration += usage.duration || 0;
      usageByTool[toolKey].operators[operatorKey].totalSessions += 1;
    });

    // Get analytics aggregation
    const analytics = await Usage.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            tool: "$parentTool",
            operator: "$operator"
          },
          totalDuration: { $sum: "$duration" },
          usageCount: { $sum: 1 },
          toolName: { $first: "$toolName" },
          instances: { $push: "$instanceNumber" }
        }
      },
      { $sort: { "_id.date": 1 } }
    ]);

    // Get tool usage summary
    const toolSummary = await Usage.aggregate([
      { $match: { supervisor: req.user._id } },
      {
        $group: {
          _id: "$parentTool",
          toolName: { $first: "$toolName" },
          toolCategory: { $first: "$toolCategory" },
          totalUsage: { $sum: "$duration" },
          totalSessions: { $sum: 1 },
          uniqueOperators: { $addToSet: "$operator" },
          instancesUsed: { $addToSet: "$instanceNumber" }
        }
      },
      {
        $addFields: {
          operatorCount: { $size: "$uniqueOperators" },
          instanceCount: { $size: "$instancesUsed" }
        }
      },
      { $sort: { totalUsage: -1 } }
    ]);

    res.json({
      detailedUsage: usageByTool,
      analytics,
      toolSummary
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get usage analytics
router.get('/analytics', authenticate, async (req, res) => {
  try {
    const { period = '7d', toolId } = req.query;
    
    let dateFilter = new Date();
    switch (period) {
      case '24h':
        dateFilter.setHours(dateFilter.getHours() - 24);
        break;
      case '7d':
        dateFilter.setDate(dateFilter.getDate() - 7);
        break;
      case '30d':
        dateFilter.setDate(dateFilter.getDate() - 30);
        break;
      default:
        dateFilter.setDate(dateFilter.getDate() - 7);
    }

    let matchQuery = { createdAt: { $gte: dateFilter } };
    
    if (req.user.role === 'operator') {
      matchQuery.operator = req.user._id;
    } else if (req.user.role === 'supervisor') {
      matchQuery.supervisor = req.user._id;
    }
    
    if (toolId) {
      matchQuery.parentTool = toolId;
    }

    const analytics = await Usage.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          totalDuration: { $sum: "$duration" },
          usageCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;