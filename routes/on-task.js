const Task = require("../models/task");

const service = {
  getTasksWithFilterAndLimit: function(req, res) {
    let { industry, age, sex } = req.body;
    console.log(req.params.limit);
    Task
      .find( { $and:[ {'industry':industry}, {'age':age}, {'sex':sex} ]} )
      .sort({'date': -1})
      .limit(parseInt(req.params.limit))
      .exec(function(err, posts) {
        res.json(posts);
      });
  }
};

module.exports = service;