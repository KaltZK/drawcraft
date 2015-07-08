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
                        loc:{
                                x:absx,
                                y:absy,
                        },
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
        var abspos=board.abspos;
        var draw=board.draw;
        this.graphics=[];
        var style=this.style={stroke:{color:"#5677fc",width:2,opacity:0.5},fill:"none"};
        var new_graphic_status=undefined;
        this.updateZoom=function(dz){
                this.graphics.forEach(function(gr){gr.updateZoom()});
                absdiv.style.left=board.abspos.x();
                absdiv.style.top=board.abspos.y();
                if(new_graphic_status)with(new_graphic_status){
                        var     centerX=posfuncs.centerX(),
                                centerY=posfuncs.centerY();
                        var multiple=posfuncs.zoomMapping(abspos.z());
                        if(multiple<1e-6) return;
                        polyline.size(width*multiple,height*multiple);
                        polyline.move(
                                abspos.reMapXFromAbs(absx),
                                abspos.reMapYFromAbs(absy)
                        );
                }
        }
        this.updatePos=function(){
                this.graphics.forEach(function(gr){gr.updatePos()});
                if(new_graphic_status) with(new_graphic_status){
                        polyline.move(
                                abspos.reMapXFromAbs(absx),
                                abspos.reMapYFromAbs(absy)
                        );
                }
        }
        this.fromStruct=function(struct){
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

        (function(){
                this.newGraphic=function(px,py){
                        new_graphic_status={
                                polyline:draw.polyline([]),
                                points:[],
                        };
                        with(new_graphic_status){
                                polyline.stroke(style.stroke);
                                polyline.fill(style.fill);
                        }
                        this.addGraphicPoint(px,py)
                };
                this.addGraphicPoint=function(px,py){
                        new_graphic_status.points.push([
                                abspos.mapXToAbs(px),
                                abspos.mapYToAbs(py)]);
                        new_graphic_status.polyline.plot(
                                new_graphic_status.points.map(function(p){
                                return [abspos.reMapXFromAbs(p[0]),
                                        abspos.reMapYFromAbs(p[1])]}));
                        new_graphic_status.width=
                                new_graphic_status.polyline.width()
                                /posfuncs.zoomMapping(abspos.z());
                        new_graphic_status.height=
                                new_graphic_status.polyline.height()
                                /posfuncs.zoomMapping(abspos.z());
                        new_graphic_status.absx=
                                abspos.mapXToAbs(
                                new_graphic_status.polyline.x());
                        new_graphic_status.absy=
                                abspos.mapYToAbs(
                                new_graphic_status.polyline.y());
                };
                this.finishGraphic=function(px,py){
                        if(px!=undefined&&py!=undefined) this.addGraphicPoint(px,py);
                        if(new_graphic_status.points.length<1) return null;
                        var ngr=new Graphic(new_graphic_status.polyline,this);
                        new_graphic_status=undefined;
                        return ngr;
                };
        }).call(this);
}
return Graphic;
});
