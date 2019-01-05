var user = require('./users')

const User = require("../models/user");
const Profile = require("../models/profile");
var auth = {

    login: function(req, res) {
        let userName = req.body.userName || "";
        let password = req.body.password || "";

        if (userName == "" || password == "") {
            res.status(401);
            res.json({
                status: 401,
                message: "Invalid credentials"
            });
            return;
        }

        // Fire a query to your DB and check if the credentials are valid
        auth.validate(req, res, userName, password);
    },

    validate: function(req, res, userName, password) {
        /*for (let i = 0; i < user.data.length; i++) {
         if (
         user.data[i].username === username &&
         user.data[i].password === password
         ) {
         return { username: user.data[i].username, fullName: user.data[i].fullName };
         }
         }*/
        console.log(userName + ' ' + password);
        User.findOne({ userName: userName, password: password }, (err, user) => {
            if (err) {
                console.log(err);
                res.json({result: 'database error'});
            } else if (user) {
                //res.json(users[0]);
                Profile.findOne({userName: userName}, (err, profile) => {
                    if (err || !profile) {
                        res.json({
                            userName: user.userName,
                            fullName: user.fullName,
                            token: user.token.value,
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
            } else {
                res.status(401);
                res.json({
                    status: 401,
                    message: "Invalid credentials"
                });
            }
        });
    },

    validateUser: function(username) {
        // spoofing the DB response for simplicity
        var dbUserObj = { // spoofing a userobject from the DB.
            name: 'arvind',
            role: 'admin',
            username: 'arvind@myapp.com'
        };

        return dbUserObj;
    },
}

// private method
function genToken(user) {
    var expires = expiresIn(7); // 7 days
    var token = jwt.encode({
        exp: expires
    }, require('../config/secret')());

    return {
        token: token,
        expires: expires,
        user: user
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;
