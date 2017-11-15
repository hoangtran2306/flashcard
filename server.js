var express = require('express');
var morgan = require('morgan');
var cache = require('apicache').middleware;
var app = express();
var port = process.env.PORT || 26592;

app.use(morgan('combined'));

app.use(cache('5 minutes'));

//cards
var cards = require('./models/cardRouter.js');
app.use('/', cards);

//collection
var collections = require('./models/collectionRouter.js');
app.use('/', collections);

//user
var users = require('./models/userRouter.js');
app.use('/', users);

//report
var reports = require('./models/report.js');
app.use('/', reports);

app.listen(port);
