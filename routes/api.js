const express = require('express');
const {
  getCategories,
  addCategory,
  addTask,
  deleteTask,
  deleteCategory,
  updateTask,
} = require('../controllers/taskController');
const router = express.Router();

// Routes
router.get('/categories', getCategories);
router.post('/category', addCategory);
router.post('/task', addTask);
router.delete('/task/:id', deleteTask);
router.delete('/category/:id', deleteCategory);
router.put('/task/:id', updateTask);

module.exports = router;
