const schedule=require('node-schedule-tz')
const User=require("../model/user")
const WA = require('../lib/whatsapp-send-message');
function triggerSchedular(){
  let task=  schedule.scheduleJob('*/10 * * * * *',async ()=>{
      
       await User.find({ isDone: false}, function (err, docs) {
        task.cancel()  // stop to check documents 
           docs.forEach((doc)=>{
                // console.log(doc.username)
               let dateString=doc.message.date+" "+doc.message.time+" "+doc.message.isAM;
            //    console.log(dateString)
               let rem=new Date(dateString);
            //    console.log(rem.toDateString())
               let now=new Date()
               let diff=(rem-now)/(1000*60)
            if(diff<=15){
                // console.log('Message sent')
                 WA.sendMessage(doc.reminder,doc.username);
                 
                 doc.isDone=true;
                 doc.save()
                 
            }
           })

           triggerSchedular() // start again after checking documents
        
            
        }).clone().catch(function(err){ console.log(err)})
    
        // console.log('schedular running')
    })
}

module.exports=triggerSchedular