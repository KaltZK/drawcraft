var EXPRESS_PORT=8000;
var IO_PORT=8080;


var io = require('socket.io').listen(IO_PORT);
var express = require('express');
var url=require('url');

var app = express();



// express config
(function(){
        app.set('port',process.env.VMC_APP_PORT||EXPRESS_PORT);
        app.set('views',__dirname+'/views');
        app.engine('.html', require('ejs').__express);
        app.set('view engine', 'html');//使ejs可以渲染HTML扩展名的文件，否则高亮很蛋疼
        app.use(express.static(__dirname + '/static'));//设置静态文件
}).call();

app.get('/',function(req,res){
        res.render("index");
});
app.get('/app',function(req,res){
        var data = url.parse(req.url,true).query;
        res.render("app",{username:data["user"],roomname:data["room"]});
});

app.listen(EXPRESS_PORT);


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
console.log("EXPRESS_PORT:",EXPRESS_PORT);
console.log("IO_PORT:",IO_PORT);