/**
 * Created by bhuang on 12/4/17.
 */

let jwt = require("jsonwebtoken");
const Tester = require("../models/tester");
const Task = require("../models/task");
//const querystring = require("querystring");
const config = require("../config/config");
const axios = require("axios");
const uuidv4 = require("uuid/v4");
const redisClient = require("../common/redis-client");

let _ = require("lodash");

let service = {
  create: function(req, res) {
    if (_.isEmpty(req.body)) {
      res.json({ result: "REQUEST IGNORED" });
    } else {
      let newTester = req.body;
      Tester.find({ mobile: newTester.mobile }, (err, testers) => {
        if (err) {
          res.json({ result: err });
        }
        if (testers.length > 0) {
          res.json({ success: false, errorCode: "0001" });
        } else {
          redisClient.get(newTester.mobile, function(err, reply) {
            console.log(`redis get reply: ${reply}`);

            if (err) {
              res.json({ success: false, errorCode: "0006" });
            } else if (!reply || reply !== newTester.code) {
              //code mismatches
              res.json({ success: false, errorCode: "0005" });
            } else {
              // code verified

              let token = genToken(newTester);
              let uuid = uuidv4();

              const tester = new Tester({
                uuid,
                name: newTester.name,
                industry: newTester.industry,
                size: newTester.size,
                mobile: newTester.mobile,
                token: {
                  value: token
                }
              });

              tester.save((err, obj) => {
                if (err) {
                  res.json({ success: false, errorCode: "0002", result: err });
                } else {
                  res.json({
                    success: true,
                    tester: {
                      uuid: obj.uuid,
                      name: obj.name,
                      mobile: obj.mobile
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
      });
    }
  },

  login: function(req, res) {
    if (_.isEmpty(req.body)) {
      res.json({ result: "REQUEST IGNORED" });
    } else {
      let tester = req.body;
      Tester.find({ mobile: tester.mobile }, (err, testers) => {
        if (err) {
          res.json({ result: err });
        }
        if (testers.length > 0) {
          res.json({
            success: true,
            uuid: testers[0].uuid,
            token: genToken({ mobile: tester.mobile })
          });
        } else {
          res.json({ success: false, errorCode: "0003" });
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
        mobile: newTask.mobile,
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
        res.json({ err: err });
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
      mobile: obj.mobile,
      exp: Math.floor(Date.now() / 1000) + 60 * 60
    },
    config.config.user_pool.token_secret
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
