const express = require('express');
const tasksController = require('../controllers/tasksController')
const usersController = require('../controllers/usersController')
const router = express.Router();
const bodyParser = require('body-parser');
const Users = require('../models/users')

var urlEncodedParser = bodyParser.urlencoded({ extended: false })

router.get('/login', usersController.users_login)

router.get('/add-task', usersController.add_task)

router.post('/add-task', urlEncodedParser, usersController.users_add_task)

router.post('/login-post', urlEncodedParser, usersController.users_signin_account)

router.get('/sign-up', usersController.users_signup)

router.post('/sign-up', urlEncodedParser, usersController.signup)

router.get('/account/:username', usersController.account)

router.get('/:lang', tasksController.tasks_langTasks)

router.get('/', tasksController.tasks_index)

module.exports = router