/**
 * Created by bhuang on 01/09/19.
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema(
  {
    title: String,
    dob: Number,
    sex: String,
    industry: String,
    price: Number,
    phone: String,
    wechat: String,
    desc: String
  },
  { collection: "tasks" }
);

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
