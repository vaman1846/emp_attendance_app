const mongoose = require('mongoose')

const attendanceSchema = new mongoose.Schema({
  employee_id: { type: Number, required: true },
  loginTime: { type: Date, default: Date.now, required: true },
  logoutTime: { type: Date  },
 
});

module.exports = mongoose.model('atten',attendanceSchema)
