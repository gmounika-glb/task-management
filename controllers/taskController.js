const Task = require('../models/taskModel');

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Task.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
};

// Add a new category
exports.addCategory = async (req, res) => {
  try {
    const {category} = req.body;
    const newCategory = new Task({category});
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
};

// Add a task to a category
exports.addTask = async (req, res) => {
  try {
    const {categoryId, task} = req.body;
    const category = await Task.findById(categoryId);
    category.tasks.push({task});
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const {id} = req.params;
    const {taskId} = req.body;
    const category = await Task.findById(id);
    category.tasks = category.tasks.filter(t => t._id.toString() !== taskId);
    await category.save();
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const {id} = req.params;
    await Task.findByIdAndDelete(id);
    res.status(200).json({message: 'Category deleted'});
  } catch (err) {
    res.status(500).json({error: err.message});
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const {id} = req.params;
    const {taskId, task, completed} = req.body;
    const category = await Task.findById(id);
    const taskToUpdate = category.tasks.find(t => t._id.toString() === taskId);
    if (task) taskToUpdate.task = task;
    if (completed !== undefined) taskToUpdate.completed = completed;
    await category.save();
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
};
