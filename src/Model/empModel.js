const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    employeeId: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    role:{type:String , required:true},
    position: { type: String },
    department: { type: String },
    password: { type: String, required: true },
  }
);

module.exports = mongoose.model("emp", employeeSchema);
