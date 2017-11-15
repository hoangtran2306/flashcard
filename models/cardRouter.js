var express = require('express');
var router = express.Router();
var connection = require('../lib/db.js');
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: true });
router.use(bodyParser.json());

//-----------------------------------------------------------------------------------------------------------------
//get card by id
router.get('/card/:id(\\d+)', urlencodedParser, function (req, res) {
  var id = req.params.id;
  var queryList = 'SELECT * FROM `T_CARD` WHERE id = ' + connection.escape(id);
  connection.query(queryList, function(err, rows){
    if (!err){
      str = JSON.stringify(rows);
      if (str != '[]'){
        res.json({ status: '200'  , card :rows[0] });
      } else {
        res.json({ status: '404' ,  message : 'Không tìm thấy thẻ.'});
      }
    }
    else{
      res.json({ status: '503' , message : 'Lỗi kết nối.', kk: err.message});
    }
    });
});

//-----------------------------------------------------------------------------------------------------------------
//get cards using name - user search
router.get('/card/search', urlencodedParser, function (req, res) {
  var word = req.query.word;
  var queryList = 'SELECT * FROM `T_CARD` WHERE word LIKE ' + connection.escape('%' + word + '%');
  connection.query(queryList, function(err, rows){
    if (!err){
      str = JSON.stringify(rows);
      if (str != '[]'){
        res.json({ status: '200' , word: word , cards :rows });
      } else {
        res.json({ status: '404' , word: word , message : 'Không tìm thấy thẻ     ddd.'});
      }
    }
    else{
      res.json({ status: '503' , message : 'Lỗi kết nối.'});
    }
    });
});

//-----------------------------------------------------------------------------------------------------------------
//post cards - user add new cards
router.post('/card/insert', urlencodedParser, function (req, res) {
  //var post = {collectionId: id , word: '1', description: 'xin chao'};//post.word
  var post = req.body;
  if (post.word && post.description && post.collectionId)  {
    var queryList = 'INSERT INTO `T_CARD` SET ' + connection.escape(post);
    connection.query(queryList, function(err, result){
      if (!err){
        var cardId = result.insertId;
        var colData = {card_id: cardId, col_id : post.collectionId};
        var queryCol = 'INSERT INTO `T_CARD_COLLECTION` SET ' + connection.escape(colData);
        connection.query(queryCol, function(error, resultCol){
          if (!error){
            res.json({ status: '200' , message : 'Bạn đã thêm thẻ thành công!' });
          } else {
            res.json({ status: '404' , message : 'Máy chủ bận. Vui lòng thử lại.'});
          }
        });
      } else {
        res.json({ status: '404' , message : 'Máy chủ bận. Vui lòng thử lại.'});
      }
    });
  } else {
    res.json({status: '500', message : 'Điền đấy đủ nội dung.'});
  }
});

//-----------------------------------------------------------------------------------------------------------------

//update cards using id - collection update
router.put('/card/update/:id', urlencodedParser, function (req, res) {
  var post = req.body;
  var id = req.params.id;
  var pronounce = post.pronounce;
  var type = post.type;
  var word = post.word;
  var description = post.description;
  var hint = post.hint;
  var image = post.image;
  var sound = post.sound;
  var example = post.example;
  if (word && description){
    var dataUpdate = {
      word: word,
      description: description,
      hint: hint,
      example: example
    };
    connection.query('UPDATE `T_CARD` SET ? WHERE id = ',[dataUpdate, id], function(err, rows){
      if (!err){
          res.json({ status: '200' , message : 'Cập nhật thành công.' });
      }
      else{
        res.json({ status: '503' , message : 'Lỗi kết nối.'});
      }
      });
  } else {
    res.json({status: '500', message : 'Điền đấy đủ nội dung.'});
  }
});

//-----------------------------------------------------------------------------------------------------------------


//delete cards using id
router.get('/card/delete/:id', urlencodedParser, function (req, res) {
  var id = req.params.id;
  var queryList = 'DELETE FROM `T_CARD` WHERE id = ' + connection.escape(id);
  connection.query(queryList, function(err, rows){
    if (!err){
      connection.query('DELETE FROM `T_CARD_COLLECTION` WHERE card_id = ?', [id], function(error, result){
        if (!error){
          res.json({ status: '200' , message: 'Đã xoá thành công.' });
        } else {
          res.json({ status: '404' , message : 'Không tìm thấy bộ thẻ.'});
        }
      });
    }
    else {
      res.json({ status: '503' , message : 'Lỗi kết nối.'});
    }
    });
});

//-----------------------------------------------------------------------------------------------------------------

module.exports = router;
