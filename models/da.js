/**
 * DA为A股企业2000年-2016年年报的可操纵性应计，采用修正的琼斯模型估计。
 * 可操纵性应计的本质为企业应计项目中不能由应付应收项目、折旧等解释的部分。
 * 若可操纵性应计为正，表明企业存在向上的盈余管理，即虚增收入；若可操纵性应计为负，
 * 表明企业存在向下的盈余管理，即虚减收入。
 *
 * Schema for A-share company document.
 * Created by bhuang on 2018/8/22.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DASchema = new Schema(
    {
        code: String,
        date: [String],
        val: [Number]
    },
    { collection: "da" }
);

const DA = mongoose.model("DA", DASchema);
module.exports = DA;
