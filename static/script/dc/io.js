define("dc/io",["jquery","socket.io","jquery.cookie"],function($,io){
        var socket=io.connect();
        socket.on('connect',function(){
                socket.emit('authentication',{//身份验证
                        client: "John",
                        password: "secret"
                });
        });
        return{
                
        };
});
