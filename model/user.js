const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
   username:{type:String},
   message:{
    process:{type:String},  
    operation:{type:String},
    date:{
        day:{type:Number},
        month:{type:Number},
        year:{type:Number}
    },
    time:{
        first:{type:Number},
        second:{type:Number},
        isAM:{type:String},
    }, 
   },
   country:{type:String,default:"+91"},
   isDone:{type:Boolean,default:false}
})

module.exports = mongoose.model("User", userSchema)