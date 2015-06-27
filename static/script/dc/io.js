define("dc/io",["jquery","socket.io","jquery.cookie"],function($,io){
return function(room){
        var socket=io.connect();
        socket.on('connect',function(){
                console.log(6);
                socket.emit('authentication',{
                        room:room,
                });
        });
        return{
                
        };
}});
