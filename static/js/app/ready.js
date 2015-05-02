/*
这是专用于app.html的JavaScript文件
因为上百行JS直接堆在<head>标签里实在不像样所以就分出来了

Update: 因为实在太长了所以拆成了5个文件
*/

//页面加载完成时的初始化操作
/*姑且当成main吧*/
var socket;
$(document).on("polymer-ready",function(){
        socket=io.connect();

        (function(){
                socket.emit('enter_room',{
                        room: getRoomname(),
                        user: getUsername(),
                });
                $.cookie("last_room",getRoomname());
                socket.on("text_message",function(message){
                        addTextMessage(message);
                });
        }).call();
        (function(){
                socket.on("update_graphic",function(data){
                        data.forEach(addGraphicBody);
                });
                socket.on("load_graphic_body",addGraphicBody);
                socket.on("update_content",createContent);
                socket.on("load_content",createContent);
                socket.on("remove_graphic",function(msg){
                        removeGraphic(msg.id);
                });
                
        }).call();


        (function(){
                window.onunload=function(){
                        socket.emit('leave_room',{
                                room: getRoomname(),
                                user: getUsername(),
                        });
                        socket.disconnect();
                }
                $("#send_button").on("click",sendTextMessage);
                $("#content_input").keydown(function(event){
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
                        if(!SELF_DRAWING_STATUS.chunk_on_focus) return;
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

        $("#text_message_header").text(getRoomname());


        (function(){
                var dialog=document.getElementById("add-image-dialog");
                var menu=document.getElementById("right-button-menu");
                RIGHT_BUTTON_MENU=menu;
                menu.addItem("Add Image",function(data){
                        dialog.toggle(data);
                });
                dialog.setCallback(function(text,data){
                        createContent({
                                type:"img",
                                chunk_x:data.chunk_x,
                                chunk_y:data.chunk_y,
                                x:data.x,
                                y:data.y,
                                data:{src:text,},
                        });
                });
        }).call();


        DISPLAYED_CHUNKS_STATUS.updateChunks(true);//更新区块

        return;
        //测试用
        (function(){
                var d=document.getElementById("text_message_content");
                for(var i=0;i<=233;i++){
                        var p=document.createElement("p");
                        p.textContent=i;
                        d.appendChild(p);
                }
        }).call();
});
