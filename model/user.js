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

userSchema.methods.check = async function(){
   console.log("check is working")
    let dateString=this.message.date+" "+this.message.time+" "+this.message.isAM;
    let rem=new Date(dateString);
<<<<<<< HEAD
    console.log(rem)
=======
    rem.setHours(rem.getHours()-5);
    rem.setMinutes(rem.getMinutes()-30);
>>>>>>> dd3e8433377d3d6ad7606760dd11011cecdf5582
    let now=new Date();
    if(rem-now<0){
        return "😥 sorry we cannot travel in past";
    }else if(rem-now<=15){
        await this.save();
        this.isDone=true;
        return this.reminder;
    }else{
        await this.save();
        return "success"
    }

}

module.exports = mongoose.model("User", userSchema)
