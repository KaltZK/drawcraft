/*
这是专用于app.html的JavaScript文件
因为上百行JS直接堆在<head>标签里实在不像样所以就分出来了

Update: 因为实在太长了所以拆成了5个文件
*/

//页面加载完成时的初始化操作
/*姑且当成main吧*/
var socket;
$(document).ready(function(){
        socket=io.connect();

        (function(){
                socket.emit('enter_room',{
                        room: getRoomname(),
                        user: getUsername(),
                });
                socket.on("text_message",function(message){
                        addTextMessage(message);
                });
        }).call();
        (function(){
                socket.on("start_drawing",function(msg){
                        var chunk=CHUNK[getChunkId(msg.chunk.x,msg.chunk.y)];
                        if(!chunk) return;
                        var cds=CHUNK_DRAWING_STATUS[msg.username] ||
                                (CHUNK_DRAWING_STATUS[msg.username]=new ChunkDrawingStatus());
                        cds.start(msg.x,msg.y,chunk);
                        
                });
                socket.on("draw_point",function(msg){
                        var chunk=CHUNK[getChunkId(msg.chunk.x,msg.chunk.y)];
                        if(!chunk) return;
                        var cds=CHUNK_DRAWING_STATUS[msg.username] ||
                                (CHUNK_DRAWING_STATUS[msg.username]=new ChunkDrawingStatus());
                        if(!cds.drawing) return;
                        if(!cds.last_chunk.id||
                                cds.last_chunk.id!=getChunkId(msg.chunk.x,msg.chunk.y))
                                cds.start_in_chunk(msg.x,msg.y,chunk);//因为mouseenter事件在鼠标按下的时候不触发所以只能这样处理
                        cds.add_point(msg.x,msg.y,chunk);
                });
                socket.on("stop_drawing",function(msg){
                        var chunk=CHUNK[getChunkId(msg.chunk.x,msg.chunk.y)];
                        if(!chunk) return;
                        var cds=CHUNK_DRAWING_STATUS[msg.username] ||
                                (CHUNK_DRAWING_STATUS[msg.username]=new ChunkDrawingStatus());
                        cds.stop(msg.x,msg.y,chunk);
                });
        }).call();
        
        (function(){
                window.onunload=function(){
                        socket.emit('leave_room',{
                                room: getRoomname(),
                                user: getUsername(),
                        });
                }
                $("#text_message_button").on("click",sendTextMessage);
                $("#text_message_input").keydown(function(event){
                        if(event.keyCode==13)//按下回车事件
                                sendTextMessage();
                });
                $("#username").text(getUsername()+"@"+getRoomname());
                $("#page_title").text(getUsername()+"@"+getRoomname());
        }).call();

        
        (function(){
                if(!SVG.supported){
                        alert("svg.js is not supported.");
                }
        }).call();//检测svg.js是否可用



        //键盘移动
        (function(){
                $(document).keydown(function(evt){
                        var dx=0,dy=0;
                        switch(evt.keyCode||evt.which){//这里是“视野移动”所以按键方向和方块移动方向相反
                                case 87:dy=CHUNK_Y_MOVING_SPEED;break;//W
                                case 83:dy=-CHUNK_Y_MOVING_SPEED;break;//S
                                case 65:dx=CHUNK_X_MOVING_SPEED;break;//A
                                case 68:dx=-CHUNK_X_MOVING_SPEED;break;//D
                        };
                        ABSOLUTE_POSITION.moveRelatively(dx,dy);
                });
        }).call();
        DISPLAYED_CHUNKS_STATUS.updateChunks(true);//更新区块
});
