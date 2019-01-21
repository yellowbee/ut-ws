/**
 * Created by bhuang on 12/4/17.
 */

let jwt = require("jsonwebtoken");
const Tester = require("../models/tester");
//const querystring = require("querystring");
const config = require("../config/config");
const axios = require("axios");

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
              value: token
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
                  value: token
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
          res.json({ token: genToken({ phone: tester.phone }) });
        } else {
          res.json({ result: "no such phone number found" });
        }
      });
    }
  },

  // fetch wechat user's openid and login session
  wsCodeToSession: function(req, res) {
    if (req.params.code) {
      //var d=that.globalData;//这里存储了appid、secret、token串
      let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${
        config.config.user_pool.app_id
      }&secret=${config.config.user_pool.app_secret}&js_code=${
        req.params.code
      }&grant_type=authorization_code`;
      console.log(url);
      axios
        .get(url)
        .then(function(response) {
          res.json({res: response.data})
        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      res.json({ message: "code is missing" });
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
      exp: Math.floor(Date.now() / 1000) + 60 * 60
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
