// external packages

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const { DB_URL } = require("../config/keys");
const cron = require("node-cron");

// Start the webapp

const webApp = express();

// Webapp settings

const url = process.env.DB_URL;

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(url, connectionParams)
  .then(() => {
    console.log("connected to database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });

webApp.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

webApp.use(bodyParser.json());

// Server Port
const PORT = process.env.PORT;

const User = require("../model/user");
// Home route
webApp.get("/", (req, res) => {
  res.send(`Sam Is God`);
});

const WA = require("../lib/whatsapp-send-message");
const Compute = require("../lib/language");

// Route for WhatsApp

const pq = require("../lib/remQue"); // priority queue for storing remainders

webApp.post("/whatsapp", async (req, res) => {
  // console.log(req.body)
  await Compute.process(req.body).then(async (message) => {
    if (message.status == "wait") {
      await WA.sendMessage(
        `You will be notified 15 minutes before the reminder and your id is ${message.id}`,
        req.body.From
      );
      // console.log(message);
      // console.log(message.id);
      var msg;
      User.findById(message.id, function (err, docs) {
        if (err) {
          console.log(err);
        }
        else {
            msg=docs.message.cust_message;
        }
      });

      await WA.sendMessage(message.message, req.body.From);
      console.log(pq);
      const task = cron.schedule(
        "*/2 * * * * *",
        async () => {
          const today = new Date();
          const rem = pq.peek();
          console.log(rem.toString());
          console.log(today.toString());
          const diff = (rem - today) / (1000 * 60);
          console.log(diff);
          // console.log('hello')
          if (diff <= 15) {
            pq.pop();
            console.log(msg);
            await WA.sendMessage(msg, req.body.From);
          }
          if (pq.empty()) task.stop();
        },
        {
          scheduled: true,
          timezone: "Asia/Kolkata",
        }
      );
    } else {
      await WA.sendMessage(message.message, req.body.From);
    }
  });
});

// var a = new Date(2022, 0, 1, 0, 0, 0, 0); // Current date now.
// var b = new Date(2022, 0, 1, 1, 0, 0, 0); // Start of 2010.
// var utc_a = new Date(a.toUTCString());
// var utc_b = new Date(b.toUTCString());
// var diff = (utc_b - utc_a);
// console.log(diff/(1000*60))
// const date1=new Date("2000-01-01 10:30 AM")
// const date2=new Date("2000-01-01 10:50 AM")
// const diff=date2-date1
// console.log(diff/(1000*60))
// Start the server

// const heap=require('../lib/remQue')
// heap.push(new Date("2000-01-01 10:50 AM"))
// heap.push(new Date("1999-01-01 10:30 AM"))
// console.log(heap.pop().toString())
// console.log(heap.pop().toString())

webApp.listen(PORT, () => {
  console.log(`Server is up and running at ${PORT}`);
});
