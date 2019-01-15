/**
 * Created by bhuang on 4/19/18.
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TesterSchema = new Schema(
  {
    name: String,
    industry: String,
    size: Number,
    price: Number,
    phone: String,
    desc: String
  },
  { collection: "testers" }
);

const Tester = mongoose.model("Tester", TesterSchema);
module.exports = Tester;
