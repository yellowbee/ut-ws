/**
 * ROA schema for A share companies starting from 1990.
 * Created by bhuang on 8/1/18.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ROASchema = new Schema(
    {
        code: String,
        date: [String],
        val: [Number]
    },
    { collection: "roa" }
);

const ROA = mongoose.model("ROA", ROASchema);
module.exports = ROA;