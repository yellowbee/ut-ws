const jwt = require("jsonwebtoken");

const service = {
  genToken: function(obj) {
    //let expires = expiresIn(7); // 7 days
    /*let token = jwt.encode({
       exp: expires
       }, require('../config/secret')());*/
    return jwt.sign(
      {
        name: obj.name,
        mobile: obj.mobile,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
      },
      config.config.user_pool.token_secret
    );
  }
};

module.exports = service;

