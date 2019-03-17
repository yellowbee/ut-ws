/**
 * Created by bhuang on 12/4/17.
 */

const Tester = require("../models/tester");
const Task = require("../models/task");
//const querystring = require("querystring");
const uuidv4 = require("uuid/v4");
const redisClient = require("../common/redis-client");
const jwt = require("../common/jwt");

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

              let token = jwt.genToken(newTester);
              let uuid = uuidv4();

              const tester = new Tester({
                uuid,
                activated: false,
                name: newTester.name,
                industry: newTester.industry,
                size: newTester.size,
                mobile: newTester.mobile,
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
          redisClient.get(tester.mobile, function(err, reply) {
            console.log(`redis get reply: ${reply}`);

            if (err) {
              res.json({ success: false, errorCode: "0006" });
            } else if (!reply || reply !== tester.code) {
              //code mismatches
              res.json({ success: false, errorCode: "0005" });
            } else {
              // code verified
              res.json({
                success: true,
                uuid: testers[0].uuid,
                activated: testers[0].activated,
                token: jwt.genToken({ mobile: tester.mobile })
              });
            }
          });
        } else {
          res.json({ success: false, errorCode: "0003" });
        }
      });
    }
  },

  addTask: function(req, res) {
    if (_.isEmpty(req.body)) {
      res.json({ message: "request body cannot be empty" });
    } else {
      let { poster_uuid, name, desc, age, sex, industry, edu, payType, payDesc, mobile } = req.body;
      const task = new Task({
        poster_uuid,
        name,
        desc,
        age,
        sex,
        industry,
        edu,
        payType,
        payDesc,
        mobile
      });

      task.save((err, obj) => {
        if (err) {
          res.json({ success: false, message: err });
        } else {
          res.json({ success: true });
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
  getTasksByPosterUuid(req, res) {
    Task.find({ poster_uuid: req.params.poster_uuid }, (err, tasks) => {
      if (err) {
        res.json({success: false, result: err });
      } else {
        res.json({success: true, tasks});
      }
    });
  }
};

module.exports = service;
