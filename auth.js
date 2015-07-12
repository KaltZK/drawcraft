//socket.io 认证及初始化模块
var cookie=require("cookie");
var model=require('./model');
var cookieParser=require("cookie-parser");
var decorators=require('./decorators');//装饰器

function enterRoom(socket,data){
        model.enterRoom(data.room);
        socket.join(data.room);
        socket.broadcast.to(data.room).emit("text_message",{
                author: "System",
                text: " joined "+data.room,
        });
        socket.on('disconnect',function(data){
                socket.broadcast.to(data.room).emit("text_message",{
                        author: "System",
                        text: " left "+data.room,
                });
        });
        require("./socket-events")(socket,data);
}

module.exports=function(io,session){
        //~ io.use(function(socket,next){
                //~ socket.a666=true;
                //~ next(socket,next);
        //~ });
        //~ io.use(function(socket, next){
                //~ console.log(6);
                //~ var req = socket.handshake;
                //~ var res = {};
                //~ cookieParser(req,res,function(err){
                        //~ if (err) return next(err);
                        //~ session(req,res,next);
                //~ });
        //~ });
        io.on("connect",function(socket){
                var authentication=false;
                var timeout=1000,data_;
                //~ console.log(socket);
                setTimeout(function(){
                        if(authentication){
                                enterRoom(socket,data_);
                                socket.emit("pass_auth",{});
                        }
                        else
                                socket.disconnect();
                },timeout);
                                console.log(socket);
                socket.on("authentication",function(data){
                        //~ var connect_sid=cookie.parse(
                                //~ (socket.handshake||socket).
                                //~ headers.cookie)["connect.sid"];
                        //~ memoryStore.get(connect_sid,function(err,session){
                                model.getRoomData(data.room,function(room){
                                        authentication= room!=null &&(
                                                room.public || (
                                                typeof data.password=="string" &&
                                                model.hash(data.password) == room.password ) &&
                                                data.user
                                                //~ || (
                                                //~ room.members && room.members.indexOf()!=-1
                                                //~ )
                                                
                                        );
                                        if(authentication) data_=data;
                                });
                        //~ });
                });
                
        });
}

if(0){
module.exports=function(io){
        require('socketio-auth')(io,{
                authenticate: authenticate, 
                postAuthenticate: postAuthenticate,
                timeout: 10000
        });
}
}
