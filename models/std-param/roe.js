/**
 * ROE schema for A share companies starting from 1990.
 * Created by bhuang on 8/1/18.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ROESchema = new Schema(
    {
        code: String,
        date: [String],
        val: [Number]
    },
    { collection: "roe" }
);

const ROE = mongoose.model("ROE", ROESchema);
module.exports = ROE;