/**
 * Created by bhuang on 12/4/17.
 */

let jwt = require("jsonwebtoken");
const Tester = require("../models/tester");
const querystring = require("querystring");

let _ = require("lodash");
let uuid = require("uuid");

let service = {
  create: function(req, res) {
    if (_.isEmpty(req.body)) {
      res.json({ result: "REQUEST IGNORED" });
    } else {
      let newTester = req.body;
      Tester.find({ phone: newTester.phone }, (err, testers) => {
        if (err) {
          res.json({ result: err });
        }
        if (testers.length > 0) {
          console.log(testers);
          res.json({ result: "phone number is not available" });
        } else {
          let token = genToken(newTester);

          const tester = new Tester({
            name: newTester.name,
            industry: newTester.industry,
            price: newTester.price,
            phone: newTester.phone,
            desc: newTester.desc,
            token: {
              value: token,
            }
          });

          tester.save((err, obj) => {
            if (err) {
              res.json({ result: err });
            } else {
              res.json({
                testee: {
                  name: newTester.name,
                  phone: newTester.phone
                },
                token: {
                  value: token,
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
      let tester = req.body;
      Tester.find({ phone: tester.phone }, (err, testers) => {
        if (err) {
          res.json({ result: err });
        }
        if (testers.length > 0) {
          res.json({ token: genToken({phone: tester.phone}) });
        } else {
          res.json({ result: "no such phone number found"})
        }
      });
    }
  },

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
