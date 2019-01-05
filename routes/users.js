/**
 * Created by bhuang on 12/4/17.
 */

let jwt = require("jsonwebtoken");
const Project = require("../models/project");
const User = require("../models/user");
const Profile = require("../models/profile");
const ROE = require("../models/std-param/roe");
const DA = require("../models/da");
const IndexA = require("../models/share-index/indexA");
const querystring = require("querystring");

let cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "qurimage",
  api_key: "353191835766621",
  api_secret: "Fdd7RfWJ0h-JPhDN3NFP4AgFKTc"
});

let _ = require("lodash");
let uuid = require("uuid");

const Q_CATEGORY_PAID = "Q_CATEGORY_PAID";

let service = {
  create: function(req, res) {
    if (_.isEmpty(req.body)) {
      res.json({ result: "REQUEST IGNORED" });
    } else {
      let newuser = req.body;
      //data.push(newuser); // Spoof a DB call
      //res.json(newuser);
      User.find({ userName: newuser.userName }, (err, users) => {
        if (err) {
          res.json({ result: err });
        }
        if (users.length > 0) {
          console.log(users);
          res.json({ result: "username is not available" });
        } else {
          let token = genToken(newuser);

          const user = new User({
            fullName: newuser.fullName,
            userName: newuser.userName,
            password: newuser.password,
            token: {
              value: token,
              expires: Date.now() + 7 * 24 * 3600 * 1000
            }
          });

          user.save((err, obj) => {
            if (err) {
              res.json({ result: err });
            } else {
              res.json({
                user: {
                  fullName: newuser.fullName,
                  userName: newuser.userName
                },
                token: {
                  value: token,
                  expires: Date.now() + 7 * 24 * 3600 * 1000
                }
              });
            }
          });
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
  },

    getRoeByCompany: (req, res) => {
        ROE.findOne({code: req.params.code}, (err, roe) => {
            if (err) {
                res.json({result: "Company of specified code not found"});
            } else {
                res.json(roe);
            }
        });
    },

    getDAsByCompanies: (req, res) => {
        let codes = querystring.parse(req.params.codesstr).codes;
        DA.find({
            'code': {$in: codes}
        }, (err, das) => {
            if (err) {
                res.json({result: "Company of specified code not found"});
            } else {
                res.json(das);
            }
        });
    },

  getProjects: (req, res) => {
    Project.find({}, (err, projects) => {
      res.json(projects);
    });
  },

  getProjectsByUserName: (req, res) => {
    Project.find({ userName: req.params.userName }, (err, projects) => {
      if (err) {
        res.json({ result: null });
      } else {
        res.json(projects);
      }
    });
  },

  getProjectDetail: (req, res) => {
    /*Project.findById(id, (err, project) => {
      if (err) {
        res.json({});
      } else {
        res.json(project);
      }
    });*/

      Project.findById(req.params.id).
      populate('postedBy', 'basicInfo').
      exec((err, project) => {
          if (err) return handleError(err);
          console.log('The project is %s', project);
          // prints "The author is Ian Fleming"
          res.json(project);
      });

  },

  getProfile: (req, res) => {
    console.log(req.params.userName);
    Profile.find({ userName: req.params.userName }, (err, profiles) => {
      if (err) {
        res.json({ result: err });
      } else {
        res.json({ result: profiles[0] });
      }
    });
  },

  postProject: (req, res) => {
    if (_.isEmpty(req.body.data)) {
      res.json({ result: "REQUEST IGNORED" });
    } else {
      let project = req.body.data;

        Profile.findOne({userName: project.userName}, (err, profile) => {
            if (err) {
                res.json({result: "profile of specified userName not found"});
            } else {
                let project = new Project(req.body.data);
                project.postedBy = profile._id;
                project.save((err, obj) => {
                  if (err) {
                      res.json({result: "error saving profile"});
                  } else {
                      res.json({result: obj._id});
                  }
                });
            }
        });
    }
  },

  postProjectComment: (req, res) => {
    let projId = req.params.projId;

    if (_.isEmpty(req.body.data)) {
      res.json({ result: "REQUEST IGNORED" });
    } else {
      Project.update(
        { _id: projId },
        { $push: { comments: req.body.data } },
        function(err, success) {
          if (err) {
            console.log(err);
          } else {
            res.json({ result: "successful" });
          }
        }
      );
    }
  },

  postProfile: (req, res) => {
    if (_.isEmpty(req.body)) {
      res.json({ result: "REQUEST IGNORED" });
    } else {
      console.log(req.body);
      const profile = new Profile(req.body);
      profile.save((err, obj) => {
        res.json({ result: "SUCCESS" });
      });
    }
  },

  deleteImage: (req, res) => {
    let public_id = req.params.public_id;
    console.log("public_id :" + req.params.public_id);
    cloudinary.v2.uploader.destroy(public_id, function(error, result) {
      res.json({ result: result });
    });
  }
};

let genToken = function(user) {
  //let expires = expiresIn(7); // 7 days
  /*let token = jwt.encode({
     exp: expires
     }, require('../config/secret')());*/
  let token = jwt.sign(
    {
      userName: user.userName,
      exp: Date.now() + 7 * 24 * 3600 * 1000
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

module.exports = { service: service };
