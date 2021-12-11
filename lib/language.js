const syntaxUpdate="update reminder 5/10/2021 5:00 am <id_you_want_to_delete>"
const syntaxDelete="delete <id_you_want_to_delete>"
const syntaxRead="read *"
const syntaxCreate=".cre rem mm-dd-yyyy hh:mm AM -mes '<message>'"
const syntaxYoutube=".ytb <search key> <numbers of results>"
const User=require("../model/user")
const fetch = require("node-fetch");
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
       }else if(data.Body=="youtube ?"){
        return await Promise.resolve(syntaxYoutube);
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
        let ans="saved success with id : "+saveData._id;
        return await Promise.resolve(ans);
    }  else if(keyWords[0]==".ytb"){
        let len=keyWords.length
        let temp=keyWords;
        const search=temp.slice(1,len-1).join("+")
        console.log(search)
        let maxResults=keyWords[len-1] 
        const url=`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&key=AIzaSyAPxZmernOWQqzDLKbMFgrKEn6ajqu8CEI&type=video&q=${search}`
     
        let result=  await fetch(url)
        let res= await result.json()
       
        let video_URLS=''
        let cnt=0;
        res.items.forEach(item => {
            video_URLS=video_URLS+`${cnt}. https://www.youtube.com/watch?v=${item.id.videoId}`
            video_URLS=video_URLS+'\n\n'
            cnt=cnt+1;
        });
        return await Promise.resolve(video_URLS);
    }
    else if(keyWords[0]==".upd"){//case sensitive
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
     else if(keyWords[0]==".del"){//case sensitive
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