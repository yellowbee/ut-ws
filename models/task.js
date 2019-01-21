/**
 * Created by bhuang on 01/09/19.
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema(
  {
    desc: String,
    dob: Number,
    industry: String,
    openid: String,
    phone: String,
    price: Number,
    sex: String,
    title: String,
    wechat: String,
  },
  { collection: "tasks" }
);

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
