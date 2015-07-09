//socket.io 认证及初始化模块
var model=require('./model');
var decorators=require('./decorators');//装饰器

function enterRoom(socket,data){
        model.enterRoom(data.room);
        socket.join(data.room);
        with(decorators){
                socket.on('create_graphic',withTimestamp(withUser(function(graphic){
                        console.log(graphic);
                        socket.broadcast.to(data.room).emit('create_graphic',graphic);
                })));
        }
        require("./socket-events")(socket,data);
}

module.exports=function(io){
        io.on("connect",function(socket){
                var authentication=false;
                var timeout=1000,data_;
                setTimeout(function(){
                        if(authentication){
                                enterRoom(socket,data_);
                                socket.emit("pass_auth",{});
                        }
                        else
                                socket.disconnect();
                },timeout);
                socket.on("authentication",function(data){
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
