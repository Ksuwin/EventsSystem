var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var ejsEngine = require("ejs-locals");
var activityRoutes = require('./routes/activity');
var eventRoutes = require('./routes/event');
var config = require('./config');
var mongoose = require('mongoose');

mongoose.connect(config.database);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected correctly to MLab Database");
});

var app = express();

// set static folder
app.use(express.static(path.join(__dirname, "client")));
app.use(express.static(path.join(__dirname, 'public')));
app.engine("ejs", ejsEngine);
app.set("view engine", "ejs");

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(logger('dev'));

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use('/event', eventRoutes);
app.use('/activity', activityRoutes);

// catch 404
/*app.use(function(req, res, next) {
  var err = new Error('Resource is not found');
  res.writeHead(404, {'Content-Type': 'text/html' });
  res.end('<h3 style="color:red">Error:' + err.message + '</h3>');
});*/

app.listen(config.port, function() {
    console.log('Server started on port ' + config.port);
});
