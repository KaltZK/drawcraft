var PORT=process.env.DC_PORT||8000;

var sio = require('socket.io');
var express = require('express');
var http=require('http');

var app = express();
var server=http.createServer(app);
var io=sio.listen(server);

var model=require('./model');

server.listen(PORT);



require("./express-config")(app,PORT);
require("./apis")(app);

require('./auth')(io);

console.log("Running...");
console.log("PORT:",PORT);
