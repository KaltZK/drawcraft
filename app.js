var PORT=process.env.DC_PORT||8000;

var sio = require('socket.io');
var express = require('express');
var url=require('url');
var http=require('http');
var bodyParser=require("body-parser");
var crypto=require("crypto");

var sha1=crypto.createHmac('sha1', "fkhso9GFIEgfogYG*G*^YG*Etg9ga9fhno9ugu989");
var app = express();
var server=http.createServer(app);
var io=sio.listen(server);

//对数据库访问接口
var model=require('./model');

server.listen(PORT);


function hashString(str){
        return sha1.update(str).digest().toString('base64');
}




// express config
(function(){
        app.set('port',PORT);
        app.set('views',__dirname+'/views');
        app.engine('.html', require('ejs').__express);
        app.set('view engine', 'html');//使ejs可以渲染HTML扩展名的文件，否则高亮很蛋疼
        app.use(express.static(__dirname + '/static'));//设置静态文件
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended:false}));
}).call();

app.get('/',function(req,res){
        res.render("index");
});
app.get('/app',function(req,res){
        res.render("app");
});
app.post('/api',function(req,res){
        var action = req.query["action"];
        if(!action || !apis[action]){
                res.status(417).json({err:"Action not found."});
                return;
        }
        console.log(req.body);
        res.json(apis[action](req.body));
});
var apis={
        test:function(body){return body;},
};

io.on("connection",function(socket){
        socket.on('enter_room',function(data){
                socket.join(data.room);
                socket.broadcast.to(data.room).emit("text_message",{
                        author: "System",
                        text: data.user + " joined "+data.room,
                });
        });
        socket.on('leave_room',function(data){
                socket.join(data.room);
                socket.broadcast.to(data.room).emit("text_message",{
                        author: "System",
                        text: data.user + " left "+data.room,
                });
        });
        socket.on("text_message",function(message){
                console.log(message);
                socket.broadcast.to(message.room).emit('text_message',message);
        });

        socket.on("load_chunk",function(chunk){
                console.log(chunk.x,chunk.y);
        });
        
        socket.on("update_graphic",function(msg){
                model.storeGraphic(msg);
                socket.broadcast.to(msg.head.room).emit("update_graphic",msg);
        });
        socket.on("update_content",function(msg){
                model.storeGraphic(msg);
                socket.broadcast.to(msg.room).emit("update_content",msg);
        });
        
});
io.on("disconnect",function(ssocket){console.log(233);});

console.log("Running...");
console.log("PORT:",PORT);
