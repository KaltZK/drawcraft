define("dc/io",["jquery","socket.io","dc/api","jquery.cookie"],function($,io,api){
function initIO(socket,password){
        socket.on('connect',function(){
                socket.emit('authentication',{
                        room:board.room,
                        user:$.cookie("user"),
                        password:password,
                });
        });
        socket.on("pass_auth",function(){
                $.event.trigger({
                        type:"pass_auth",
                });
        });
        socket.on('disconnect',function(msg){
                $.event.trigger({type:"disconnect",err:msg.err});
        });
        socket.on("create_graphic",function(graphic){
                $.event.trigger({
                        type:"create_graphic",
                        msg:graphic,
                });
        });
        this.createGraphic=function(graphic){
                if(graphic)
                        socket.emit("create_graphic",graphic.toStruct(graphic));
        };
}
return function(room){
        var self=this;
        function conn(password){
                var socket=io.connect();
                initIO.call(self,socket);
        }
        this.connect=function(){
                api.roomNeedPassword({room:room},function(np){
                        if(np){
                                $.event.trigger({
                                        type:"require_room_password",
                                });
                                $(document).bind("gain_room_password",function(pw){
                                        conn(pw);
                                        $(document).unbind("gain_room_password");
                                });
                        }
                        else conn();
                });
        }
}});
