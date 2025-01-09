const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  category: {type: String, required: true},
  tasks: [
    {
      task: {type: String, required: true},
      completed: {type: Boolean, default: false},
      createdDate: {type: Date, default: Date.now},
    },
  ],
});

module.exports = mongoose.model('Task', taskSchema);
