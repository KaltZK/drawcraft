//socket.io 认证及初始化模块
var model=require('./model');
var decorators=require('./decorators');//装饰器

function authenticate(msg,callback){
        if(msg.id!="233") return callback(new Error("Illegal id."),false);
        return callback(null,true);
}
function postAuthenticate(socket,data){
        model.enterRoom(data.room);
        socket.join(data.room);
        socket.on('create_graphic',function(graphic){
                socket.broadcast.to(data.room).emit('create_graphic',graphic);
        });
        require("./socket-events")(socket,data);
}

module.exports=function(io){
        require('socketio-auth')(io,{
                authenticate: authenticate, 
                postAuthenticate: postAuthenticate,
                timeout: 1000
        });
}
