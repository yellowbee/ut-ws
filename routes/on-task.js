const Task = require("../models/task");

const service = {
  getTasksWithFilterAndLimit: function(req, res) {
    let { industry, age, sex } = req.body;
    Task
      .find( { $and:[ {'industry':industry}, {'age':age}, {'sex':sex} ]} )
      .sort({'date': -1})
      .limit(3)
      .exec(function(err, posts) {
        res.json(posts);
      });
  }
};

module.exports = service;