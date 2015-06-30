define("dc/graphic",['jquery','svg','dc/posfuncs','dc/color'],function($,svg,posfuncs,color){
        //debug用
        centerdiv.style.left=posfuncs.centerX();
        centerdiv.style.top=posfuncs.centerY();
Graphic=function(polyline,manager){
        var self=this;
        this.polyline=polyline;
        this.board=manager.board;
        var style=manager.style;
        var abspos=this.abspos=manager.board.abspos;

        manager.graphics.push(this);
        
        var pwidth=polyline.width(),pheight=polyline.height();
        var px=polyline.x(),py=polyline.y();//图形相对屏幕位置
        var     width=polyline.width()/posfuncs.zoomMapping(abspos.z()),
                height=polyline.height()/posfuncs.zoomMapping(abspos.z());
        var absx=this.absx=abspos.mapXToAbs(px);//图形相对绝对坐标位置
        var absy=this.absy=abspos.mapYToAbs(py);
        this.absPoints=polyline._array.value.map(function(pos){
                return [abspos.mapXToAbs(pos[0]),
                abspos.mapYToAbs(pos[1])];
        });


        polyline.on("mouseenter",function(evt){
                self.polyline.stroke({
                        width:style.stroke.width+7,
                        opacity:1,
                });
        });
        $(polyline.node).on("contextmenu",function(evt){
                console.log("click!");
                return false;//阻止父元素获取事件
        });
        polyline.on("mouseleave",function(evt){
                self.polyline.stroke(style.stroke);
        });

        this.scrX=function(){return abspos.reMapXFromAbs(absx)};
        this.scrY=function(){return abspos.reMapYFromAbs(absy)};

        this.updateZoom=function(){
                var     centerX=posfuncs.centerX(),
                        centerY=posfuncs.centerY();
                var multiple=posfuncs.zoomMapping(abspos.z());
                if(multiple<1e-6) return;
                this.polyline.size(width*multiple,height*multiple);
                this.polyline.move(abspos.reMapXFromAbs(this.absx),
                        abspos.reMapYFromAbs(this.absy));
        };
        this.updatePos=function(){
                this.polyline.move(abspos.reMapXFromAbs(this.absx),
                        abspos.reMapYFromAbs(this.absy));
        };

        this.chunkRight=function(){return Math.ceil((this.absx+width)/posfuncs.chunkWidth);};//最右侧所在chunk
        this.chunkLeft=function(){return Math.floor(this.absx/posfuncs.chunkWidth);};
        this.chunkBottom=function(){return Math.ceil((this.absy+height)/posfuncs.chunkHeight);};
        this.chunkTop=function(){return Math.floor(this.absy/posfuncs.chunkHeight);};
                
        this.toStruct=function(){
                return{
                        x:absx,y:absy,
                        width:width,height:height,
                        points:this.absPoints,
                        style:style,
                        chunk:{
                                right:this.chunkRight(),
                                left:this.chunkLeft(),
                                top:this.chunkTop(),
                                bottom:this.chunkBottom(),
                        },
                };
        };
};

Graphic.Manager=function(board){
        this.board=board;
        this.graphics=[];
        this.style={stroke:{color:"#5677fc",width:2,opacity:0.5},fill:"none"};
        this.updateZoom=function(dz){
                this.graphics.forEach(function(gr){gr.updateZoom()});
                absdiv.style.left=board.abspos.x();
                absdiv.style.top=board.abspos.y();
        }
        this.updatePos=function(){
                this.graphics.forEach(function(gr){gr.updatePos()});
        }
        this.fromStruct=function(struct){
                console.log("s:",
                        struct.chunk.right,
                        struct.chunk.left,
                        struct.chunk.bottom,
                        struct.chunk.top
                );
                var points=struct.points.map(function(pos){
                                return [board.abspos.reMapXFromAbs(pos[0]),
                                board.abspos.reMapYFromAbs(pos[1])];
                });
                var line=board.draw.polyline(points);
                line.fill(this.style.fill);
                line.stroke(this.style.stroke);
                var gr=new Graphic(line,this);
                return gr;
        };
        this.updateNewGraphic=function(struct){
                if(     struct.chunk.left<=board.abspos.chunkRight()&&
                        struct.chunk.right>=board.abspos.chunkLeft()&&
                        struct.chunk.bottom>=board.abspos.chunkTop()&&
                        struct.chunk.top<=board.abspos.chunkBottom())
                        return this.fromStruct(struct);
        };
}
return Graphic;
});