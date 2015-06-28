var decorators=require('./decorators');//装饰器

function authenticate(msg,callback){
        if(msg.id!="233") return callback(new Error("Illegal id."),false);
        return callback(null,true);
}
function postAuthenticate(socket,data){
        socket.join(data.room);
        socket.on('create_graphic',function(graphic){
                socket.broadcast.to(data.room).emit('create_graphic',graphic);
        });
}

exports.io=function(io){
        require('socketio-auth')(io,{
                authenticate: authenticate, 
                postAuthenticate: postAuthenticate,
                timeout: 1000
        });
}
