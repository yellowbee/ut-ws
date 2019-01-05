/**
 * z-score 风险值
 * Created by bhuang on 2018/12/3.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ZSCOREchema = new Schema(
  {
    code: String,
    date: [String],
    val: [Number]
  },
  { collection: "z-score" }
);

const ZSCORE = mongoose.model("ZSCORE", ZSCOREchema);
module.exports = ZSCORE;