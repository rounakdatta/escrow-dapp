const http = require('http');
const fs = require('fs');
const express = require('express')
const path = require('path');
var bodyParser = require('body-parser');

const app = express(); 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use(express.static(path.resolve(`${__dirname}/web/public`)));
console.log(`${__dirname}/web`);
app.use('*', (req, res, next) => {
  console.log(`URL: ${req.baseUrl}`);
  next();
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept,X-access-token');
  next();
});

app.use((err, req, res, next) => {
  if (err) {
    res.send(err);
  }
});

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile); 
app.use(express.static(__dirname + '/views/web/public'));

var currentContract = 0;

app.get('/', (req, res, next) => {
  currentContract = 0;
  res.render('web/public/index.html');
});

app.get('/contractpage', (req, res, next) => {
  res.render('web/public/contract.html', {currentContract:currentContract});
})

app.post('/initatecontract', (req, res, next) => {
  currentContract = req.body.contractaddress;
  res.render('web/public/contract.html', {currentContract:currentContract});
});

app.post('/init', (req, res, next) => {
  res.render('web/public/init.html', {currentContract:currentContract});
});

app.post('/deposit', (req, res, next) => {
  res.render('web/public/deposit.html', {currentContract:currentContract});
});

app.post('/approve', (req, res, next) => {
  res.render('web/public/approve.html', {currentContract:currentContract});
});

app.post('/cancel', (req, res, next) => {
  res.render('web/public/cancel.html', {currentContract:currentContract});
});


app.post('/end', (req, res, next) => {
  res.render('web/public/end.html', {currentContract:currentContract});
});

var server = http.createServer(app);

server.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})