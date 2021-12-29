const syntaxUpdate="update reminder 5/10/2021 5:00 am <id_you_want_to_delete>"
const syntaxDelete="delete <id_you_want_to_delete>"
const syntaxRead="read *"
const syntaxCreate=".cre rem mm-dd-yyyy hh:mm AM -mes '<message>'"
const syntaxYoutube=".ytb <search key> <numbers of results>"
let {table}=require('table')
var Table = require('easy-table')
const languageCodes=[['*Language*','*Code*'],["C","c"],["C++","cpp17"],["Python2","python2"],["Python3","python3"],["Java","java"],["Nodejs","nodejs"],["SQL","sql"],["Perl","perl"],["C#","csharp"]] // add languages here
const runCode=`.run <language>\n<code>`
const User=require("../model/user")
const fetch = require("node-fetch");
const _=require("lodash")
const callApi=require('../middleware/compiler')
// const addDays=require('../utils/addDays')
// const axios = require("axios");
const resource_id=require("../middleware/resource")
const { response } = require('express')

const check = (message) => {
    return true;
}
const process = async (data) => {
    try {
       if(!check(data.body))
       return await Promise.resolve("command syntax wrong");
       let keyWords=data.Body.split(" ");
       if(data.Body==".create ?"){
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
    //    console.log(keyWords)
       ans =  "Remainder Created" + `\n` + "Object Id = " + saveData._id + `\n Time : `+ saveData.message.date + " " + saveData.message.time + " " + saveData.message.isAM + `\n Message : ` + saveData.reminder;
        const check=await saveData.check()
        if(check!="success") ans=check;
        return await Promise.resolve(ans);
    }  else if(keyWords[0]==".ytb"){
        let len=keyWords.length
        let temp=keyWords;
        const search=temp.slice(1,len-1).join("+")
        // console.log(search)
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
       ans =  "Remainder Updated" + `\n` + "Object Id = " + doc._id + `\n Time : `+ updateData.message.date + " " + updateData.message.time + " " + updateData.message.isAM + `\n Message : ` + updateData.reminder;
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
                    ans+= i+1 + "  " + doc[i]._id + "  " + doc[i].reminder + `\n`;
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
              ans = "Object Id = " + doc[0]._id + `\n Time : `+ doc[0].message.date + " " + doc[0].message.time + " " + doc[0].message.isAM + `\n Message : ` + doc[0].reminder 
            //   console.log(ans)
            }
             return await Promise.resolve(ans);
        }
        
     }else if(keyWords[0]==".run"){
        //  console.log(data.Body)
        let lang=data.Body.split(" ")[1];

        let s=5+lang.length;
        while(data.Body[s]==" "||data.Body[s]=="\n"||data.Body[s]=="\r"){
            s++;
        }
        // console.log(lang)
        let sourceCode=data.Body.slice(s);
        // console.log(sourceCode);
        return await Promise.resolve(callApi(sourceCode,lang));
     }

     else if (keyWords[0]==".cp") {
        // const left_limit = addDays(Date(), -90);
        // const left_arr = [
        //   left_limit.getFullYear(),
        //   left_limit.getMonth() + 1,
        //   (left_limit.getDay() % 26) + 1,
        // ];
        // const left_date = "2021-12-27T00:00:00";
        // const resource__id = 2;
        // // console.log(left_date)
        // const URI2 = `https://clist.by/api/v1/contest/?username=geekyadi&api_key=17ee2e7ce4591d218803d47651e181564cffcd54&resource__id=2&start__gte=2021-12-27T00:00:00&order_by=start&duration__lt=999999`;
        
        // axios.get(URI2)
        // .then((response) => {
        //     console.log(response)
        // }).catch((error) => {
        //     // error.message is the error message
        //    console.log(error)
        //   });

        //  if(keyWords[1]=="furure") {

        //  }
        if(keyWords[1]=="profile"){
            const handle= keyWords[3]
            let response = await fetch(`http://localhost:3000/account/?handle__regex=${handle}&resource_id=${resource_id(keyWords[2])}`)
            let acc = await response.json()
            console.log(acc.objects[0])
            // console.log(acc.objects[0])
            // for(i=0;i<acc.)
            // console.log(ans)

            var ans = ""
            var res = JSON.stringify(acc.objects[0]).split(',')
            for(i=0;i<res.length;i++){
                ans=`${res} \n`
            }
            return await Promise.resolve(ans)

        // let hanlde= keyWords[2]
        }
        else if (keyWords[1]=="contest"){
            if(keyWords[3]=="future") {
            var currentdate = new Date(); 
            var datetime = currentdate.getFullYear() + "-" 
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getDate() + "T"
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
            
                let response = await fetch(`http://localhost:3000/contest/?resource_id=${resource_id(keyWords[2])}&start__gte=${datetime}&order_by=start&duration__lt=999999`)
                let contest = await response.json()
                console.log(contest.objects)
            }
            // console.log(datetime)
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