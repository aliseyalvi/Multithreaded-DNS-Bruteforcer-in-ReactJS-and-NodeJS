var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors=require("cors");
var fs=require("fs");
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const nocache = require('nocache');

const lineReader = require('line-reader');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var portScannerRouter = require('./routes/portscannerapi');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(nocache());
//app.use('/', indexRouter);
app.use('/users', usersRouter);

//Variables to manage data
var data={
  host:"",
  port:"",
  output:[]
}
app.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// Handle Post request by client and executes the multithreaded scanner in background
app.post('/portscannerapi', function(req, res, next) {
  console.log(req.body.data);
  data.host=req.body.data.host;
  //Function to call and pass data to Multithreaded SubDomain Scanner
  lsExample(data.host);

  res.send(data.host);

});
/* GET users listing. */
app.get('/portscannerapi', function(req, res, next) {

  //Read file line by line and send back to the requesting client
  lineReader.eachLine('./report.txt', function(line) {
    //console.log(line);
    data.output.push(line);
  });
  //console.log(data.output);
  res.send(data.output);
});


//An asynchronous function to execute multithreaded dns scanner written in C
async function lsExample(hostname) {
  const { stdout, stderr } = await exec('./dns-discovery '+hostname+' -w wordlist.wl  -t 400 -r report.txt');
  console.log('stdout:', stdout);
  console.log(hostname);
}
  


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
