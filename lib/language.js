const syntaxUpdate =
  "update reminder 5/10/2021 5:00 am <id_you_want_to_delete>";
const syntaxDelete = ".del <id_you_want_to_delete>";
const syntaxRead = ".read -a";
const syntaxCreate = ".cre rem mm/dd/yyyy hh:mm AM -mes '<message>'";
const syntaxYoutube = ".ytb <search key> <numbers of results>";
const tConvert = require("../utils/convertTime")
let { table } = require("table");
const languageCodes = [
  ["*Language*", "*Code*"],
  ["C", "c"],
  ["C++", "cpp17"],
  ["Python2", "python2"],
  ["Python3", "python3"],
  ["Java", "java"],
  ["Nodejs", "nodejs"],
  ["SQL", "sql"],
  ["Perl", "perl"],
  ["C#", "csharp"],
]; // add languages here
const runCode = `.run <language>\n<code>`;
const User = require("../model/user");
const WA = require("../lib/whatsapp-send-message");
const fetch = require("node-fetch");
const _ = require("lodash");
const callApi = require("../middleware/compiler");
// const axios = require("axios");
const resource_id = require("../middleware/resource");
const getDate = require("../utils/getDate");

const Json2Array = require("../utils/Json2Array");
let help = [
  {
    work: "*Create reminder*",
    command: syntaxCreate,
    helpingCommand: ".create ?",
  },
  {
    work: "*Youtube search*",
    command: syntaxYoutube,
    helpingCommand: ".ytb ?",
  },
  { work: "*Compile Code*", command: runCode, helpingCommand: ".run ?" },
  {
    work: "*Read reminders and Id*",
    command: syntaxRead,
    helpingCommand: ".read ?",
  },
  {
    work: "*Update reminder*",
    command: syntaxUpdate,
    helpingCommand: ".update ?",
  },
  {
    work: "*Delete Reminder*",
    command: syntaxDelete,
    helpingCommand: ".delete ?",
  },
];
const check = (message) => {
  return true;
};

// function json2array(json){
//     var result = [];
//     var keys = Object.keys(json);
//     keys.forEach(function(key){
//         result.push(json[key]);
//     });
//     return result;
// }

require("dotenv").config();
// var youtubeApi=process.env.USER_NAME
const process = async (data) => {
  try {
    if (!check(data.body)) return await Promise.resolve("command syntax wrong");
    let keyWords = data.Body.split(" ");
    if (data.Body == ".help") {
      return await Promise.resolve(help);
    } else if (data.Body == ".create ?") {
      return await Promise.resolve(syntaxCreate);
    } else if (data.Body == ".update ?") {
      return await Promise.resolve(syntaxUpdate);
    } else if (data.Body == ".delete ?") {
      return await Promise.resolve(syntaxDelete);
    } else if (data.Body == ".read ?") {
      return await Promise.resolve(syntaxRead);
    } else if (data.Body == ".youtube ?") {
      return await Promise.resolve(syntaxYoutube);
    } else if (data.Body == ".lang ?") {
      return await Promise.resolve(table(languageCodes));
    } else if (data.Body == ".run ?") {
      return await Promise.resolve(runCode);
    } else if (keyWords[0] == ".cre") {
      //case sensitive
      let message = ""
      let remDate=""
      let remTime="" 
      let remisAM=""
      if(keyWords[2]=="contest"){
        var date=getDate("future").date
        let response = await fetch(`http://localhost:30000/contest?resource_id=${resource_id(keyWords[3])}&order_by=start&date=${date}`)
        let contest = await response.json()
        console.log(contest.objects)
        for (i = 0; i < contest.objects.length; i++) {
            if(contest.objects[i].id==keyWords[4]){
                const split = contest.objects[i].start.split(`-`)
                const splitDate = split[2].split("T")
                const time = tConvert(splitDate[1])
                // console.log(time)
                message=contest.objects[i].event
                remDate=`${split[1]}/${splitDate[0]}/${split[0]}`
                remTime = time.split(" ")[0]
                remisAM = time.split(" ")[1]
                // console.log(remDate)
                // remDate=`${(contest.objects[i].start).slice()}`
            }
            // ans[i] = `*${contest.objects[i].event}* \n Start: ${contest.objects[i].start} \n End: ${contest.objects[i].end} \n Status: ${status} \n Link: ${contest.objects[i].href} \n Contest ID: ${contest.objects[i].id}`;
            // await WA.sendMessage(ans[i], data.From);
            
          }
        // console.log((res))
      }
      else {
        let cre = data.Body.split(" -mes ");
        message = cre[1];
        remDate = keyWords[2]
        remTime = keyWords[3]
        remisAM = keyWords[4]
      }
      //    await saveData.save();
      //    console.log(keyWords)
      var saveData = new User({
        username: data.From,
        message: {
          process: keyWords[0],
          operation: keyWords[1],
          date: remDate,
          time: remTime,
          isAM: remisAM,
        },
        reminder: message,
        country: "india",
        isDone: false,
      })
      // saveData.save()
      console.log(saveData)
      ans =
        "Remainder Created" +
        `\n` +
        "Object Id = " +
        saveData._id +
        `\n Time : ` +
        saveData.message.date +
        " " +
        saveData.message.time +
        " " +
        saveData.message.isAM +
        `\n Message : ` +
        saveData.reminder;
      const check = await saveData.check();
      if (check != "success") ans = check;
      return await Promise.resolve(ans);

    } else if (keyWords[0] == ".ytb") {
      let ans = ""
      if (keyWords[1]=="?"){
        ans+=".ytb <search key> <numbers of results>"
      }
      else 
      {
        let len = keyWords.length;
      let temp = keyWords;
      const search = temp.slice(1, len - 1).join("+");
      // console.log(search)
      let maxResults = keyWords[len - 1];
      const url = `http://134.209.156.120:30000/youtube/?part=snippet&maxResults=${maxResults}&type=video&q=${search}`;

      let result = await fetch(url);
      let res = await result.json();

      let video_URLS = "";
      let cnt = 0;
      res.items.forEach((item) => {
        video_URLS =
          video_URLS +
          `${cnt}. https://www.youtube.com/watch?v=${item.id.videoId}`;
        video_URLS = video_URLS + "\n\n";
        cnt = cnt + 1;
        });

      ans=ans+video_URLS
      }
      return await Promise.resolve(ans);
    } else if (keyWords[0] == ".upd") {
      //case sensitive
      let cre = data.Body.split(" -mes ");
      let message = cre[1];
      var updateData = {
        username: data.From,
        message: {
          date: keyWords[2],
          time: keyWords[3],
          isAM: keyWords[4],
        },
        reminder: message,
      };
      let doc = await User.findOneAndUpdate({ _id: keyWords[1] }, updateData);
      let ans;
      if (_.isEmpty(doc)) {
        ans = "no entry found with id  : " + keyWords[5];
      } else {
        ans =
          "Remainder Updated" +
          `\n` +
          "Object Id = " +
          doc._id +
          `\n Time : ` +
          updateData.message.date +
          " " +
          updateData.message.time +
          " " +
          updateData.message.isAM +
          `\n Message : ` +
          updateData.reminder;
      }
      return await Promise.resolve(ans);
    } else if (keyWords[0] == ".del") {
      //case sensitive
      let doc = await User.findOneAndRemove({ _id: keyWords[1] });
      let ans;
      if (_.isEmpty(doc)) {
        ans = "no entry found with id  : " + keyWords[5];
      } else {
        ans = "Remainder with id: " + doc._id + " successful";
      }
      return await Promise.resolve(ans);
    } else if (keyWords[0] == ".read") {
      //case sensitive
      if (keyWords[1] == "-a") {
        let doc = await User.find({ username: data.From });
        let ans;
        if (_.isEmpty(doc)) {
          ans = "no entry found";
        } else {
          ans = "";
          for (var i = 0; i < doc.length; ++i) {
            ans += i + 1 + "  " + doc[i]._id + "  " + doc[i].reminder + `\n`;
            // console.log(ans)
          }
        }
        return await Promise.resolve(ans);
      } else {
        let doc = await User.find({ _id: keyWords[1] });
        let ans;
        if (_.isEmpty(doc)) {
          ans = "no entry found";
        } else {
          ans =
            "Object Id = " +
            doc[0]._id +
            `\n Time : ` +
            doc[0].message.date +
            " " +
            doc[0].message.time +
            " " +
            doc[0].message.isAM +
            `\n Message : ` +
            doc[0].reminder;
          //   console.log(ans)
        }
        return await Promise.resolve(ans);
      }
    } else if (keyWords[0] == ".run") {
      //  console.log(data.Body)
      let lang = data.Body.split(" ")[1];

      let s = 5 + lang.length;
      while (
        data.Body[s] == " " ||
        data.Body[s] == "\n" ||
        data.Body[s] == "\r"
      ) {
        s++;
      }
      // console.log(lang)
      let sourceCode = data.Body.slice(s);
      // console.log(sourceCode);
      return await Promise.resolve(callApi(sourceCode, lang));
    } else if (keyWords[0] == ".cp") {
      if (keyWords[1] == "profile") {
        const handle = keyWords[3];
        let response = await fetch(
          `http://localhost:30000/account/?handle__regex=${handle}&resource_id=${resource_id(
            keyWords[2]
          )}`
        );
        let acc = await response.json();
        let ans = "";
        if (acc.objects[0] == null) {
          ans = "Account Not Found";
        } else {
          ans = Json2Array(acc.objects[0]);
        }
        return await Promise.resolve(ans);

        // let hanlde= keyWords[2]
      } else if (keyWords[1] == "contest") {
        var date = getDate(keyWords[3]).date;
        var status = getDate(keyWords[3]).status;
        console.log(date);
        let response = await fetch(
          `http://localhost:30000/contest?resource_id=${resource_id(
            keyWords[2]
          )}&order_by=start&date=${date}`
        );
        let contest = await response.json();
        var ans = [];
        // console.log(data.Body)
        for (i = 0; i < contest.objects.length; i++) {
          // var res = Json2Array(contest.objects[i])
          // console.log(contest.objects[i].event)
          ans[
            i
          ] = `*${contest.objects[i].event}* \n Start: ${contest.objects[i].start} \n End: ${contest.objects[i].end} \n Status: ${status} \n Link: ${contest.objects[i].href} \n Contest ID: ${contest.objects[i].id}`;
          await WA.sendMessage(ans[i], data.From);
        }
        return await Promise.resolve("😜");
      }
    } else {
      return await Promise.resolve("command not found");
    }
  } catch (error) {
    console.log(error);
    return await Promise.resolve("some error occured");
  }
};

module.exports = {
  process,
};
