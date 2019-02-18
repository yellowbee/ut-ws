/**
 * Created by bhuang on 4/19/18.
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TesterSchema = new Schema(
  {
    uuid: String,
    name: String,
    industry: String,
    size: String,
    mobile: String,
    code: String,
    desc: String
  },
  { collection: "testers" }
);

const Tester = mongoose.model("Tester", TesterSchema);
module.exports = Tester;
