var PORT=process.env.DC_PORT||8000;

var sio = require('socket.io');
var express = require('express');
var http=require('http');
var expressSession=require("express-session");
var MongoStore=require('connect-mongo')(expressSession);

var app = express();
var server=http.createServer(app);

var model=require('./model');
var config=require('./config');

server.listen(PORT);

var memoryStore=new MongoStore({
        db: 'drawcraft',
        host: 'localhost',
        port: 27017,
});
var session=expressSession({
        secret: config.secretKey,
        cookie:{maxAge: 2*7*24*3600},
        store: memoryStore,
        resave: true,
        saveUninitialized: true,
});



var io=sio.listen(server);

require("./express-config")(app,session,PORT);
require("./apis")(app);

require('./auth')(io,session);

console.log("Running...");
console.log("PORT:",PORT);
