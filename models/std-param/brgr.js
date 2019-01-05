/**
 * BRGR schema for A share companies starting from 1990.
 * Created by bhuang on 2018/9/9.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BRGRSchema = new Schema(
    {
        code: String,
        date: [String],
        val: [Number]
    },
    { collection: "brgr" }
);

const BRGR = mongoose.model("BRGR", BRGRSchema);
module.exports = BRGR;