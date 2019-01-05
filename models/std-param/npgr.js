/**
 * NPGR schema for A share companies starting from 1990.
 * Created by bhuang on 2018/9/9.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NPGRSchema = new Schema(
    {
        code: String,
        date: [String],
        val: [Number]
    },
    { collection: "npgr" }
);

const NPGR = mongoose.model("NPGR", NPGRSchema);
module.exports = NPGR;