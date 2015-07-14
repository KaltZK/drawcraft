//在socket.io中的事件所在模块 被auth模块调用
var decorators=require('./decorators');
var model=require('./model');
module.exports=function(socket,user_data){
        model.loadRecentTextMessage(user_data.room,function(msg){
                socket.emit('text_message',msg);
        });
        with(decorators){
                socket.on('create_graphic',withTimestamp(withUser(function(graphic){
                        graphic.room=user_data.room;
                        socket.broadcast.to(user_data.room).emit('create_graphic',graphic);
                        model.storeNewGraphic(graphic);
                })));
                socket.on('remove_graphic',withUser(function(id){
                        socket.broadcast.to(user_data.room).emit('remove_graphic',id);
                        model.removeGraphic(id,user_data.room);
                }));
                socket.on('pull_inner_graphics',function(msg){
                        model.loadGraphicsInRange(user_data.room,msg,function(struct){
                                socket.emit("pull_inner_graphic",struct);
                        });
                });
                socket.on("text_message",withRoom(withTimestamp(function(message){
                        socket.broadcast.to(user_data.room).emit('text_message',message);
                        model.addTextMessage(message);
                }),user_data.room));
        }
}
