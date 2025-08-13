import express from 'express';
import { body, validationResult } from 'express-validator';
import Tool from '../models/Tool.js';
import User from '../models/User.js';
import Usage from '../models/Usage.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all tools below threshold for supervisor notifications
router.get('/low-life', authenticate, authorize('supervisor'), async (req, res) => {
  try {
    // Find all tool instances belonging to this supervisor's company that are below or at threshold
    const supervisor = await User.findById(req.user._id);
    if (!supervisor) return res.status(403).json({ message: 'Supervisor not found' });

    // Find all tool instances (not parent tools) for this supervisor's company
    const tools = await Tool.find({
      isInstance: true,
      'companyOwner.supervisorId': supervisor._id,
      $expr: { $lte: ['$remainingLife', '$thresholdLimit'] }
    });
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all tools (filtered by role)
router.get('/', authenticate, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'shopkeeper') {
      query.shopkeeper = req.user._id;
      query.isInstance = { $ne: true }; // Only show parent tools
    } else if (req.user.role === 'supervisor') {
      // Show all parent tools from all shops (available for ordering)
      query.isInstance = { $ne: true };
    } else if (req.user.role === 'operator') {
      // Operators only see tools ordered by their company's supervisor with available quantities
      const supervisor = await User.findOne({ 
        email: req.user.supervisorEmail, 
        role: 'supervisor',
        companyName: req.user.companyName 
      });
      
      if (supervisor) {
        query['orderedByCompanies.supervisorId'] = supervisor._id;
        query['orderedByCompanies.availableQuantity'] = { $gt: 0 };
        query.isInstance = { $ne: true }; // Only show parent tools
      } else {
        return res.json([]);
      }
    }

    const tools = await Tool.find(query)
      .populate('shopkeeper', 'name shopName')
      .populate('currentUser', 'name')
      .sort({ createdAt: -1 });

    // For supervisors, show clean tool data without usage details
    if (req.user.role === 'supervisor') {
      const supervisorTools = tools.map(tool => ({
        ...tool.toObject(),
        // Remove any usage-related fields that might confuse ordering
        currentUser: null,
        usageStartTime: null,
        totalUsageHours: 0
      }));
      return res.json(supervisorTools);
    }

    // For operators, filter and format tools to show only company-specific data
    if (req.user.role === 'operator') {
      const supervisor = await User.findOne({ 
        email: req.user.supervisorEmail, 
        role: 'supervisor',
        companyName: req.user.companyName 
      });

      const operatorTools = tools.map(tool => {
        const companyOrder = tool.orderedByCompanies.find(
          order => order.supervisorId.toString() === supervisor._id.toString()
        );
        
        if (companyOrder && companyOrder.availableQuantity > 0) {
          return {
            ...tool.toObject(),
            companyQuantity: companyOrder.orderedQuantity,
            availableQuantity: companyOrder.availableQuantity,
            inUseQuantity: companyOrder.inUseQuantity
          };
        }
        return null;
      }).filter(tool => tool !== null);

      return res.json(operatorTools);
    }

    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get supervisor's ordered tools
router.get('/my-tools', authenticate, authorize('supervisor'), async (req, res) => {
  try {
    const tools = await Tool.find({
      'orderedByCompanies.supervisorId': req.user._id,
      isInstance: { $ne: true }
    })
    .populate('shopkeeper', 'name shopName')
    .populate('currentUser', 'name')
    .sort({ createdAt: -1 });

    // Filter and format tools to show only company-specific data
    const myTools = tools.map(tool => {
      const companyOrder = tool.orderedByCompanies.find(
        order => order.supervisorId.toString() === req.user._id.toString()
      );
      
      return {
        ...tool.toObject(),
        companyQuantity: companyOrder ? companyOrder.orderedQuantity : 0,
        availableQuantity: companyOrder ? companyOrder.availableQuantity : 0,
        inUseQuantity: companyOrder ? companyOrder.inUseQuantity : 0
      };
    });

    res.json(myTools);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get operator's available tools with individual instances
router.get('/operator-tools', authenticate, authorize('operator'), async (req, res) => {
  try {
    const supervisor = await User.findOne({ 
      email: req.user.supervisorEmail, 
      role: 'supervisor',
      companyName: req.user.companyName 
    });

    if (!supervisor) {
      return res.json([]);
    }

    // Get parent tools ordered by supervisor
    const parentTools = await Tool.find({
      'orderedByCompanies.supervisorId': supervisor._id,
      'orderedByCompanies.availableQuantity': { $gt: 0 },
      isInstance: { $ne: true }
    })
    .populate('shopkeeper', 'name shopName')
    .sort({ createdAt: -1 });

    // Get active instances for this operator
    const activeInstances = await Tool.find({
      isInstance: true,
      'companyOwner.supervisorId': supervisor._id,
      currentUser: req.user._id,
      status: 'in-use'
    })
    .populate('shopkeeper', 'name shopName')
    .populate('parentTool', 'name category')
    .sort({ createdAt: -1 });

    // Get available (stopped but reusable) instances for this operator
    const availableInstances = await Tool.find({
      isInstance: true,
      'companyOwner.supervisorId': supervisor._id,
      status: 'available',
      remainingLife: { $gt: 0 }
    })
    .populate('shopkeeper', 'name shopName')
    .populate('parentTool', 'name category')
    .sort({ createdAt: -1 });

    // Format parent tools with company-specific quantities
    const operatorTools = parentTools.map(tool => {
      const companyOrder = tool.orderedByCompanies.find(
        order => order.supervisorId.toString() === supervisor._id.toString()
      );
      
      return {
        ...tool.toObject(),
        companyQuantity: companyOrder.orderedQuantity,
        availableQuantity: companyOrder.availableQuantity,
        inUseQuantity: companyOrder.inUseQuantity
      };
    }).filter(tool => tool.availableQuantity > 0);

    res.json({ 
      parentTools: operatorTools, 
      activeInstances,
      availableInstances 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create tool (shopkeeper only)
router.post('/', authenticate, authorize('shopkeeper'), [
  body('name').trim().isLength({ min: 2 }),
  body('description').trim().isLength({ min: 5 }),
  body('category').trim().isLength({ min: 2 }),
  body('lifeLimit').isInt({ min: 1 }),
  body('thresholdLimit').isInt({ min: 1 }),
  body('stock').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, category, lifeLimit, thresholdLimit, stock } = req.body;

    let tool;
    if (req.user.role === 'shopkeeper') {
      console.log('Shopkeeper adding tool. req.user:', req.user);
      tool = new Tool({
        name,
        description,
        category,
        lifeLimit,
        remainingLife: lifeLimit,
        thresholdLimit,
        shopName: req.user.shopName,
        shopkeeper: req.user._id,
        stock: stock || 1
      });
    } else if (req.user.role === 'operator') {
      const supervisor = await User.findOne({
        email: req.user.supervisorEmail,
        role: 'supervisor',
        companyName: req.user.companyName
      });

      if (!supervisor) {
        return res.status(403).json({ message: 'Supervisor not found for your company.' });
      }

      tool = new Tool({
        name,
        description,
        category,
        lifeLimit,
        remainingLife: lifeLimit,
        thresholdLimit,
        shopName: supervisor.companyName, // Use supervisor's company name as shopName for operator-added tools
        shopkeeper: supervisor._id, // Associate with supervisor as the 'owner'
        stock: stock || 1,
        isInstance: true, // Mark as an instance if created by operator
        parentTool: null, // This will be set later if it's an instance of an existing tool
        instanceNumber: null, // This will be set later
        companyOwner: {
          companyName: supervisor.companyName,
          supervisorId: supervisor._id
        }
      });
    }

    await tool.save();
    await tool.populate('shopkeeper', 'name shopName');

    res.status(201).json(tool);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update tool
router.put('/:id', authenticate, authorize('shopkeeper'), async (req, res) => {
  try {
    let tool;
    if (req.user.role === 'shopkeeper') {
      tool = await Tool.findOne({ _id: req.params.id, shopkeeper: req.user._id });
    } else if (req.user.role === 'operator') {
      const supervisor = await User.findOne({
        email: req.user.supervisorEmail,
        role: 'supervisor',
        companyName: req.user.companyName
      });

      if (!supervisor) {
        return res.status(403).json({ message: 'Supervisor not found for your company.' });
      }
      tool = await Tool.findOne({ _id: req.params.id, 'companyOwner.supervisorId': supervisor._id });
    }
    
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }

    const allowedUpdates = ['name', 'description', 'category', 'thresholdLimit', 'stock'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    Object.assign(tool, updates);
    await tool.save();
    await tool.populate('shopkeeper', 'name shopName');

    res.json(tool);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Start using tool (operator only) - Creates individual instance or reuses existing
router.post('/:id/start-usage', authenticate, authorize('operator'), async (req, res) => {
  try {
    let toolToUse = await Tool.findById(req.params.id);
    
    if (!toolToUse) {
      return res.status(404).json({ message: 'Tool not found' });
    }

    const supervisor = await User.findOne({ 
      email: req.user.supervisorEmail, 
      role: 'supervisor',
      companyName: req.user.companyName 
    });

    // Check if this is an existing instance that can be reused
    if (toolToUse.isInstance) {
      // Verify this instance belongs to the operator's company and is available
      if (toolToUse.companyOwner.supervisorId.toString() !== supervisor._id.toString()) {
        return res.status(403).json({ message: 'This tool instance does not belong to your company' });
      }

      if (toolToUse.status !== 'available') {
        return res.status(400).json({ message: 'This tool instance is not available' });
      }

      if (toolToUse.remainingLife <= 0) {
        return res.status(400).json({ message: 'This tool instance has no remaining life' });
      }

      // Notify supervisor if tool is already below or at threshold when starting usage
      if (toolToUse.remainingLife <= toolToUse.thresholdLimit) {
        const io = req.app.get('io');
        if (io) {
          io.to('supervisor').emit('tool-threshold-alert', {
            tool: toolToUse.name,
            remainingLife: toolToUse.remainingLife,
            thresholdLimit: toolToUse.thresholdLimit,
            shopName: toolToUse.shopName,
            instanceNumber: toolToUse.instanceNumber
          });
        }
      }

      // Reuse the existing instance
      toolToUse.status = 'in-use';
      toolToUse.currentUser = req.user._id;
      toolToUse.usageStartTime = new Date();
      await toolToUse.save();

      // Create new usage record
      const usage = new Usage({
        tool: toolToUse._id,
        parentTool: toolToUse.parentTool,
        operator: req.user._id,
        supervisor: supervisor._id,
        companyName: supervisor.companyName,
        instanceNumber: toolToUse.instanceNumber,
        startTime: new Date(),
        toolName: toolToUse.name,
        toolCategory: toolToUse.category
      });
      await usage.save();

      await toolToUse.populate('shopkeeper', 'name shopName');
      return res.json({ 
        message: 'Resumed using existing tool instance', 
        tool: toolToUse, 
        instanceNumber: toolToUse.instanceNumber 
      });
    }

    // This is a parent tool - create new instance
    const parentTool = toolToUse;
    const companyOrder = parentTool.orderedByCompanies.find(order => 
      order.supervisorId.toString() === supervisor._id.toString()
    );

    if (!companyOrder) {
      return res.status(403).json({ message: 'Your company has not ordered this tool' });
    }

    if (companyOrder.availableQuantity <= 0) {
      return res.status(400).json({ message: 'No available quantity for your company' });
    }

    if (parentTool.remainingLife <= 0) {
      return res.status(400).json({ message: 'Tool has no remaining life' });
    }

    // Find the next instance number for this company
    const existingInstances = await Tool.find({
      parentTool: parentTool._id,
      'companyOwner.supervisorId': supervisor._id
    });
    const instanceNumber = existingInstances.length + 1;

    // Create a new tool instance for this usage
    const toolInstance = new Tool({
      name: parentTool.name,
      description: parentTool.description,
      category: parentTool.category,
      lifeLimit: parentTool.lifeLimit,
      remainingLife: parentTool.lifeLimit, // Start with full life for new instance
      thresholdLimit: parentTool.thresholdLimit,
      shopName: parentTool.shopName,
      shopkeeper: parentTool.shopkeeper,
      status: 'in-use',
      currentUser: req.user._id,
      usageStartTime: new Date(),
      stock: 1,
      isInstance: true,
      parentTool: parentTool._id,
      instanceNumber: instanceNumber,
      companyOwner: {
        companyName: supervisor.companyName,
        supervisorId: supervisor._id
      }
    });

    await toolInstance.save();

    // Update the parent tool's company quantities
    companyOrder.availableQuantity -= 1;
    companyOrder.inUseQuantity += 1;
    await parentTool.save();

    // Create usage record
    const usage = new Usage({
      tool: toolInstance._id,
      parentTool: parentTool._id,
      operator: req.user._id,
      supervisor: supervisor._id,
      companyName: supervisor.companyName,
      instanceNumber: instanceNumber,
      startTime: new Date(),
      toolName: parentTool.name,
      toolCategory: parentTool.category
    });
    await usage.save();

    await toolInstance.populate('shopkeeper', 'name shopName');

    res.json({ message: 'Tool usage started', tool: toolInstance, instanceNumber });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Stop using tool (operator only)
router.post('/:id/stop-usage', authenticate, authorize('operator'), async (req, res) => {
  try {
    const toolInstance = await Tool.findById(req.params.id);
    
    if (!toolInstance) {
      return res.status(404).json({ message: 'Tool not found' });
    }

    if (toolInstance.status !== 'in-use' || !toolInstance.currentUser?.equals(req.user._id)) {
      return res.status(400).json({ message: 'You are not currently using this tool' });
    }

    const endTime = new Date();
    const startTime = toolInstance.usageStartTime;
    const durationHours = (endTime - startTime) / (1000 * 60 * 60);

    // Update tool instance - make it available for reuse if it has remaining life
    const newRemainingLife = Math.max(0, toolInstance.remainingLife - durationHours);
    
    toolInstance.status = newRemainingLife > 0 ? 'available' : 'retired';
    toolInstance.currentUser = null;
    toolInstance.usageStartTime = null;
    toolInstance.remainingLife = newRemainingLife;
    toolInstance.totalUsageHours += durationHours;

    await toolInstance.save();

    // Update parent tool quantities only if tool is retired
    if (newRemainingLife <= 0) {
      const parentTool = await Tool.findById(toolInstance.parentTool);
      if (parentTool) {
        const supervisor = await User.findOne({ 
          email: req.user.supervisorEmail, 
          role: 'supervisor',
          companyName: req.user.companyName 
        });

        const companyOrder = parentTool.orderedByCompanies.find(order => 
          order.supervisorId.toString() === supervisor._id.toString()
        );

        if (companyOrder) {
          companyOrder.inUseQuantity -= 1;
          // Tool is now used up, don't add back to available
          await parentTool.save();
        }
      }
    } else {
      // Tool is still usable, just update in-use count
      const parentTool = await Tool.findById(toolInstance.parentTool);
      if (parentTool) {
        const supervisor = await User.findOne({ 
          email: req.user.supervisorEmail, 
          role: 'supervisor',
          companyName: req.user.companyName 
        });

        const companyOrder = parentTool.orderedByCompanies.find(order => 
          order.supervisorId.toString() === supervisor._id.toString()
        );

        if (companyOrder) {
          companyOrder.inUseQuantity -= 1;
          // Don't change availableQuantity as the instance is still usable
          await parentTool.save();
        }
      }
    }

    // Update usage record
    const usage = await Usage.findOne({
      tool: toolInstance._id,
      operator: req.user._id,
      isActive: true
    });

    if (usage) {
      usage.endTime = endTime;
      usage.duration = durationHours;
      usage.isActive = false;
      await usage.save();
    }

    // Check threshold and notify supervisor
    if (toolInstance.remainingLife <= toolInstance.thresholdLimit) {
      const io = req.app.get('io');
      io.to('supervisor').emit('tool-threshold-alert', {
        tool: toolInstance.name,
        remainingLife: toolInstance.remainingLife,
        thresholdLimit: toolInstance.thresholdLimit,
        shopName: toolInstance.shopName,
        instanceNumber: toolInstance.instanceNumber
      });
    }

    const statusMessage = newRemainingLife > 0 
      ? 'Tool usage stopped - Available for reuse' 
      : 'Tool usage stopped - Tool retired';

    res.json({ 
      message: statusMessage, 
      tool: toolInstance, 
      durationHours,
      canReuse: newRemainingLife > 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark tool as broken (operator only)
router.post('/:id/mark-as-broken', authenticate, authorize('operator'), async (req, res) => {
  try {
    const toolInstance = await Tool.findById(req.params.id);

    if (!toolInstance) {
      return res.status(404).json({ message: 'Tool not found' });
    }

    if (toolInstance.status !== 'in-use' || !toolInstance.currentUser?.equals(req.user._id)) {
      return res.status(400).json({ message: 'You are not currently using this tool' });
    }

    const endTime = new Date();
    const startTime = toolInstance.usageStartTime;
    const durationHours = (endTime - startTime) / (1000 * 60 * 60);

    // Update tool instance
    toolInstance.status = 'broken';
    toolInstance.currentUser = null;
    toolInstance.usageStartTime = null;
    toolInstance.totalUsageHours += durationHours;

    await toolInstance.save();

    // Update parent tool quantities
    const parentTool = await Tool.findById(toolInstance.parentTool);
    if (parentTool) {
      const supervisor = await User.findOne({
        email: req.user.supervisorEmail,
        role: 'supervisor',
        companyName: req.user.companyName
      });

      const companyOrder = parentTool.orderedByCompanies.find(order =>
        order.supervisorId.toString() === supervisor._id.toString()
      );

      if (companyOrder) {
        companyOrder.inUseQuantity -= 1;
        await parentTool.save();
      }
    }

    // Update usage record
    const usage = await Usage.findOne({
      tool: toolInstance._id,
      operator: req.user._id,
      isActive: true
    });

    if (usage) {
      usage.endTime = endTime;
      usage.duration = durationHours;
      usage.isActive = false;
      await usage.save();
    }

    res.json({ message: 'Tool marked as broken and removed from service.', tool: toolInstance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete tool
router.delete('/:id', authenticate, authorize('shopkeeper'), async (req, res) => {
  try {
    const tool = await Tool.findOneAndDelete({ _id: req.params.id, shopkeeper: req.user._id });
    
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }

    res.json({ message: 'Tool deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;