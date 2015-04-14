/*
这是专用于app.html的JavaScript文件
因为上百行JS直接堆在<head>标签里实在不像样所以就分出来了

Update: 因为实在太长了所以拆成了5个文件
*/

//页面加载完成时的初始化操作
/*姑且当成main吧*/
$(document).ready(function(){

        (function(){
                if(!SVG.supported){
                        alert("svg.js is not supported.");
                }
        }).call();//检测svg.js是否可用


        //下面这部分是测试用的，生成两个测试用Chunk
        (function(){
                return;
                chunk1=new Chunk(0,0);
                chunk2=new Chunk(0,1);
                chunk3=new Chunk(1,0);
        }).call();

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
