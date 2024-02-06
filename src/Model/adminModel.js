const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String , required:true,
        validate: {
            validator: function (v) {
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
            },
            message: '{VALUE} is not a valid email!'
          }},
    role:{type:String ,required:true},
    post : {type:String ,reuired:true},
    department :{type:String, required:true},
    phone:{type:Number , required:true},
    password:{type: String , required:true}

},{timestamps:true})

module.exports =mongoose.model('admin',adminSchema)