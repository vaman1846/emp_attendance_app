// ...................Leave Request Schema................

  const mongoose = require('mongoose');

  const leaveSchema = new mongoose.Schema({
    employee_id:{type:String, required:true},
    leaveType: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String },
    status: { type: String, enum: ['Pending', 'approved', 'rejected'], default: 'Pending' },
    
  })

module.exports = mongoose.model('leave',leaveSchema)