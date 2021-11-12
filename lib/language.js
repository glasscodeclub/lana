const syntaxUpdate="update reminder 5/10/2021 5:00 am <id_you_want_to_delete>"
const syntaxDelete="delete <id_you_want_to_delete>"
const syntaxRead="read *"
const syntaxCreate="create reminder 5/10/2021 5:00 am <your_custom_message>"
const User=require("../model/user")
const _=require("lodash")
const pq=require('../lib/remQue')
const check = (message) => {
    return true;
}
const process = async (data) => {
    try {
       if(!check(data.body))
       return await Promise.resolve({message:"command syntax wrong",status:'send'});
       let keyWords=data.Body.split(" ");
       if(data.Body=="create ?"){
        return await Promise.resolve({message:syntaxCreate,status:'send'});
       }
       else if(data.Body=="update ?"){
        return await Promise.resolve({message:syntaxUpdate,status:'send'});
       }
       else if(data.Body=="delete ?"){
        return await Promise.resolve({message:syntaxDelete,status:'send'});
       }
       else if(data.Body=="read ?"){
        return await Promise.resolve({message:syntaxRead,status:'send'});
       }
       else if(keyWords[0]=="create"){//case sensitive
        const date=keyWords[2].split("/");
        const time=keyWords[3].split(":");
        const cust_message = keyWords[5];
        // console.log(keyWords[5])
       var saveData=new User({
        username:data.From,
        message:{
         process:keyWords[0],  
         operation:keyWords[1],
         cust_message:cust_message,
         date:{
             day:date[0],
             month:date[1],
             year:date[2]
         },
         time:{
             first:time[0],
             second:time[1],
             isAM:keyWords[4],
         },
        },
       })
       await saveData.save();
        let ans="saved success with id : "+saveData._id;
        const remDateString=date[2]+"-"+date[1]+"-"+date[0]+" "+time[0]+":"+time[1]+" "+keyWords[4];
        
        // const date1=new Date("2000-01-01 10:30 AM")
        // const date2=new Date("2000-01-01 10:50 AM")
        const rem = new Date(remDateString);
        pq.push(rem)   // priority queue for date and time
       
        return await Promise.resolve({message:ans,status:'wait',id:saveData._id});
       
    }  
    else if(keyWords[0]=="update"){//case sensitive
        var updateData={
         username:data.From,
         message:{
          process:keyWords[0],  
          operation:keyWords[1],
          date:{
              day:keyWords[2].split("/")[0],
              month:keyWords[2].split("/")[1],
              year:keyWords[2].split("/")[2]
          },
          time:{
              first:keyWords[3].split(":")[0],
              second:keyWords[3].split(":")[1],
              isAM:keyWords[4],
          }, 
         },
        }
        let doc=await User.findOneAndUpdate({_id:keyWords[5]},updateData)
        let ans;
        if(_.isEmpty(doc)){
         ans="no entry found with id  : "+keyWords[5];
    
        }
        else{
        ans="update to id : "+doc._id+" successful";
        }
         return await Promise.resolve(ans);
     }
     else if(keyWords[0]=="delete"){//case sensitive
        let doc=await User.findOneAndRemove({_id:keyWords[5]})
        let ans;
        if(_.isEmpty(doc)){
         ans="no entry found with id  : "+keyWords[5];
    
        }
        else{
        ans="delete to id : "+doc._id+" successful";
        }
         return await Promise.resolve(ans);
     }    
     else if(keyWords[0]=="read"){//case sensitive
        if(keyWords[1]=="*"){
            let doc=await User.find({username:data.From})
            let ans;
            if(_.isEmpty(doc)){
             ans="no entry found";
            }
            else{
                ans+="process | operation | ";
                // for(var i=0;i<doc.length;++i){
                //  ans +=""   
                // }
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
              ans=keyWords[1]+" found"
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