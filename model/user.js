const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String },
  Heap: { type:String, default: "$date : 2021-11-11T16:16:00Z"},
  message: {
    process: { type: String },
    operation: { type: String },
    cust_message: { type: String },
    date: {
      day: { type: Number },
      month: { type: Number },
      year: { type: Number },
    },
    time: {
      first: { type: Number },
      second: { type: Number },
      isAM: { type: String },
    },
  },
  country: { type: String, default: "+91" },
  isDone: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
