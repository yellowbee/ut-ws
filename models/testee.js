/**
 * Created by bhuang on 01/01/19.
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TesteeSchema = new Schema(
  {
    age: String,
    desc: String,
    edu: String,
    industry: String,
    mobile: String,
    name: String,
    payDesc: String,
    payType: String,
    role: String,
    sex: String,
    signupDate: { type: Date, default: Date.now() },
    uuid: String,
    wechat: String
  },
  { collection: "testees" }
);

const Testee = mongoose.model("Testee", TesteeSchema);
module.exports = Testee;
