const axios = require("axios");
const redis = require('redis');
const config = require("../config/config");

const random6 = function() {
  return Math.floor(Math.random(0.1, 1) * 1000000);
};

const client = redis.createClient();
client.on('connect', function() {
  console.log('Redis client connected');
});
client.on('error', function (err) {
  console.log('Something went wrong ' + err);
});

const service = {
  sendSms: function(req, res) {
    let code = random6();
    console.log(code);

    axios.post('https://api.mysubmail.com/message/send.json', {
      appid: config.config.user_pool.submail_appid,
      to: req.body.mobile,
      signature: config.config.user_pool.submail_appkey,
      content: `【用户池】您的短信验证码是：${code}， 请在10分钟内输入。如果不是本人操作，请忽略。`
    })
      .then((response) => {
        if (response.data.status !== 'success') {
          res.json({ success: false, errorCode: '0004' })
        } else {
          client.set(req.body.mobile, code);
          // Expire in 600 seconds or 10 mins
          client.expire(req.body.mobile, 600);
          res.json({ success: true, code });
        }
      })
      .catch(function (err) {
        res.json({ success: false, errorCode: '0000', message: err })
      });
  }
};

module.exports = service;
