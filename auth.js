function authenticate(msg,callback){
        console.log(msg.room,typeof msg.room);
        if(typeof msg.room!="string") return callback(new Error("Illegal room."));
        return callback(null,true);
}
function postAuthenticate(socket,msg){
        socket.join(msg.room);
}

exports.io=function(io){
        require('socketio-auth')(io, {
                authenticate: authenticate, 
                postAuthenticate: postAuthenticate,
                timeout: 1000
        });
}
