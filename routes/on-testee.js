/**
 * Created by bhuang on 12/4/17.
 */

let jwt = require("jsonwebtoken");
const Testee = require("../models/testee");
const User = require("../models/user");
const Profile = require("../models/profile");
const querystring = require("querystring");

let _ = require("lodash");
let uuid = require("uuid");

let service = {
  create: function(req, res) {
    if (_.isEmpty(req.body)) {
      res.json({ result: "REQUEST IGNORED" });
    } else {
      let newTestee = req.body;
      //data.push(newTestee); // Spoof a DB call
      //res.json(newTestee);
      Testee.find({ phone: newTestee.phone }, (err, testees) => {
        if (err) {
          res.json({ result: err });
        }
        if (testees.length > 0) {
          console.log(testees);
          res.json({ result: "phone number is not available" });
        } else {
          let token = genToken(newTestee);

          const testee = new Testee({
            name: newTestee.name,
            dob: newTestee.dob,
            sex: newTestee.sex,
            industry: newTestee.industry,
            price: newTestee.price,
            phone: newTestee.phone,
            wechat: newTestee.wechat,
            desc: newTestee.desc,
            token: {
              value: token,
              expires: -1
            }
          });

          testee.save((err, obj) => {
            if (err) {
              res.json({ result: err });
            } else {
              res.json({
                testee: {
                  name: newTestee.name
                },
                token: {
                  value: token,
                  expires: -1
                }
              });
            }
          });
        }
      });
    }
  },

  login: function(req, res) {
    if (_.isEmpty(req.body)) {
      res.json({ result: "REQUEST IGNORED" });
    } else {
      let testee = req.body;
      Testee.find({ phone: testee.phone }, (err, testees) => {
        if (err) {
          res.json({ result: err });
        }
        if (testees.length > 0) {
          res.json({ token: genToken({phone: testee.phone}) });
        } else {
          res.json({ result: "no such phone number found"})
        }
      });
    }
  },

  renew: function(req, res) {
    let token = req.params.token;
    let decoded = jwt.decode(token, require("../config/secret")());
    console.log(decoded);

    if (decoded && decoded.userName) {
      User.findOne({ userName: decoded.userName }, (err, user) => {
        if (err || !user) {
          res.json({ result: null });
        } else {
          Profile.findOne({ userName: user.userName }, (err, profile) => {
            if (err || !profile) {
              res.json({
                userName: user.userName,
                fullName: user.fullName,
                token: user.token.value
              });
            } else {
              res.json({
                userName: user.userName,
                fullName: user.fullName,
                token: user.token.value,
                avatar: profile.basicInfo.profileIcon.imgUrl
              });
            }
          });
        }
      });
    } else {
      res.json({ result: null });
    }
  }
};

let genToken = function(obj) {
  //let expires = expiresIn(7); // 7 days
  /*let token = jwt.encode({
     exp: expires
     }, require('../config/secret')());*/
  let token = jwt.sign(
    {
      name: obj.name,
      phone: obj.phone,
      exp: Math.floor(Date.now() / 1000) + (60 * 60)
    },
    require("../config/secret")()
  );

  return token;
  /*return {
    token: {
        value: token,
        expires: Date.now() + 7 * 24 * 3600 * 1000
    },
    user: {
      fullName: user.fullName,
      username: user.username
    }
  };*/
};

module.exports = service;
