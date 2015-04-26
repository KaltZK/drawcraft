//以下是用来保存状态的全局变量

SELF_DRAWING_STATUS=new ChunkDrawingStatus;

GRAPHICS={};


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
