// external packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
require('dotenv').config();

// Start the webapp
const webApp = express();

// Webapp settings
const url = process.env.DB_URL

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

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
    res.send(`Sam Is God`);
});

const WA = require('../lib/whatsapp-send-message');
const Compute = require("../lib/language")
// Route for WhatsApp
webApp.post('/whatsapp', async (req, res) => {
    console.log(req.body)
    await Compute.process(req.body).then(async (message)=>{
        await WA.sendMessage(message,req.body.From);
    })

});

// Start the server
webApp.listen(PORT, () => {
    console.log(`Server is up and running at ${PORT}`);
});