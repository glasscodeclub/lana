const syntaxUpdate="update reminder 5/10/2021 5:00 am <id_you_want_to_delete>"
const syntaxDelete=".del <id_you_want_to_delete>"
const syntaxRead=".read -a"
const syntaxCreate=".cre rem mm/dd/yyyy hh:mm AM -mes '<message>'"
const syntaxYoutube=".ytb <search key> <numbers of results>"
let {table}=require('table')
var Table = require('easy-table')
const languageCodes=[['*Language*','*Language Code*'],["C","c"],["C++","cpp17"],["Python2","python2"],["Python3","python3"],["Java","java"],["Nodejs","nodejs"],["SQL","sql"],["Perl","perl"],["C#","csharp"]] // add languages here
const runCode=`.run <language code> <code>\n\n for language code run this command .lang ?`
const User=require("../model/user")
const fetch = require("node-fetch");
const _=require("lodash")
const callApi=require('../middleware/compiler')
let help=[{work:'*Create reminder*',command:syntaxCreate,'helpingCommand':'.create ?'},
{work:'*Youtube search*',command:syntaxYoutube,helpingCommand:'.ytb ?'},
{work:'*Compile Code*',command:runCode,helpingCommand:'.run ?'},
{work:'*Read reminders and Id*',command:syntaxRead,helpingCommand:'.read ?'},
{work:'*Update reminder*',command:syntaxUpdate,helpingCommand:'.update ?'},
{work:'*Delete Reminder*',command:syntaxDelete,helpingCommand:'.delete ?'}]
const check = (message) => {
    return true;
}
const process = async (data) => {
    try {
       if(!check(data.body))
       return await Promise.resolve("command syntax wrong");
       let keyWords=data.Body.split(" ");
       if(data.Body=='.help'){
          
        return await Promise.resolve(help);
       }
       else if(data.Body==".create ?"){
        return await Promise.resolve(syntaxCreate);
       }
       else if(data.Body==".update ?"){
        return await Promise.resolve(syntaxUpdate);
       }
       else if(data.Body==".delete ?"){
        return await Promise.resolve(syntaxDelete);
       }
       else if(data.Body==".read ?"){
        return await Promise.resolve(syntaxRead);
       }else if(data.Body==".youtube ?"){
        return await Promise.resolve(syntaxYoutube);
       }else if(data.Body==".lang ?"){
       
        return await Promise.resolve(table(languageCodes));
       }else if(data.Body==".run ?"){
        return await Promise.resolve(runCode);
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
    //    await saveData.save();
       console.log(keyWords)
       ans =  "Remainder Created" + `‏
‎` + "Object Id = " + saveData._id + `‏
‎ Time : `+ saveData.message.date + " " + saveData.message.time + " " + saveData.message.isAM + `‏
‎ Message : ` + saveData.reminder;
        const check=await saveData.check()
        if(check!="success") ans=check;
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
        if(keyWords[1]=="-a"){
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
        
     }else if(keyWords[0]==".run"){
         console.log(data.Body)
        let lang=data.Body.split(" ")[1];

        let s=5+lang.length;
        while(data.Body[s]==" "||data.Body[s]=="\n"||data.Body[s]=="\r"){
            s++;
        }
        console.log(lang)
        let sourceCode=data.Body.slice(s);
        console.log(sourceCode);
        return await Promise.resolve(callApi(sourceCode,lang));
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