// external packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
require('dotenv').config();
const path=require('path')
const {DB_URL}=require('../config/keys')
// Start the webapp
const schedular=require('../middleware/schedular')
schedular()
const webApp = express();
const WA = require('../lib/whatsapp-send-message');
const Compute = require("../lib/language")
// Webapp settings
webApp.set('views', path.join(__dirname, '../views'))
webApp.set('view engine', 'ejs')

const public=path.join(__dirname,'../public')
webApp.use(express.static(public))

const assets=path.join(__dirname,'../assets')
webApp.use(express.static(assets))
const url = DB_URL
const youtubeApi= process.env.youtubeApi
const axios = require("axios");

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

const apiKey = `username=${process.env.USER_NAME}&api_key=${process.env.API_KEY}`;
// console.log(apiKey);

mongoose.connect(url, connectionParams)
    .then(() => {
       console.log("connected to database ")
    })
    .catch((err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })


webApp.use(bodyParser.urlencoded({
    extended: true
}));
webApp.use(bodyParser.json());

// Server Port
const PORT = process.env.PORT;

const User=require('../model/user')
// Home route
webApp.get('/', (req, res) => {
    res.render('contributors');
});

// Route for WhatsApp
webApp.post('/whatsapp', async (req, res) => {
    console.log(req.body)
    await Compute.process(req.body).then(async (message)=>{
        if(typeof message=='string'){
            await WA.sendMessage(message,req.body.From);
            
        }else{
            for(let i=0;i<message.length;i++){
                messageToSend=message[i].work+"\n"+message[i].command+"\n\n"+message[i].helpingCommand +"(Helping Command)";
                await WA.sendMessage(messageToSend,req.body.From);
            }
           
        }
           
      
    })

});

// Start the server
webApp.listen(PORT, () => {
    console.log(`Server is up and running at ${PORT}`);
});

webApp.get("/resource*", (req, res) => {
    axios
      .get(
        `https://clist.by:443/api/v1/json/resource/?id=${req.query.id}&${apiKey}`
      )
      .then((response) => {
        // console.log(`statusCode: ${res.statusCode}`);
        // console.log(response);
        res.send(response.data);
      })
      .catch((error) => {
        console.error(error);
        res.send("Server is 404");
      });
  });
  
  webApp.get("/contest*", (req, res) => {
    axios
      .get(
        `https://clist.by:443/api/v2/contest/?resource_id=${req.query.resource_id}&${req.query.date}&order_by=${req.query.order_by}&${apiKey}`
      )
      .then((response) => {
        // console.log(req.query, "HIIIIIIIIIIIIIIIIIIIIIIII");
        // console.log(`statusCode: ${res.statusCode}`);
        // console.log(response);
        res.send(response.data);
      })
      .catch((error) => {
        // console.error(error);
        res.send("Server is 404");
      });
  });
  webApp.get("/youtube*", (req, res) => {
    axios
      .get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${req.query.maxResults}&key=${youtubeApi}&type=video&q=${req.query.q}`
      )
      .then((response) => {
        // console.log(req.query, "HIIIIIIIIIIIIIIIIIIIIIIII");
        // console.log(`statusCode: ${res.statusCode}`);
        // console.log(response);
        res.send(response.data);
      })
      .catch((error) => {
        // console.error(error);
        res.send("Server is 404");
      });
  });
  webApp.get("/account*", (req, res) => {
    axios
      .get(
        `https://clist.by:443/api/v2/json/account/?handle__regex=${req.query.handle__regex}&&resource_id=${req.query.resource_id}&${apiKey}`
      )
      .then((response) => {
        // console.log(req.query, "HIIIIIIIIIIIIIIIIIIIIIIII");
        // console.log(`statusCode: ${res.statusCode}`);
        // console.log(response);
        res.send(response.data);
      })
      .catch((error) => {
        // console.error(error);
        res.send("Server is 404");
      });
  });