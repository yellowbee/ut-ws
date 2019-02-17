/**
 * Created by bhuang on 12/4/17.
 */

let jwt = require("jsonwebtoken");
const Tester = require("../models/tester");
const Task = require("../models/task");
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
          res.json({success: false, errorCode: '0001'});
        } else {
          let token = genToken(newTester);

          const tester = new Tester({
            name: newTester.name,
            industry: newTester.industry,
            size: newTester.size,
            phone: newTester.phone,
            code: newTester.code,
            token: {
              value: token
            }
          });

          tester.save((err, obj) => {
            if (err) {
              res.json({success: false, errorCode: '0002', result: err });
            } else {
              res.json({
                success: true,
                tester: {
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
      axios
        .get(url)
        .then(function(response) {
          res.json({ res: response.data });
        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      res.json({ message: "code is missing" });
    }
  },

  addTask: function(req, res) {
    if (_.isEmpty(req.body)) {
      res.json({ message: "request body cannot be empty" });
    } else {
      let newTask = req.body;
      const task = new Task({
        desc: newTask.desc,
        dob: newTask.dob,
        edu: newTask.edu,
        industry: newTask.industry,
        openid: newTask.openid,
        phone: newTask.phone,
        price: newTask.price,
        sex: newTask.sex,
        title: newTask.title,
        wechat: newTask.wechat
      });

      task.save((err, obj) => {
        if (err) {
          res.json({ result: err });
        } else {
          res.json({ message: "New task saved!" });
        }
      });
    }
  },

  deleteTaskById: function(req, res) {
    Task.findByIdAndRemove(req.params._id, (err, task) => {
      // As always, handle any potential errors:
      if (err) {
        res.json({err: err});
      } else {
        // We'll create a simple object to send back with a message and the id of the document that was removed
        // You can really do this however you want, though.
        res.json({ message: `task with id ${task._id} deleted!` });
      }
    });
  },

  // get all tasks posted by a specific wechat openid
  getTasksByWxOpenid(req, res) {
    Task.find({ openid: req.params.openid }, (err, tasks) => {
      if (err) {
        res.json({ result: err });
      } else {
        res.json(tasks);
      }
    });
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
