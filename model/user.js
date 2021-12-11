const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
   username:{type:String},
   message:{
    process:{type:String},  
    operation:{type:String},
    date:{
        type:String
    },
    time:{
        type:String
    }, 
    isAM:{
        type:String
    }
   },
   reminder:{
    type:String
   },
   country:{type:String,default:"+91"},
   isDone:{type:Boolean,default:false}
})

module.exports = mongoose.model("User", userSchema)