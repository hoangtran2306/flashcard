var express = require('express');
var router = express.Router();
var connection = require('../lib/db.js');
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: true });
router.use(bodyParser.json());

//-----------------------------------------------------------------------------------------------------------------
router.post('/report', urlencodedParser, function (req, res) {
  var postReport = req.body.report;
  var postDevice = req.body.device;
  var dataReport = {report: postReport, device: postDevice};
  var queryReport = 'INSERT INTO `T_REPORTS` SET ' + connection.escape(dataReport);
  connection.query(queryReport, function(err, result){
    if (!err){
        res.json({ status: '200' , message : 'Cảm ơn sự góp ý của bạn!' });
    } else {
      res.json({ status: '404' , message : 'Máy chủ bận. Vui lòng thử lại.'});
    }
  });
});

module.exports = router;
