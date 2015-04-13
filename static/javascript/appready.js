/*
这是专用于app.html的JavaScript文件
因为上百行JS直接堆在<head>标签里实在不像样所以就分出来了
*/


//接下来是全局变量 请使用全大写命名
//以下是用来设置的全局变量
CHUNK_WIDTH=300;
CHUNK_HEIGHT=300;
CHUNK_X_MOVING_SPEED=30;
CHUNK_Y_MOVING_SPEED=30;

HIDDEN_AREA_WIDTH=100;//屏幕外区域，预先加载Chunks
HIDDEN_AREA_HEIGHT=100;

//以下是用来保存状态的全局变量
CHUNK_DRAWING_STATUS={
        drawing:false,//跨chunk绘制时用于判断的标记
        points:[],
        polylines_data:[],
        last_chunk:{
                id:undefined,
                last_stop:undefined,
        },
        items:[],//一次绘制的所有图形
        /*之后做成类可能会比较好*/
        style:{
                fill:{
                        color:'none',
                },
                stroke:{
                        color:"red",
                        width: 1,
                },
        },
};


CHUNK={};//存有所有的chunk，以chunk_id为键，以chunk为值
/*for(var i in CHUNK)可以取得所有chunk_id*/

ABSOLUTE_POSITION={
        //绝对坐标系相对视角坐标系的位置
        /*
        这里用了Setter和Getter
        把函数封装成赋值和取值
        看起来比较美观
        */
        _x:0,
        _y:0,//默认在原点
        get x(){return this._x;},
        get y(){return this._y;},
        set x(val){
                moveChunkDiv(val-this._x,0);
                //不知道这样会不会严重降低效率= =
                this._x=val;
        },
        set y(val){
                moveChunkDiv(0,val-this._y);
                this._y=val;
        },
        get screenX(){return this.x+VIEW_POSITION.screenX;},
        get screenY(){return this.y+VIEW_POSITION.screenY;},
        /*不提供相对屏幕坐标的移动函数不然太麻烦了*/

        //显示出来的Chunk编号范围 单位是"chunk"
        get displayedChunksLeft(){return parseInt((VIEW_POSITION.x-(VIEW_POSITION.screenX+HIDDEN_AREA_WIDTH))/CHUNK_WIDTH-1);},
        get displayedChunksRight(){return parseInt((VIEW_POSITION.x+(VIEW_POSITION.screenX+HIDDEN_AREA_WIDTH))/CHUNK_WIDTH);},
        get displayedChunksTop(){return parseInt((VIEW_POSITION.y-(VIEW_POSITION.screenY+HIDDEN_AREA_HEIGHT))/CHUNK_HEIGHT-1);},
        get displayedChunksBottom(){return parseInt((VIEW_POSITION.y+(VIEW_POSITION.screenY+HIDDEN_AREA_HEIGHT))/CHUNK_HEIGHT);},
        displayedChunkStatus:{},//用于储存显示的CHUNK范围
        updateChunks:function(){//判断是否应该更新 并添加和删除CHUNK
                /*这里！未完成！*/
        },
        moveRelatively:function(dx,dy){//相对视角坐标系的移动
                this._x+=dx;
                this._y+=dy;
                moveChunkDiv(dx,dy);
        },
};



VIEW_POSITION={//视野(屏幕中心)相对屏幕(屏幕左上角)的坐标
        get screenX(){return window.screen.availWidth/2;},
        get screenY(){return window.screen.availHeight/2;},
        get x(){return -ABSOLUTE_POSITION.x},//相对于绝对坐标系的位置
        get y(){return -ABSOLUTE_POSITION.y},
};

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

function Chunk(x,y){
        //x,y是chunk在绝对坐标系内的位置，以chunk大小为单位
        //ax,ay是绝对坐标系相对于屏幕的位置，以px为单位
        var div_ele,draw;
        var chunk_id="chunk-"+x+"-"+y;

        /*
        本来想写成getChunk这种函数但还是觉得类比较方便
        这么一想这个判断不是一点意义都没有吗?!
        如果重复的话大概会加两层SVG这样……？
        这样的话就麻烦了，希望svg.js有应对措施
        实在不行的话就用一个列表存下所有产生过的chunk然后clone之类的好了
        */
        if(CHUNK[chunk_id]){//如果已经存在，就复制一份
                for(var p in CHUNK[chunk_id]){
                        this[p]=CHUNK[chunk_id][p];
                }
                return;
        }
        //如果chunk不存在，就新建一个
        CHUNK[chunk_id]=this;
        
        div_ele=document.createElement("div");
        document.getElementById("board").appendChild(div_ele);
        div_ele.id=chunk_id;
        div_ele.classList.add("chunk");
        div_ele.style.width=CHUNK_WIDTH;
        div_ele.style.height=CHUNK_HEIGHT;
        div_ele.style.left=ABSOLUTE_POSITION.screenX+x*CHUNK_WIDTH;
        div_ele.style.top=ABSOLUTE_POSITION.screenY+y*CHUNK_HEIGHT;
        
        draw=SVG(chunk_id).size("100%","100%");

        this.div=div_ele;
        this.id=chunk_id;
        this.draw=draw;
        
        (function(){//用于左键绘制SVG线条
                var lx,ly,chunk_path,points_list;
                var start_drawing=function(evt){

                        //因为按下鼠标时不产生mouseleave事件所以只能这样
                        if(CHUNK_DRAWING_STATUS.last_chunk.id&&
                                CHUNK_DRAWING_STATUS.last_chunk.id!=chunk_id)
                                CHUNK_DRAWING_STATUS.last_chunk.stop(evt);
                        CHUNK_DRAWING_STATUS.last_chunk.id=chunk_id;
                        CHUNK_DRAWING_STATUS.last_chunk.stop=stop_drawing;
                        /*这里的stop_drawing……应该算是闭包吧？*/

                        lx=evt.offsetX;
                        ly=evt.offsetY;
                        points_list=[[lx,ly]];
                        chunk_path=draw.polyline(lx+","+ly);
                };
                var stop_drawing=function(evt){
                        if(chunk_path)//以防出现奇怪的脑残情况 其实这里本来应该有个判断的
                                CHUNK_DRAWING_STATUS.polylines_data.push(chunk_path.array.value);
                        chunk_path=lx=ly=
                        points_list=undefined;
                };
                draw.on("mousedown",function(evt){
                        if(evt.which!=1) return;
                        CHUNK_DRAWING_STATUS.drawing=true;
                        start_drawing(evt);
                });
                draw.on("mouseup",function(evt){
                        stop_drawing(evt);
                        CHUNK_DRAWING_STATUS.drawing=false;
                        CHUNK_DRAWING_STATUS.items.push(CHUNK_DRAWING_STATUS.polylines_data);
                        /*在这里可以把图形打包成对象，方便上传和加载*/
                        CHUNK_DRAWING_STATUS.points=[];
                        CHUNK_DRAWING_STATUS.polylines_data=[];
                });
                draw.mousemove(function(evt){
                        if(!CHUNK_DRAWING_STATUS.drawing) return;
                        if(!points_list) start_drawing(evt);//因为mouseenter事件在鼠标按下的时候不触发所以只能这样处理
                        var x=evt.offsetX,y=evt.offsetY;
                        CHUNK_DRAWING_STATUS.points.push([x,y]);
                        points_list.push([x,y]);
                        /*在这里可以实时上传点*/
                        chunk_path.plot(points_list)
                        .fill(CHUNK_DRAWING_STATUS.style.fill)
                        .stroke(CHUNK_DRAWING_STATUS.style.stroke);
                        
                });
        }).call(this);


        (function(){//测试用
                var text=draw.text(chunk_id);
                text.font({
                        family:   'Helvetica',
                        size:     50,
                        anchor:   'middle',
                        leading:  1.5,
                });
                text.move(3,3);
        }).call(this);
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
        var message={
                author: getUsername(),
                room:   getRoomname(),
                text: text,
        };
        socket.emit("text_message",message);
        $("#text_message_input").val("");
        addTextMessage(message);
}
function atAllElement(css,callback){
        var ele_list=$(css);
        for(var i=0;i<ele_list.length;i++){
                var ele=ele_list[i];
                callback.call(undefined,ele);//"call"的第一个参数是"this"
        }
}
function moveChunkDiv(dx,dy){
        console.log(ABSOLUTE_POSITION.displayedChunksLeft,
        ABSOLUTE_POSITION.displayedChunksRight,
        ABSOLUTE_POSITION.displayedChunksTop,
        ABSOLUTE_POSITION.displayedChunksBottom);
        atAllElement("div.chunk",function(div){
                div.style.left=parseInt(div.style.left||0)+dx;
                div.style.top=parseInt(div.style.top||0)+dy;
        });
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
        }).call();

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
                };
                var stop=function(evt){
                        mouse_over=false;
                        mx=undefined;
                        my=undefined;
                };
                $("div.chunk").on("mousedown",start);
                $("div.chunk").on("mouseup",stop);
                $("div.chunk").on("mouseout",stop);
                $("div.chunk").on("mouseenter",stop);
                $("div.chunk").on("mousemove",function(evt){
                        if(!mouse_over) return;
                        var dx=evt.clientX-mx,dy=evt.clientY-my;
                        ABSOLUTE_POSITION.moveRelatively(dx,dy);
                        mx=evt.clientX;
                        my=evt.clientY;
                });
        }).call();//支持拖拽
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

});
