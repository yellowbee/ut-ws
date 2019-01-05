/**
 * BRGR schema for A share companies starting from 1990.
 * Created by bhuang on 2018/9/9.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OP2NIRSchema = new Schema(
  {
    code: String,
    date: [String],
    val: [Number]
  },
  { collection: "op2nir" }
);

const OP2NIR = mongoose.model("OP2NIR", OP2NIRSchema);
module.exports = OP2NIR;