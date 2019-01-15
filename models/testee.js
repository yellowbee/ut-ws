/**
 * Created by bhuang on 01/01/19.
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TesteeSchema = new Schema(
  {
    name: String,
    dob: Number,
    sex: String,
    industry: String,
    price: Number,
    phone: String,
    wechat: String,
    desc: String
  },
  { collection: "testees" }
);

const Testee = mongoose.model("Testee", TesteeSchema);
module.exports = Testee;
