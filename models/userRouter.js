var express = require('express');
var router = express.Router();
var connection = require('../lib/db.js');
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: true });
router.use(bodyParser.json());

//-----------------------------------------------------------------------------------------------------------------

//get user

//-----------------------------------------------------------------------------------------------------------------

//add user

//-----------------------------------------------------------------------------------------------------------------

//edit user

//-----------------------------------------------------------------------------------------------------------------

module.exports = router;