/**
 * Created by bhuang on 12/4/17.
 * Holds all the routes needed.
 */

let express = require('express');
let router = express.Router();

//let user = require('./users.js');
//let stdParam = require('./std-param');

let onTestee = require('./on-testee');
let onTester= require('./on-tester');
const sms = require('./sms');
/*
 * Routes that can be accessed by any one
 */
//router.post('/login', auth.login);
//router.post('/new-user', user.service.create);

/**
 * client sends the token in the request; if the token
 * is valid and is not expired, respond the username, fullname
 * and token back; otherwise, respond with FAILURE.
 */
//router.get('/api/user/renew/:token', user.service.renew);

//router.get('/api/projects', user.service.getProjects);
//router.get('/api/projects/:userName', user.service.getProjectsByUserName);

//router.get('/api/ashare/:code', user.service.getCompany);
// financial parameters
//router.get('/api/roe/:code', user.service.getRoeByCompany);
//router.get('/api/roes/:codesstr', stdParam.getRoesByCompanies);

router.post('/new-testee', onTestee.create);
router.post('/new-tester', onTester.create);
router.post('/testee-login', onTestee.login);
router.post('/tester-login', onTester.login);
router.get('/api/check-token', (req, res)=> {res.json({success: true, message: "test success"})});

router.post('/api/task', onTester.addTask);
router.get('/api/tasks/:poster_uuid', onTester.getTasksByPosterUuid);
router.delete('/task/:_id', onTester.deleteTaskById);

router.post('/testees', onTestee.getTesteesByIndustry);

router.post('/sms', sms.sendSms);

module.exports = router;
