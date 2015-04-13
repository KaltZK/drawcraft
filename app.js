var PORT=8000;

var sio = require('socket.io');
var express = require('express');
var url=require('url');
var http=require('http');
var app = express();
var server=http.createServer(app);
var io=sio.listen(server);

//对数据库访问接口
var model=require('./model');

server.listen(PORT);

// express config
(function(){
        app.set('port',process.env.VMC_APP_PORT||PORT);
        app.set('views',__dirname+'/views');
        app.engine('.html', require('ejs').__express);
        app.set('view engine', 'html');//使ejs可以渲染HTML扩展名的文件，否则高亮很蛋疼
        app.use(express.static(__dirname + '/static'));//设置静态文件
}).call();

app.get('/',function(req,res){
        res.render("index");
});
app.get('/app',function(req,res){
        var urldata = url.parse(req.url,true).query;
        res.render("app");
});


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


console.log("Running...");
console.log("PORT:",PORT);
