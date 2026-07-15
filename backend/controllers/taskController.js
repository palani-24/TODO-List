const Task = require('../models/Task');

// @desc    Get all tasks (supports search, filter, sort via query params)
// @route   GET /api/tasks
exports.getTasks = async (req, res) => {
  try {
    const { search, category, assignedTo, priority, status, sort } = req.query;
    const query = {};

    if (search) {
      query.taskName = { $regex: search, $options: 'i' };
    }
    if (category) query.category = category;
    if (assignedTo) query.assignedTo = assignedTo;
    if (priority) query.priority = priority;
    if (status) query.status = status;

    let sortOption = { practiceDate: 1 };
    if (sort === 'date_desc') sortOption = { practiceDate: -1 };
    if (sort === 'date_asc') sortOption = { practiceDate: 1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };

    const tasks = await Task.find(query).sort(sortOption);
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while fetching tasks', error: err.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while fetching task', error: err.message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, message: 'Task created successfully', data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Failed to create task', error: err.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, message: 'Task updated successfully', data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Failed to update task', error: err.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, message: 'Task deleted successfully', data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete task', error: err.message });
  }
};

// @desc    Mark task completed
// @route   PATCH /api/tasks/:id/complete
exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: 'Completed' },
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, message: 'Task marked as completed', data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to complete task', error: err.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/tasks/stats/summary
exports.getStats = async (req, res) => {
  try {
    const total = await Task.countDocuments();
    const pending = await Task.countDocuments({ status: 'Pending' });
    const completed = await Task.countDocuments({ status: 'Completed' });
    const highPriority = await Task.countDocuments({ priority: 'High' });
    res.status(200).json({
      success: true,
      data: { total, pending, completed, highPriority }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while fetching stats', error: err.message });
  }
};
