const ROA = require("../models/std-param/roa");
const ROE = require("../models/std-param/roe");
const EPS = require("../models/std-param/eps");
const CFPS = require("../models/std-param/cfps");
const BRGR = require("../models/std-param/brgr");
const NPGR = require("../models/std-param/npgr");
const TAT = require("../models/std-param/tat");
const TROI = require("../models/std-param/troi");
const OP2NIR = require("../models/std-param/op2nir");
const ZSCORE = require("../models/std-param/z_score");
const querystring = require("querystring");

const getParamByCompanies = (req, res, param) => {
  let codes = querystring.parse(req.params.codesstr).codes;
  console.log(codes);
  param.find(
    {
      code: { $in: codes }
    },
    { _id: 0 },
    (err, result) => {
      if (err) {
        res.json({ result: "Company of specified code not found" });
      } else {
        res.json(result);
      }
    }
  );
};

let service = {
  getRoesByCompanies: (req, res) => {
    getParamByCompanies(req, res, ROE);
  },

  getRoasByCompanies: (req, res) => {
    getParamByCompanies(req, res, ROA);
  },

  getEPSsByCompanies: (req, res) => {
    getParamByCompanies(req, res, EPS);
  },

  getCFPSsByCompanies: (req, res) => {
    getParamByCompanies(req, res, CFPS);
  },

  getBRGRsByCompanies: (req, res) => {
    getParamByCompanies(req, res, BRGR);
  },

  getNPGRsByCompanies: (req, res) => {
    getParamByCompanies(req, res, NPGR);
  },

  getTatsByCompanies: (req, res) => {
    getParamByCompanies(req, res, TAT);
  },

  getTroisByCompanies: (req, res) => {
    getParamByCompanies(req, res, TROI);
  },

  getOp2nirByCompanies: (req, res) => {
    getParamByCompanies(req, res, OP2NIR);
  },

  getZscoreByCompanies: (req, res) => {
    getParamByCompanies(req, res, ZSCORE);
  }
};

module.exports = service;
