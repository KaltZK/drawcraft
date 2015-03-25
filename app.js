var fs = require('fs');
var io = require('socket.io').listen(8080);
var express = require('express');
var url=require('url');

var app = express();

// express config
(function(){
        app.set('port',process.env.VMC_APP_PORT||3000);
        app.set('views',__dirname+'/views');
        app.set('view engine','ejs');
        app.set('static',__dirname+'/public');
}).call();

app.get('/',function(req,res){
        res.render("index");
});
app.get('/app',function(req,res){
        data = url.parse(req.url,true).query;
        res.render("app",{username:data["username"]});
});

app.listen(8000);


io.on("connection",function(socket){
        socket.emit("news",{hello: "world"});
        socket.on("text-message",function(message){
                socket.broadcast.emit('text-message',message);
        });
});
