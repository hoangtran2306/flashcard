var express = require('express');
var router = express.Router();
var connection = require('../lib/db.js');
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: true });
router.use(bodyParser.json());

//-----------------------------------------------------------------------------------------------------------------

//get all collection
router.get('/collection/list', urlencodedParser, function (req, res) {
  var queryList = 'select T_COLLECTION.id, count(T_CARD_COLLECTION.id) as num_cards, download, name_en as name, description, image, price from T_COLLECTION join T_CARD_COLLECTION on col_id=T_COLLECTION.id group by col_id order by lesson';
  
  connection.query(queryList, function(err, rows){
    if (!err){
      str = JSON.stringify(rows);
      if (str != '[]'){
        res.json({ status: '200' , quantity: rows.length , collections :rows });
        //res.status(200).json({id: id , cards :rows});
      } else {
        res.json({ status: '404' , message : 'Không tìm thấy danh sách bộ thẻ.'});
      }
    }
    else{
      res.json({ status: '503' , message : 'Lỗi kết nối.'});
    }
    });
});

//-----------------------------------------------------------------------------------------------------------------

//get cards using collection id
router.get('/collection/:id(\\d+)', urlencodedParser, function (req, res) {
  var id = req.params.id;
  var queryList = 'SELECT * FROM T_CARD join T_CARD_COLLECTION on T_CARD.id = T_CARD_COLLECTION.card_id WHERE col_id=' + connection.escape(id);
  connection.query(queryList, function(err, rows){
    if (!err){
      str = JSON.stringify(rows);
      if (str != '[]'){
        res.json({ status: '200' , id: id , cards :rows });
      } else {
        res.json({ status: '404' , message : 'Không tìm thấy thẻ.'});
      }
    }
    else{
      res.json({ status: '503' , message : 'Lỗi kết nối.'});
    }
    });
});

//-----------------------------------------------------------------------------------------------------------------

//search collection by name
router.get('/collection/search', urlencodedParser, function (req, res) {
  var name = req.query.name;
  var queryList = 'SELECT * FROM `T_COLLECTION` WHERE name LIKE ' + connection.escape('%' + name + '%');
  connection.query(queryList, function(err, rows){
    if (!err){
      str = JSON.stringify(rows);
      if (str != '[]'){
        res.json({ status: '200' , name: name , collections :rows });
      } else {
        res.json({ status: '404' , name: name , message : 'Không tìm thấy bộ thẻ.'});
      }
    }
    else{
      res.json({ status: '503' , message : 'Lỗi kết nối.'});
    }
    });
});

//-----------------------------------------------------------------------------------------------------------------

//post collection
router.post('/collection/insert', urlencodedParser, function (req, res) {
  var post = req.body;
  if (post.name)  {
    var queryList = 'INSERT INTO `T_COLLECTION` SET ' + connection.escape(post);
    var query = connection.query(queryList, function(err, result){
      if (!err){
        res.json({ status: '200' , message : 'Bạn đã thêm thành công!' });
      } else {
        res.json({ status: '404' , message : 'Máy chủ bận.'});
      }
    });
  } else {
    res.json({status: '500', message : 'Điền đấy đủ nội dung.'});
  }
});

//-----------------------------------------------------------------------------------------------------------------

//update collection using id
router.put('/collection/update/:id', urlencodedParser, function (req, res) {
  var post = req.body;
  var name = post.name;
  var name_en = post.name_en;
  var type = post.type;
  var description = post.description;
  var image = post.image;
  var price = post.price;
  connection.query('UPDATE `T_COLLECTION` SET ? WHERE ?',{}, {id : req.params.id}, function(err, rows){
    if (!err){
        res.json({ status: '200' , message : 'Cập nhật thành công.' });
    }
    else{
      res.json({ status: '503' , message : 'Lỗi kết nối'});
    }
    });
});

//-----------------------------------------------------------------------------------------------------------------

//delete collection using id

//-----------------------------------------------------------------------------------------------------------------

module.exports = router;
