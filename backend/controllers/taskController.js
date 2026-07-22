const Task = require('../models/Task');
const { createNotification } = require('./notificationController');

// @desc    Get all tasks (supports search, filter, sort via query params)
// @route   GET /api/tasks
exports.getTasks = async (req, res) => {
  try {
    const { search, category, assignedTo, priority, status, sort, tag, overdue } = req.query;
    const query = {};

    if (search) {
      query.taskName = { $regex: search, $options: 'i' };
    }
    if (category) query.category = category;
    if (assignedTo) query.assignedTo = assignedTo;
    if (priority) query.priority = priority;
    if (status) query.status = status;
    if (tag) query.tags = tag;

    // Overdue filter: past date + not completed
    if (overdue === 'true') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query.practiceDate = { $lt: today };
      query.status = { $ne: 'Completed' };
    }

    let sortOption = { practiceDate: 1 };
    if (sort === 'date_desc') sortOption = { practiceDate: -1 };
    if (sort === 'date_asc') sortOption = { practiceDate: 1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };

    const tasks = await Task.find(query).populate('player', 'name role jerseyNumber').sort(sortOption);
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while fetching tasks', error: err.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('player', 'name role jerseyNumber');
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
    await createNotification(`New task created: ${task.taskName}`, 'info', task._id);
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
    await createNotification(`Task deleted: ${task.taskName}`, 'warning', null);
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
    await createNotification(`Task completed: ${task.taskName}`, 'success', task._id);
    res.status(200).json({ success: true, message: 'Task marked as completed', data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to complete task', error: err.message });
  }
};

// @desc    Update task status (for kanban drag-and-drop)
// @route   PATCH /api/tasks/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, message: `Task moved to ${status}`, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update status', error: err.message });
  }
};

// @desc    Add a note to a task
// @route   POST /api/tasks/:id/notes
exports.addNote = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    task.notes.push({ text: req.body.text, author: req.body.author || 'Coach' });
    await task.save();
    res.status(201).json({ success: true, message: 'Note added', data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Failed to add note', error: err.message });
  }
};

// @desc    Delete a note from a task
// @route   DELETE /api/tasks/:id/notes/:noteId
exports.deleteNote = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    task.notes.id(req.params.noteId)?.deleteOne();
    await task.save();
    res.status(200).json({ success: true, message: 'Note deleted', data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete note', error: err.message });
  }
};

// @desc    Get dashboard stats (enhanced with overdue + trends)
// @route   GET /api/tasks/stats/summary
exports.getStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const total = await Task.countDocuments();
    const pending = await Task.countDocuments({ status: 'Pending' });
    const inProgress = await Task.countDocuments({ status: 'In Progress' });
    const completed = await Task.countDocuments({ status: 'Completed' });
    const highPriority = await Task.countDocuments({ priority: 'High' });
    const overdue = await Task.countDocuments({
      practiceDate: { $lt: today },
      status: { $ne: 'Completed' }
    });

    // Weekly trend: tasks completed in last 7 days
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 6);
    const weeklyTrend = [];
    for (let i = 0; i < 7; i++) {
      const dayStart = new Date(weekAgo);
      dayStart.setDate(dayStart.getDate() + i);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);
      const count = await Task.countDocuments({
        status: 'Completed',
        updatedAt: { $gte: dayStart, $lte: dayEnd }
      });
      weeklyTrend.push({
        date: dayStart.toISOString().split('T')[0],
        day: dayStart.toLocaleDateString('en', { weekday: 'short' }),
        completed: count
      });
    }

    // Tasks by assignedTo (player workload)
    const workload = await Task.aggregate([
      { $match: { status: { $ne: 'Completed' } } },
      { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      data: { total, pending, inProgress, completed, highPriority, overdue, weeklyTrend, workload }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while fetching stats', error: err.message });
  }
};

// @desc    Export tasks as CSV
// @route   GET /api/tasks/export/csv
exports.exportCsv = async (req, res) => {
  try {
    const { category, assignedTo, priority, status } = req.query;
    const query = {};
    if (category) query.category = category;
    if (assignedTo) query.assignedTo = assignedTo;
    if (priority) query.priority = priority;
    if (status) query.status = status;

    const tasks = await Task.find(query).sort({ practiceDate: 1 }).lean();

    const header = 'Task Name,Category,Assigned To,Priority,Practice Date,Status,Tags,Description\n';
    const rows = tasks.map(t => {
      const date = new Date(t.practiceDate).toISOString().split('T')[0];
      const tags = (t.tags || []).join('; ');
      const desc = (t.description || '').replace(/"/g, '""');
      return `"${t.taskName}","${t.category}","${t.assignedTo}","${t.priority}","${date}","${t.status}","${tags}","${desc}"`;
    }).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=cttms-tasks.csv');
    res.status(200).send(header + rows);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Export failed', error: err.message });
  }
};

// @desc    Get all unique tags
// @route   GET /api/tasks/tags/all
exports.getAllTags = async (req, res) => {
  try {
    const tags = await Task.distinct('tags');
    res.status(200).json({ success: true, data: tags.filter(t => t) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
