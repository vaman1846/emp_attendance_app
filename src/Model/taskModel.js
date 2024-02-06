const mongoose = require('mongoose')


const taskSchema = new mongoose.Schema({
    employee_id: { type: String, required: true },
    taskName: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    isCompleted: { type: Boolean, default: false },
    // Add any additional fields as needed
  });

  module.exports = mongoose.model('task', taskSchema)
  