const jwt = require('jsonwebtoken');
const secret = require('../config/secret')();

module.exports = (req, res, next)=>{
  // check header or url parameters or post parameters for token
  //var token = req.body.token || req.query.token || req.headers['x-access-token'];
  const token = req.headers.authorization.split(' ')[1];

  if(token){
    //Decode the token
    jwt.verify(token, secret, (err,decod)=>{
      console.log('secret: ' + secret);

      if(err){
        res.status(403).json({
          message:"Wrong Token: " + token
        });
      }
      else{
        //If decoded then call next() so that respective route is called.
        req.decoded=decod;
        next();
      }
    });
  }
  else{
    res.status(403).json({
      message:"No Token"
    });
  }
};
