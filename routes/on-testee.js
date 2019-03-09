/**
 * Created by bhuang on 12/4/17.
 */

const Testee = require("../models/testee");
const User = require("../models/user");
const Profile = require("../models/profile");
const config = require("../config/config");
const redisClient = require("../common/redis-client");
const jwt = require("../common/jwt");

const _ = require("lodash");
const uuidv4 = require("uuid/v4");

let service = {
  create: function(req, res) {
    if (_.isEmpty(req.body)) {
      res.json({ result: "REQUEST IGNORED" });
    } else {
      let newTestee = req.body;
      Testee.find({ mobile: newTestee.mobile }, (err, testees) => {
        if (err) {
          res.json({ result: err });
        }
        if (testees.length > 0) {
          res.json({ success: false, errorCode: "0001" });
        } else {
          redisClient.get(newTestee.mobile, function(err, reply) {
            if (err) {
              res.json({ success: false, errorCode: "0006" });
            } else if (!reply || reply !== newTestee.code) {
              //code mismatches
              res.json({ success: false, errorCode: "0005" });
            } else {
              // code verified
              let token = jwt.genToken(newTestee);
              let uuid = uuidv4();

              const testee = new Testee({
                uuid,
                name: newTestee.name,
                age: newTestee.age,
                sex: newTestee.sex,
                industry: newTestee.industry,
                edu: newTestee.edu,
                mobile: newTestee.mobile
              });

              testee.save((err, obj) => {
                if (err) {
                  res.json({ success: false, errorCode: "0002", result: err });
                } else {
                  res.json({
                    success: true,
                    testee: {
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
      let testee = req.body;
      Testee.find({ mobile: testee.mobile }, (err, testees) => {
        if (err) {
          res.json({ result: err });
        }
        if (testees.length > 0) {
          redisClient.get(testee.mobile, function(err, reply) {
            if (err) {
              res.json({ success: false, errorCode: "0006" });
            } else if (!reply || reply !== testee.code) {
              //code mismatches
              res.json({ success: false, errorCode: "0005" });
            } else {
              // code verified
              res.json({
                success: true,
                uuid: testees[0].uuid,
                token: jwt.genToken({ mobile: testee.mobile })
              });
            }
          });
        } else {
          res.json({ success: false, errorCode: "0003" });
        }
      });
    }
  },

  renew: function(req, res) {
    let token = req.params.token;
    let decoded = jwt.decode(token, config.config.user_pool.token_secret);
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
  },

  getTesteesByIndustry: function(req, res) {
    console.log(req.body.industry);
    Testee.find({ industry: req.body.industry }, (err, testees) => {
      if (err) {
        res.json({ result: err });
      } else {
        res.json(testees);
      }
    });
  },

  getTesteeByUuid: function(req, res) {
    Testee.find({ uuid: req.params.uuid }, {'_id': 0, 'uuid': 0, '__v': 0}, (err, testees) => {
      if (err) {
        res.json({ success: false, message: err });
      } else {
        res.json({ success: true, testee: testees[0] });
      }
    });
  },

  updateTesteeByUuid: function(req, res) {
    let { age, desc, edu, industry, mobile, name, payDesc, payType, sex, role, wechat, uuid } = req.body;
    var update = { age, desc, edu, industry, mobile, name, payDesc, payType, sex, role, wechat };

    Testee.findOneAndUpdate({
      uuid: uuid
    }, {$set: { age, desc, edu, industry, mobile, name, payDesc, payType, sex, role, wechat }}, {
      overwrite: true // works if you comment this out
    }, function(err, testee) {
      if (err) {
        res.json({ success: false });
      } else if (!testee) {
        res.json({ success: false, message: "No testee with uuid found." })
      } else {
        res.json({ success: true })
      }
    });
  }
};

module.exports = service;
