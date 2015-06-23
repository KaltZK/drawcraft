define('dc/board',['jquery','svg','dc/graphic','dc/abspos','jquery.mousewheel',],
function($,svg,Graphic,abspos){return function(id){
        var self=this;
        var draw=this.draw=svg(id);
        var element=this.element=document.getElementById(id);
        var graphics=[];
        
        g=draw.polyline("0,0 1000,1000");
        g.stroke({color:"blue",width:2,});

        graphics.push(new Graphic(g,0,this));

        var zIndex=0;
        $(element).bind("mousewheel",function(evt,delta){
                graphics.forEach(function(gr){gr.zoom(zIndex+=delta)});
        });
        $(element).on("mousedown",function(evt){
                switch(evt.which){
                case 2:
                        var x=evt.clientX,y=evt.clientY;
                        $(element).bind("mousemove",function(evt){
                                var dx=+evt.clientX-x;
                                var dy=evt.clientY-y;
                                self.dmove(dx,dy);
                                x=evt.clientX;y=evt.clientY;
                        });
                        $(element).bind("mouseup",function(evt){
                                var dx=evt.clientX-x;
                                var dy=evt.clientY-y;
                                self.dmove(dx,dy);
                                x=evt.clientX;y=evt.clientY;
                                $(element).unbind("mousemove");
                                $(element).unbind("mouseup");
                        });
                        break;
                case 1:
                        var     points=[],
                                line=draw.polyline([evt.clientX,evt.clientY].toLocaleString());
                        line.stroke({color:"blue",width:1});
                        line.fill("none");
                        $(element).bind("mousemove",function(evt){
                                points.push([evt.clientX,evt.clientY]);
                                line.plot(points);
                        });
                        $(element).bind("mouseup",function(evt){
                                points.push([evt.clientX,evt.clientY]);
                                line.plot(points);
                                if(points.length>1)
                                        graphics.push(new Graphic(line,zIndex,self));
                                $(element).unbind("mousemove");
                                $(element).unbind("mouseup");
                        });
                        break;
                }
        });
        $(element).keydown(function(evt){
                var dx=0,dy=0;
                var speed=5;
                switch(evt.keyCode||evt.which){//这里是“视野移动”所以按键方向和方块移动方向相反
                        case 87:dy=speed;break;//W
                        case 83:dy=-speed;break;//S
                        case 65:dx=speed;break;//A
                        case 68:dx=-speed;break;//D
                };
                console.log(evt);
                self.dmove(dx,dy);
        });
        
        this.dmove=function(dx,dy){
                graphics.forEach(function(gr){gr.dmove(dx,dy)});
                abspos.dmove(dx,dy);
        };
}});
