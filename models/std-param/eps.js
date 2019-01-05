/**
 * EPS schema for A share companies starting from 1990.
 * Created by bhuang on 2018/9/9.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EPSSchema = new Schema(
    {
        code: String,
        date: [String],
        val: [Number]
    },
    { collection: "eps" }
);

const EPS = mongoose.model("EPS", EPSSchema);
module.exports = EPS;