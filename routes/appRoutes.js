const express = require('express');
const appController = require('../controllers/appController')
const router = express.Router();
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });


router.post('/add', urlencodedParser, appController.app_check_code)

router.post('/getEditor', urlencodedParser, appController.app_get_config)

router.get('/:title', appController.app_index)


module.exports = router