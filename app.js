var io = require('socket.io').listen(8080);
var express = require('express');
var url=require('url');

var app = express();

// express config
(function(){
        app.set('port',process.env.VMC_APP_PORT||3000);
        app.set('views',__dirname+'/views');
        app.set('view engine','ejs');
        app.use(express.static(__dirname + '/static'));//设置静态文件
}).call();

app.get('/',function(req,res){
        res.render("index");
});
app.get('/app',function(req,res){
        var data = url.parse(req.url,true).query;
        res.render("app",{username:data["user"],roomname:data["room"]});
});

app.listen(8000);


io.on("connection",function(socket){
        socket.join("");
        socket.on('enter_room',function(data){
                socket.join(data.room);
                socket.broadcast.to(data.room).emit("text_message",{
                        author: "System",
                        text: data.user + " joined "+data.room,
                });
        });
        socket.on('leave_room',function(data){
                socket.leave(data.room);
                socket.broadcast.to(data.room).emit("text_message",{
                        author: "System",
                        text: data.user + " left "+data.room,
                });
        }); 
        socket.emit("news",{hello: "world"});
        socket.on("text_message",function(message){
                socket.broadcast.to(message.room).emit('text_message',message);
        });
});
