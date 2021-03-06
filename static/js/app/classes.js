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
        var self=this;
        //x,y是chunk在绝对坐标系内的位置，以chunk大小为单位
        //ax,ay是绝对坐标系相对于屏幕的位置，以px为单位
        var div_ele,draw;
        var chunkbase=chunkbase||CHUNK;
        var chunk_id=getChunkId(x,y);

        socket.emit("load_chunk",{x:x,y:y,room:getRoomname()});

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
        div_ele.setAttribute("onselectstart","return false;");//阻止选中
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
        this.graphic_body_list=[];
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

        RIGHT_BUTTON_MENU.addChunk(self);

        this.getEvtX=function(evt){
                return evt.clientX-(parseInt(div_ele.style.left)||0);
        };
        this.getEvtY=function(evt){
                return evt.clientY-(parseInt(div_ele.style.top)||0);
        };

        $(div_ele).on("mousedown",function(evt){
                if(evt.which!=3) return;
        });

        //键盘移动
        $(div_ele).on("mouseover",function(evt){
                SELF_DRAWING_STATUS.chunk_on_focus=true;
        });
        $(div_ele).on("mouseleave",function(evt){
                SELF_DRAWING_STATUS.chunk_on_focus=false;
        });
        
        (function(){
                var mouse_over=false;
                var mx=undefined,my=undefined;
                var start=function(evt,touch){
                        if(!(touch || ((evt.which==1&&LEFT_BUTTON_MODE==LEFT_BUTTON_MODE_CODE.MOVE))||(evt.which==2||mouse_over))) return;
                        mouse_over=true;
                        mx=evt.clientX;
                        my=evt.clientY;
                };
                var stop=function(evt){
                        mouse_over=false;
                        mx=undefined;
                        my=undefined;
                };
                var move=function(evt,touch){
                        if(!mouse_over||(LEFT_BUTTON_MODE!=LEFT_BUTTON_MODE_CODE.MOVE&&evt.which!=2)) return;
                        var dx=parseInt(evt.clientX-mx),dy=parseInt(evt.clientY-my);
                        ABSOLUTE_POSITION.moveRelatively(dx,dy);
                        if(touch) showPosition(VIEW_POSITION.x,VIEW_POSITION.y,"AbsPos");
                        mx=evt.clientX;
                        my=evt.clientY;
                };
                $(div_ele).on("touchstart",function(evt){
                        if(evt.touches.length==1){
                                start(evt.touches[0],true);
                        }
                });
                $(div_ele).on("touchmove",function(evt){
                        if(evt.touches.length==1){
                                move(evt.touches[0],true);
                        }
                });
                $(div_ele).on("touchend",function(evt){
                        if(evt.touches.length==1){
                                stop();
                        }
                });
                $(div_ele).on("mousedown",start);
                $(div_ele).on("mouseup",stop);
                $(div_ele).on("mouseout",stop);
                $(div_ele).on("mouseenter",stop);
                $(div_ele).on("mousemove",move);
        }).call();//支持拖拽
        (function(){//用于左键绘制SVG线条
                function start(evt){
                        if(LEFT_BUTTON_MODE==LEFT_BUTTON_MODE_CODE.DRAW)
                                SELF_DRAWING_STATUS.start(self.getEvtX(evt),self.getEvtY(evt),self);
                }
                //~ draw.on("touchstart",function(evt){
                        //~ if(evt.touches.length==1)
                                //~ start(evt.touches[0]);
                //~ });
                draw.on("mousedown",function(evt){
                        if(evt.which==1)
                                start(evt);
                });
                function stop(evt){
                        SELF_DRAWING_STATUS.stop(self.getEvtX(evt),self.getEvtY(evt),self);
                }
                draw.on("mouseup",stop);
                //~ draw.on("touchend",function(evt){
                        //~ if(evt.touches.length==1)
                                //~ stop(evt.touches[0]);
                //~ });
                function move(evt){
                        showPosition(parseInt(self.getEvtX(evt)),parseInt(self.getEvtY(evt)),chunk_id);
                        if(!SELF_DRAWING_STATUS.drawing) return;
                        if(LEFT_BUTTON_MODE!=LEFT_BUTTON_MODE_CODE.DRAW)
                                SELF_DRAWING_STATUS.stop_in_chunk(self.getEvtX(evt),self.getEvtY(evt),self);
                        var x=self.getEvtX(evt),y=self.getEvtY(evt);
                        if(!SELF_DRAWING_STATUS.last_chunk.id||
                                SELF_DRAWING_STATUS.last_chunk.id!=chunk_id)
                                SELF_DRAWING_STATUS.start_in_chunk(x,y,self);//因为mouseenter事件在鼠标按下的时候不触发所以只能这样处理
                        SELF_DRAWING_STATUS.add_point(x,y,self);
                }
                draw.mousemove(move);
                //~ draw.on("touchmove",function(evt){
                        //~ if(evt.touches.length==1){
                                //~ var tevt=evt.touches[0];
                                //~ var x=self.getEvtX(tevt);
                                //~ var y=self.getEvtY(tevt);
                                //~ if(0<=x&&x<=CHUNK_WIDTH&&0<=y&&y<=CHUNK_HEIGHT)
                                        //~ move(tevt);
                                //~ else{
                                        //~ var target_chunk=getChunk(Math.floor(x/CHUNK_WIDTH),Math.floor(y/CHUNK_HEIGHT));
                                        //~ if(!target_chunk) return;
                                        //~ console.log(x,y);
                                        //~ SELF_DRAWING_STATUS.add_point(
                                                //~ parseInt(getXShiftedBetweenChunks(x,self,target_chunk)),
                                                //~ parseInt(getYShiftedBetweenChunks(y,self,target_chunk)),
                                                //~ target_chunk
                                        //~ );
                                //~ }
                        //~ }
                //~ });
                atAllElement(div_ele,function(div){
                        div.style.width=CHUNK_WIDTH;
                        div.style.height=CHUNK_HEIGHT;
                        $(div).bind("contextmenu",function(evt){
                                return false;
                        });//只阻止可拖拽方块的右键菜单
                });
        }).call(this);
        this.remove=function(){
                this.graphic_body_list.forEach(function(body){
                        if(GRAPHICS[body.id]){
                                GRAPHICS[body.id]=GRAPHICS[body.id].filter(function(body_data){
                                        return body_data.body.chunk_x!=this.x||body_data.body.chunk_y!=this.y;
                                });
                                if(!GRAPHICS[body.id].length)
                                        delete GRAPHICS[body.id];
                        }
                });
                $(div_ele).remove();
                delete CHUNK[this.id];
        };

        this.addGraphicBody=function(body){
                this.graphic_body_list.push(body);
                var path=draw.polyline();
                path.plot(body.points).fill(body.style.fill).stroke(body.style.stroke);
                return path;
        };
        
        return;
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

function ChunkDrawingStatus(style){
        var self=this;
        this.drawing=false;//跨chunk绘制时用于判断的标记
        this.points=[];
        this.polylines_data=[];
        this.last_chunk={
                id:undefined,
                last_stop:undefined,
                chunk:undefined,
        };
        this.items=[];//一次绘制的所有图形
        /*之后做成类可能会比较好*/
        this.style=style||DEFAULT_DRAWING_STYLE;
        this.add_point=function(x,y,chunk){
                this.points.push([x,y]);
                if(!this.points_list) this.start_in_chunk(x,y,chunk);
                this.points_list.push([x,y]);
                /*在这里可以实时上传点*/
                this.chunk_path.plot(this.points_list)
                .fill(this.style.fill)
                .stroke(this.style.stroke);
                this.last_chunk.x=x;
                this.last_chunk.y=y;
        };
        this.start_in_chunk=function(x,y,chunk){
                //因为按下鼠标时不产生mouseleave事件所以只能这样
                if(this.drawing&&this.last_chunk&&this.last_chunk.id&&
                        this.last_chunk.id!=chunk.id){
                        var points_list=[[
                                getXShiftedBetweenChunks(this.last_chunk.x,this.last_chunk.chunk,chunk),
                                getYShiftedBetweenChunks(this.last_chunk.y,this.last_chunk.chunk,chunk)
                                ],[x,y]];
                        var chunk_path=chunk.draw.polyline(points_list.join(" "));
                        this.add_point(
                                getXShiftedBetweenChunks(x,chunk,this.last_chunk.chunk),
                                getYShiftedBetweenChunks(y,chunk,this.last_chunk.chunk),
                                this.last_chunk.chunk
                        );
                        this.stop_in_chunk(x,y,this.last_chunk.chunk);
                        this.chunk_path=chunk_path;
                        this.points_list=points_list;
                }
                else{
                        this.points_list=[[x,y]];
                        this.chunk_path=chunk.draw.polyline(x+","+y);
                }
                this.last_chunk={
                        x:x,y:y,
                        id:chunk.id,
                        chunk:chunk,
                };
        }
        this.start=function(x,y,chunk){
                this.gb_index=0;
                this.id="graphic_"+[getUsername(),new Date().getTime(),getRoomname()].join("_");
                this.start_in_chunk(x,y,chunk);
                this.drawing=true;
                GRAPHICS[this.id]=[];
        }
        this.stop_in_chunk=function(x,y,chunk){
                if(this.chunk_path){//以防出现奇怪的脑残情况 其实这里本来应该有个判断的
                        var body={
                                id:this.id,
                                index:this.gb_index++,
                                chunk_x:chunk.x,
                                chunk_y:chunk.y,
                                author:getUsername(),
                                style:SELF_DRAWING_STATUS.style,
                                room:getRoomname(),
                                create_time:new Date().getTime(),
                                points:this.chunk_path.array.value.join(" "),
                        };
                        GRAPHICS[this.id].push({
                                body:body,
                                path:this.chunk_path,
                        });
                        this.polylines_data.push(body);
                        
                }
                this.chunk_path=
                this.points_list=undefined;
        }
        this.stop=function(x,y,chunk){
                this.stop_in_chunk(x,y,chunk);
                this.drawing=false;
                if(!this.polylines_data.length) return;
                //解决右键触发绘制事件的问题
                this.items.push(this.polylines_data);
                var ugdata={
                        room:getRoomname(),
                        data:this.polylines_data,
                }
                socket.emit("update_graphic",ugdata);
                /*在这里可以把图形打包成对象，方便上传和加载*/
                this.points=[];
                this.polylines_data=[];
        }
}




function GraphicBody(body,chunk){
        var self=this;
        this.body=body;
        ["id","chunk","index","points"].forEach(function(symbol){
                self.__defineGetter__(symbol,function(){
                        return body[symbol];
                })
                self.__defineSetter__(symbol,function(val){
                        body[symbol]=val;
                })
        });
        this.path=chunk.draw.polyline();
}




function Content(x,y,type,chunk,id){
        var div=document.createElement("div");
        div.setAttribute("class","content");
        this.div=div;
        this.type=type;
        var id= id || ["content",getUsername(),new Date().getTime(),getRoomname()].join("_");
        this.id=id;
        div.style.top=y;
        div.style.left=x;
        chunk.div.appendChild(div);
        this.move=function(x,y){
                div.style.top=y;
                div.style.left=x;
                this.update();
        };
        this.setElement=function(ele){
                div.appendChild(ele);
        };
        this.update=function(){
                socket.emit("update_content",{
                        id:this.id,
                        chunk_x:chunk.x,
                        chunk_y:chunk.y,
                        x:div.style.left||0,
                        y:div.style.top||0,
                        room:getRoomname(),
                        type:this.type,
                        data:this.data,
                        create_time:new Date().getTime(),
                });
        };
}

function ImageContent(x,y,data,chunk,id){
        var img=document.createElement("img");
        img.setAttribute("src",data.src);
        this.data=data;
        Content.call(this,x,y,"img",chunk,id);
        this.setElement(img);
        this.update();
}
