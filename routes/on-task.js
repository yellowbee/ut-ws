const Task = require("../models/task");

const service = {
  getTasksWithFilterAndLimit: function(req, res) {
    let { industry, age, sex } = req.body;

    let filter_arr = [];
    if (industry && industry !== '不限') {
      filter_arr.push({ $or:[ { industry: industry }, { industry: '不限'} ] });
    }
    if (age && age !== '不限') {
      filter_arr.push({ $or:[ { age: age }, { age: '不限'} ] });
    }
    if (sex && sex !== '不限') {
      filter_arr.push({ $or:[ { sex: sex }, { sex: '不限'} ] });
    }

    let filter_obj = filter_arr.length === 0 ? {} : { $and: filter_arr };

    Task
      .find( filter_obj )
      .sort({'date': -1})
      .limit(parseInt(req.params.limit))
      .exec(function(err, posts) {
        res.json(posts);
      });
  }
};

module.exports = service;