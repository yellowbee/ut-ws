/**
 * CFPS schema for A share companies starting from 1990.
 * Created by bhuang on 2018/9/9.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CFPSSchema = new Schema(
    {
        code: String,
        date: [String],
        val: [Number]
    },
    { collection: "cfps" }
);

const CFPS = mongoose.model("CFPS", CFPSSchema);
module.exports = CFPS;