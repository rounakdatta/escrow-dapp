const http = require('http');
const fs = require('fs');
const express = require('express')
const path = require('path');

const app = express(); 

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

app.get('/', (req, res, next) => {
  res.sendFile(path.resolve(`${__dirname}/web/public/index.html`));
});

var server = http.createServer(app);

server.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})