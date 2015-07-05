define("dc/io",["jquery","socket.io","jquery.cookie"],function($,io){
return function(board){
        var socket=io.connect();
        socket.on('connect',function(){
                socket.emit('authentication',{
                        room:board.room,
                        id:"233",
                });
                socket.emit("666",{});
        });
        socket.on('disconnect',function(){
                console.log("Disconnected.");
        });
        socket.on("create_graphic",function(graphic){
                board.graphicsManager.updateNewGraphic(graphic);
        });
        this.createGraphic=function(graphic){
                if(graphic)
                        socket.emit("create_graphic",graphic.toStruct(graphic));
        };
}});
