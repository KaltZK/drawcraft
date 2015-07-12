//在socket.io中的事件所在模块 被auth模块调用
var decorators=require('./decorators');
var model=require('./model');
module.exports=function(socket,user_data){
        with(decorators){
                socket.on('create_graphic',withTimestamp(withUser(function(graphic){
                        graphic.room=user_data.room;
                        socket.broadcast.to(user_data.room).emit('create_graphic',graphic);
                        model.storeNewGraphic(graphic);
                })));
        }
        socket.on('pull_inner_graphics',function(msg){
                model.loadGraphicsInRange(user_data.room,msg,function(struct){
                        socket.emit("pull_inner_graphic",struct);
                });
        });
        socket.on("text_message",function(message){
                socket.broadcast.to(message.room).emit('text_message',message);
        });

        socket.on("load_chunk",function(chunk){
                model.loadChunk(chunk,function(body){
                        socket.emit("load_graphic_body",body);
                },
                function(content){
                        socket.emit("load_content",content);
                });
        });
        
        socket.on("update_graphic",function(msg){
                model.storeGraphic(msg.data);
                socket.broadcast.to(msg.room).emit("update_graphic",msg.data);
        });
        socket.on("update_content",function(msg){
                model.storeContent(msg);
                socket.broadcast.to(msg.room).emit("update_content",msg);
        });
        socket.on("remove_graphic",function(msg){
                model.removeGraphic(msg);
                socket.broadcast.to(msg.room).emit("remove_graphic",msg);
        });
        socket.on("remove_content",function(msg){
                model.removeContent(msg);
                socket.broadcast.to(msg.room).emit("remove_content",msg);
        });
        socket.on("load_room_list",function(msg){
                model.loadRoomList(msg,function(room_data){
                        socket.emit("load_room",room_data);
                });
        });
}
