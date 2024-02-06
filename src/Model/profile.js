 const mongoose = require("mongoose");

const userProfile = new mongoose.Schema({
    employee_id: { type: String, require: true },
    image: { type: String, require: true },
    dob: { type: String, require: true },
    gender: { type: String, require: true },
    email: { type: String, require: true },
    contact: { type: Number, require: true },

}, { timestamps: true });

module.exports = mongoose.model("userprofile", userProfile)