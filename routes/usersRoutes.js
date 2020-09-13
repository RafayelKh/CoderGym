const express = require('express');
const usersController = require('../controllers/UsersController')
const router = express.Router();
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });


// router.post('/add', urlencodedParser, appController.app_check_code)


module.exports = router