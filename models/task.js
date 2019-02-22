/**
 * Created by bhuang on 01/09/19.
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema(
  {
    poster_uuid: String,
    name: String,
    desc: String,
    age: String,
    sex: String,
    industry: String,
    edu: String,
    payType: String,
    payDesc: String,
    mobile: String
  },
  { collection: "tasks" }
);

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
