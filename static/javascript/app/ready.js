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
                socket.on("graphic_done",function(msg){
                        /*
                        //这部分是为了实时绘制做出来的，后来不用了，但姑且留着
                        var cds=CHUNK_DRAWING_STATUS[msg.head.author] ||
                                (CHUNK_DRAWING_STATUS[msg.head.author]=new ChunkDrawingStatus());
                        */
                        var gra=new Graphic(msg.head);
                        gra.extendBodies(msg.body);
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
                        if(!CHUNK_DRAWING_STATUS.$self.chunk_on_focus) return;
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
