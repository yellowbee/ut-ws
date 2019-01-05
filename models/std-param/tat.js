/**
 * TAT 总资产周转率 schema for A share companies starting from 1990.
 * Created by bhuang on 2018/11/22.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TATSchema = new Schema(
  {
    code: String,
    date: [String],
    val: [Number]
  },
  { collection: "tat" }
);

const TAT = mongoose.model("TAT", TATSchema);
module.exports = TAT;