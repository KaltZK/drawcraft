define("dc/graphic",['jquery','svg','dc/posfuncs','dc/color','dc/infofuncs'],function($,svg,posfuncs,color,infofuncs){
        //debug用
        //~ centerdiv.style.left=posfuncs.centerX();
        //~ centerdiv.style.top=posfuncs.centerY();
Graphic=function(polyline,id,manager,style_){
        var self=this;
        this.polyline=polyline;
        this.board=manager.board;
        var style;
        if(style_)style=style_;
        else{
                style={
                        fill:"none",
                        stroke:{
                                color:manager.style.stroke.color,
                                width:manager.style.stroke.width,
                                opacity:manager.style.stroke.opacity,
                        },
                };
        }
        var abspos=this.abspos=manager.board.abspos;
        this.id=id;

        manager.graphics.push(this);
        
        var pwidth=polyline.width(),pheight=polyline.height();
        var px=polyline.x(),py=polyline.y();//图形相对屏幕位置
        var     width=polyline.width()/posfuncs.zoomMapping(abspos.z()),
                height=polyline.height()/posfuncs.zoomMapping(abspos.z());
        var absx=this.absx=abspos.mapXToAbs(px);//图形相对绝对坐标位置
        var absy=this.absy=abspos.mapYToAbs(py);
        this.absPoints=polyline.array.value.map(function(pos){
                return [abspos.mapXToAbs(pos[0]),
                abspos.mapYToAbs(pos[1])];
        });
        this.hide=function(){
                this.polyline.remove();
        };
        this.remove=function(){
                this.hide();
                $.event.trigger({
                        type:"remove_graphic",
                        id:self.id,
                });
        };
        polyline.on("mouseenter",function(evt){
                self.polyline.stroke({
                        width:style.stroke.width+7,
                        opacity:1,
                });
        });
        $(polyline.node).on("contextmenu",function(evt){
                self.remove();
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
                        cright:this.chunkRight(),
                        cleft:this.chunkLeft(),
                        ctop:this.chunkTop(),
                        cbottom:this.chunkBottom(),
                        id:this.id,
                };
        };
};
Graphic.style={stroke:{color:"#5677fc",width:20,opacity:0.6},fill:"none"};
Graphic.Manager=function(board){
        this.board=board;
        var abspos=board.abspos;
        var draw=board.draw;
        var graphics=this.graphics=[];
        var style=this.style=Graphic.style;
        var new_graphic_status=undefined;
        this.updateZoom=function(dz){
                this.graphics.forEach(function(gr){gr.updateZoom()});
                //~ absdiv.style.left=board.abspos.x();
                //~ absdiv.style.top=board.abspos.y();
                if(new_graphic_status &&
                   new_graphic_status.points.length)with(new_graphic_status){
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
                line.fill(struct.style.fill);
                line.stroke(struct.style.stroke);
                var gr=new Graphic(line,struct.id,this,struct.style);
                return gr;
        };
        this.updateNewGraphic=function(struct){
                if(     struct.chunk.left<=board.abspos.chunkRight()&&
                        struct.chunk.right>=board.abspos.chunkLeft()&&
                        struct.chunk.bottom>=board.abspos.chunkTop()&&
                        struct.chunk.top<=board.abspos.chunkBottom())
                        return this.fromStruct(struct);
        };
        this.pullInnerGraphics=function(evt){
                board.io.pullInnerGraphics({
                        left:board.abspos.chunkLeft(),
                        right:board.abspos.chunkRight(),
                        top:board.abspos.chunkTop(),
                        bottom:board.abspos.chunkBottom(),
                });
        };
        this.cleanOuterGraphics=function(){
                this.graphics.forEach(function(gr){
                        gr.hide();
                });
                this.graphics=[];
                return;//姑且用这种简单粗暴的方法
                function filter(gr){
                        return gr.chunkLeft()>board.abspos.chunkRight()||
                        gr.chunkRight()<board.abspos.chunkLeft()||
                        gr.chunkBottom()<board.abspos.chunkTop()||
                        gr.chunkTop()>board.abspos.chunkBottom();
                }
                this.graphics.filter(filter).forEach(function(gr){
                        gr.hide();});
                this.graphics=this.graphics.filter(function(gr){
                        return !filter(gr);});
        };
        this.hideGraphicById=function(id){
                this.graphics.filter(function(g){
                        return g.id==id;
                }).forEach(function(g){
                        g.hide();
                });
        };
        (function(){
                var lx,ly;
                this.newGraphic=function(px,py){//如果焦点暂时离开就会产生两个一样的graphic，目前没想出解决方法
                        if(new_graphic_status==undefined){
                                new_graphic_status={
                                        polyline:draw.polyline([]),
                                        points:[],
                                };
                        }
                        with(new_graphic_status){
                                polyline.stroke(style.stroke);
                                polyline.fill(style.fill);
                        }
                        this.addGraphicPoint(px,py)
                };
                this.addGraphicPoint=function(px,py){
                        if(new_graphic_status==undefined || (px==lx&&py==ly)) return;
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
                        lx=px;ly=py;
                };
                this.finishGraphic=function(px,py){
                        if(new_graphic_status==undefined) return;
                        if(px!=undefined&&py!=undefined) this.addGraphicPoint(px,py);
                        if(new_graphic_status.points.length<=1){
                                new_graphic_status=undefined;
                                return null;
                        }
                        var ngr=new Graphic(new_graphic_status.polyline,infofuncs.newId(),this);
                        new_graphic_status=undefined;
                        return ngr;
                };
        }).call(this);
}
return Graphic;
});
