const syntaxUpdate="update reminder 5/10/2021 5:00 am <id_you_want_to_delete>"
const syntaxDelete="delete <id_you_want_to_delete>"
const syntaxRead="read *"
const syntaxCreate=".cre rem mm/dd/yyyy hh:mm AM -mes '<message>'"
const User=require("../model/user")
const _=require("lodash")
const check = (message) => {
    return true;
}
const process = async (data) => {
    try {
       if(!check(data.body))
       return await Promise.resolve("command syntax wrong");
       let keyWords=data.Body.split(" ");
       if(data.Body=="create ?"){
        return await Promise.resolve(syntaxCreate);
       }
       else if(data.Body=="update ?"){
        return await Promise.resolve(syntaxUpdate);
       }
       else if(data.Body=="delete ?"){
        return await Promise.resolve(syntaxDelete);
       }
       else if(data.Body=="read ?"){
        return await Promise.resolve(syntaxRead);
       }

       else if(keyWords[0]==".cre"){//case sensitive
        let cre=data.Body.split(' -mes ')
        let message=cre[1]
       var saveData=new User({
        username:data.From,
        message:{
         process:keyWords[0],  
         operation:keyWords[1],
         date:keyWords[2],
         time:keyWords[3], 
         isAM:keyWords[4]
        },
        reminder:message,
        country:'india',
        isDone:false
       })
       await saveData.save();
       console.log(keyWords)
       ans =  "Remainder Created" + `‏
‎` + "Object Id = " + saveData._id + `‏
‎ Time : `+ saveData.message.date + " " + saveData.message.time + " " + saveData.message.isAM + `‏
‎ Message : ` + saveData.reminder;
        return await Promise.resolve(ans);
    }  
    else if(keyWords[0]==".upd"){//case sensitive
        let cre=data.Body.split(' -mes ')
        let message=cre[1]
        var updateData={
         username:data.From,
         message:{
            date:keyWords[2],
            time:keyWords[3], 
            isAM:keyWords[4]
           },
           reminder:message,
        }
        let doc=await User.findOneAndUpdate({_id:keyWords[1]},updateData)
        let ans;
        if(_.isEmpty(doc)){
         ans="no entry found with id  : "+keyWords[5];
    
        }
        else{
       ans =  "Remainder Updated " + `‏
       ‎` + "Object Id = " + doc._id + `‏
       ‎ Time : `+ updateData.message.date + " " + updateData.message.time + " " + updateData.message.isAM + `‏
       ‎ Message : ` + updateData.reminder;
        }
         return await Promise.resolve(ans);
     }
     else if(keyWords[0]==".del"){//case sensitive
        let doc=await User.findOneAndRemove({_id:keyWords[1]})
        let ans;
        if(_.isEmpty(doc)){
         ans="no entry found with id  : "+keyWords[5];
    
        }
        else{
        ans="Remainder with id: "+doc._id+" successful";
        }
         return await Promise.resolve(ans);
     }    
     else if(keyWords[0]==".read"){//case sensitive
        if(keyWords[1]=="*"){
            let doc=await User.find({username:data.From})
            let ans;
            if(_.isEmpty(doc)){
             ans="no entry found";
            }
            else{
                ans = ""
                for(var i=0;i<doc.length;++i){
                    ans+= i+1 + "  " + doc[i]._id + "  " + doc[i].reminder + `‏
‎`;
                    // console.log(ans)
                }
            }
             return await Promise.resolve(ans);
        }
        else{
            let doc=await User.find({_id:keyWords[1]})
            let ans;
            if(_.isEmpty(doc)){
             ans="no entry found";
            }
            else{
              ans = "Object Id = " + doc[0]._id + `‏
‎ Time : `+ doc[0].message.date + " " + doc[0].message.time + " " + doc[0].message.isAM + `‏
‎ Message : ` + doc[0].reminder 
              console.log(ans)
            }
             return await Promise.resolve(ans);
        }
        
     }
    
    else{
        return await Promise.resolve("command not found");
    }
    } catch (error) {
        console.log(error);
        return await Promise.resolve("some error occured");
    }
};

module.exports = {
    process
}