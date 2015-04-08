/*
这是专用于app.html的JavaScript文件
因为上百行JS直接堆在<head>标签里实在不像样所以就分出来了
*/


//接下来是全局变量 用来设置的 请使用全大写命名
CHUNK_WIDTH=300;
CHUNK_HEIGHT=300;




//接下来的部分是类
/*
JavaScript是基于原型的面向对象，所以下面这些其实并不能算是“类”
而是类似构造函数的东西
new运算符会直接传进一个空对象this
然后构造函数就会在this上加上各种奇奇怪怪的东西

顺便
var obj=new Chunk(x,y);
和
var obj={};
Chunk.call(obj,x,y);
效果似乎一样，用call调用的话第一个参数就会变成this
这样的话应该能实现继承？
*/

function Chunk(x,y,ax,ay){
        //x,y是chunk在绝对坐标系内的位置，以chunk大小为单位
        //ax,ay是绝对坐标系相对于屏幕的位置，以px为单位
        var chunk_id="chunk-"+x+"-"+y;
        var div_ele=document.getElementById(chunk_id);
        ax=ax||0;//如果ax未提供则默认为0，下同
        ay=ay||0;
        /*
        这里用到了逻辑或运算短路
        与C不同，在JavaScript，a||b，当a的值为非(false,0,"",null,undefined等)则返回b
        */


        
        /*
        本来想写成getChunk这种函数但还是觉得类比较方便
        这么一想这个判断不是一点意义都没有吗?!
        如果重复的话大概会加两层SVG这样……？
        这样的话就麻烦了，希望svg.js有应对措施
        实在不行的话就用一个列表存下所有产生过的chunk然后clone之类的好了
        */
        if(!div_ele){//如果chunk不存在，就新建一个
                div_ele=document.createElement("div");
                document.getElementById("board").appendChild(div_ele);
                div_ele.id=chunk_id;
                div_ele.classList.add("chunk");
                div_ele.style.width=CHUNK_WIDTH;
                div_ele.style.height=CHUNK_HEIGHT;
                div_ele.style.left=ax+x*CHUNK_WIDTH;
                div_ele.style.top=ay+y*CHUNK_HEIGHT;
        }
        this.div=div_ele;
        this.draw=SVG(chunk_id).size("100%","100%");
}



//全局函数
function addTextMessage(message){
        var divs=$("#text_messages");
        var para=document.createElement("p");
        para.textContent=message.author+": "+message.text;
        divs.append(para);
        
}
function sendTextMessage(){
        var text=$("#text_message_input").val();
        if(!text) return;
        message={
                author: getUsername(),
                room:   getRoomname(),
                text: text,
        };
        socket.emit("text_message",message);
        $("#text_message_input").val("");
        addTextMessage(message);
}





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
                chunk1=new Chunk(0,0);
                chunk2=new Chunk(0,1);
                chunk3=new Chunk(1,0);
                chunk3.div.style.background=
                chunk1.div.style.background=
                chunk2.div.style.background="green";
                var draw=chunk1.draw;
                var text = draw.text('SVG.JS').move(50,0);
                text.font({
                        family: 'Source Sans Pro',
                        size: 30,
                        anchor: 'middle',
                        leading: 1,
                });
        }).call();


        var atAllElement=function(css,callback){
                var ele_list=$(css);
                for(var i=0;i<ele_list.length;i++){
                        var ele=ele_list[i];
                        callback.call(undefined,ele);//"call"的第一个参数是"this"
                }
        };
        var moveChunkDiv=function(dx,dy){
                atAllElement("div.chunk",function(div){
                        div.style.left=parseInt(div.style.left||0)+dx;
                        div.style.top=parseInt(div.style.top||0)+dy;
                });
        };//要加分号否则后面的括号会被当作调用运算符
        (function(){
                atAllElement("div.chunk",function(div){
                        div.style.width=CHUNK_WIDTH;
                        div.style.height=CHUNK_HEIGHT;
                        $(div).bind("contextmenu",function(evt){
                                return false;
                        });//只阻止可拖拽方块的右键菜单
                });
        }).call();
        (function(){
                var mouse_over=false;
                var mx=undefined,my=undefined;
                var start=function(evt){
                        if(evt.which!=3||mouse_over) return;
                        mouse_over=true;
                        mx=evt.clientX;
                        my=evt.clientY;
                }
                var stop=function(evt){
                        mouse_over=false;
                        mx=undefined;
                        my=undefined;
                }
                $("div.chunk").on("mousedown",start);
                $("div.chunk").on("mouseup",stop);
                $("div.chunk").on("mouseout",stop);
                $("div.chunk").on("mouseenter",stop);
                $("div.chunk").on("mousemove",function(evt){
                        if(!mouse_over) return;
                        var dx=evt.clientX-mx,dy=evt.clientY-my;
                        moveChunkDiv(dx,dy);
                        mx=evt.clientX;
                        my=evt.clientY;
                });
        }).call();//支持拖拽
        //键盘移动
        (function(){
                var speed=10;
                $(document).keydown(function(evt){
                        var dx=0,dy=0;
                        switch(evt.keyCode||evt.which){
                                case 87:dy=speed;break;//W
                                case 83:dy=-speed;break;//S
                        }
                        switch(evt.keyCode||evt.which){
                                case 65:dx=speed;break;//A
                                case 68:dx=-speed;break;//D
                        }
                        moveChunkDiv(dx,dy);
                });
        }).call();

});
