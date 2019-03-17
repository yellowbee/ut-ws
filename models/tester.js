/**
 * Created by bhuang on 4/19/18.
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TesterSchema = new Schema(
  {
    activated: Boolean,
    code: String,
    desc: String,
    industry: String,
    mobile: String,
    name: String,
    size: String,
    uuid: String
  },
  { collection: "testers" }
);

const Tester = mongoose.model("Tester", TesterSchema);
module.exports = Tester;
