var mysql      = require('mysql');
var connection = mysql.createConnection({
    connectionLimit : 100,
    host     : '127.0.0.1',
    user     : 'admin',
    password : 'Anhhoang236',
    database : 'flashcard'
});

connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");
} else {
    console.log("Error connecting database ... nn");
}
});

connection.on('query', function(query) { console.log(query.sql) });

module.exports = connection;

//connection.end();
