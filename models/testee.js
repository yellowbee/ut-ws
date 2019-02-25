/**
 * Created by bhuang on 01/01/19.
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TesteeSchema = new Schema(
  {
    uuid: String,
    name: String,
    age: String,
    sex: String,
    industry: String,
    edu: String,
    mobile: String
  },
  { collection: "testees" }
);

const Testee = mongoose.model("Testee", TesteeSchema);
module.exports = Testee;
