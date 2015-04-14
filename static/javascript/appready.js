/*
这是专用于app.html的JavaScript文件
因为上百行JS直接堆在<head>标签里实在不像样所以就分出来了
*/


//接下来是全局变量 请使用全大写命名
//以下是用来设置的全局变量
CHUNK_WIDTH=1000;
CHUNK_HEIGHT=1000;
CHUNK_X_MOVING_SPEED=30;
CHUNK_Y_MOVING_SPEED=30;

//控制缩放
Z_MOVING_SPEED=20;
DEFAULT_DEPTH=1;


HIDDEN_AREA_WIDTH=1000;//屏幕外区域，预先加载Chunks
HIDDEN_AREA_HEIGHT=1000;

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



VIEW_POSITION={//视野(屏幕中心)相对屏幕(屏幕左上角)的坐标
        get screenX(){return window.screen.availWidth/2;},
        get screenY(){return window.screen.availHeight/2;},
        get x(){return -ABSOLUTE_POSITION.x},//相对于绝对坐标系的位置
        get y(){return -ABSOLUTE_POSITION.y},
};


ABSOLUTE_POSITION={
        //绝对坐标系相对视角坐标系的位置
        /*
        这里用了Setter和Getter
        把函数封装成赋值和取值
        看起来比较美观
        */
        _x:0,
        _y:0,//默认在原点
        _x:0,
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
        get displayedChunksRange(){return{
                left:this.displayedChunksLeft,
                right:this.displayedChunksRight,
                top:this.displayedChunksTop,
                bottom:this.displayedChunksBottom,
                x:this.x,
                y:this.y,
        }},
        moveRelatively:function(dx,dy){//相对视角坐标系的移动
                this._x+=dx;
                this._y+=dy;
                moveChunkDiv(dx,dy);
        },
};

DISPLAYED_CHUNKS_STATUS={
        range:ABSOLUTE_POSITION.displayedChunksRange,//用于储存显示的CHUNK范围
        updateChunks:function(force){//判断是否应该更新 并添加和删除CHUNK
                var new_status=ABSOLUTE_POSITION.displayedChunksRange;
                var new_chunks={};
                if(!force&&["left","right","top","bottom"].every(function(dire){
                        return DISPLAYED_CHUNKS_STATUS.range[dire]==new_status[dire];
                        //这里用this的话会被坑……js的this真的好坑啊啊啊啊啊
                        }))return;
                for(var i=new_status.left;i<=new_status.right;i++)
                        for(var j=new_status.top;j<=new_status.bottom;j++){
                                var id=getChunkId(i,j);
                                if(CHUNK[id]){
                                        new_chunks[id]=CHUNK[id];
                                        delete CHUNK[id];
                                }
                                else{
                                        new Chunk(i,j,new_chunks);
                                }
                        }
                for(var dc in CHUNK){
                        CHUNK[dc].remove();
                }
                CHUNK=new_chunks;
                this.range=new_status;
        },
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

function Chunk(x,y,chunkbase){
        //x,y是chunk在绝对坐标系内的位置，以chunk大小为单位
        //ax,ay是绝对坐标系相对于屏幕的位置，以px为单位
        var div_ele,draw;
        var chunkbase=chunkbase||CHUNK;
        var chunk_id=getChunkId(x,y);

        /*
        本来想写成getChunk这种函数但还是觉得类比较方便
        这么一想这个判断不是一点意义都没有吗?!
        如果重复的话大概会加两层SVG这样……？
        这样的话就麻烦了，希望svg.js有应对措施
        实在不行的话就用一个列表存下所有产生过的chunk然后clone之类的好了
        */
        if(chunkbase[chunk_id]){//如果已经存在，就复制一份
                for(var p in chunkbase[chunk_id]){
                        this[p]=chunkbase[chunk_id][p];
                }
                return;
        }
        //如果chunk不存在，就新建一个
        chunkbase[chunk_id]=this;
        
        div_ele=document.createElement("div");
        document.getElementById("board").appendChild(div_ele);
        div_ele.id=chunk_id;
        div_ele.classList.add("chunk");
        div_ele.style.width=CHUNK_WIDTH;
        div_ele.style.height=CHUNK_HEIGHT;
        div_ele.style.left=ABSOLUTE_POSITION.screenX+x*CHUNK_WIDTH;
        div_ele.style.top=ABSOLUTE_POSITION.screenY+y*CHUNK_HEIGHT;
        
        draw=SVG(div_ele).size("100%","100%");

        this.x=x;this.y=y;
        this.div=div_ele;
        this.id=chunk_id;
        this.draw=draw;
        /*下面这个不能用*/
        this.resizeByProportion=function(pro){//按照比例缩放
                if(pro==0) throw Error('"pro" can not be 0.');
                div_ele.style.width*=pro;
                div_ele.style.height*=pro;
                draw.children().forEach(function(i){//这样比for方便
                        if(i.size) i.size(i.width()*pro,i.height()*pro);
                        if(i.move) i.move(i.x()*pro,i.y()*pro);
                });
        };
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
                $(div_ele).on("mousedown",start);
                $(div_ele).on("mouseup",stop);
                $(div_ele).on("mouseout",stop);
                $(div_ele).on("mouseenter",stop);
                $(div_ele).on("mousemove",function(evt){
                        if(!mouse_over) return;
                        var dx=evt.clientX-mx,dy=evt.clientY-my;
                        ABSOLUTE_POSITION.moveRelatively(dx,dy);
                        mx=evt.clientX;
                        my=evt.clientY;
                });
        }).call();//支持拖拽
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
                        lx=evt.layerX;
                        ly=evt.layerY;
                        points_list=[[lx,ly]];
                        chunk_path=draw.polyline(lx+","+ly);
                };
                var stop_drawing=function(evt){
                        if(chunk_path)//以防出现奇怪的脑残情况 其实这里本来应该有个判断的
                                CHUNK_DRAWING_STATUS.polylines_data.push(chunk_path.array.value);
                        chunk_path=lx=ly=
                        points_list=undefined;
                };
                var add_point=function(x,y){
                        CHUNK_DRAWING_STATUS.points.push([x,y]);
                        points_list.push([x,y]);
                        /*在这里可以实时上传点*/
                        chunk_path.plot(points_list)
                        .fill(CHUNK_DRAWING_STATUS.style.fill)
                        .stroke(CHUNK_DRAWING_STATUS.style.stroke);
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
                        showPosition(evt.layerX,evt.layerY,chunk_id);
                        if(!CHUNK_DRAWING_STATUS.drawing) return;
                        if(!points_list) start_drawing(evt);//因为mouseenter事件在鼠标按下的时候不触发所以只能这样处理
                        var x=evt.layerX,y=evt.layerY;
                        add_point(x,y);
                });
                atAllElement(div_ele,function(div){
                        div.style.width=CHUNK_WIDTH;
                        div.style.height=CHUNK_HEIGHT;
                        $(div).bind("contextmenu",function(evt){
                                return false;
                        });//只阻止可拖拽方块的右键菜单
                });
        }).call(this);
        this.remove=function(){
                //$("div#"+chunk_id).remove();
                $(div_ele).remove();
                delete CHUNK[this.id];
        };


        (function(){//测试用
                var text=draw.text(chunk_id);
                text.font({
                        family:   'Helvetica',
                        size:     50,
                        anchor:   'middle',
                        leading:  1.5,
                });
                text.move(150,3);
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
function getChunkId(x,y){
        return "chunk("+x+","+y+")";
}
function moveChunkDiv(dx,dy){
        /*console.log(ABSOLUTE_POSITION.displayedChunksLeft,
        ABSOLUTE_POSITION.displayedChunksRight,
        ABSOLUTE_POSITION.displayedChunksTop,
        ABSOLUTE_POSITION.displayedChunksBottom);*/
        atAllElement("div.chunk",function(div){
                div.style.left=parseInt(div.style.left||0)+dx;
                div.style.top=parseInt(div.style.top||0)+dy;
        });
        DISPLAYED_CHUNKS_STATUS.updateChunks();
}
function showPosition(x,y,chunk_id){
        $("#position_label").text("("+x+","+y+")@"+chunk_id);
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
