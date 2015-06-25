define('dc/board',['jquery','svg','dc/graphic','dc/abspos','jquery.mousewheel',],
function($,svg,Graphic,AbsPos){return function(id){
        var self=this;
        var element=this.element=document.getElementById(id);
        var draw=this.draw=svg(element);
        var graphics=[];
        var abspos=this.abspos=new AbsPos(this);

        $(element).bind("mousewheel",function(evt,delta){
                abspos.dzoom(delta);
                graphics.forEach(function(gr){gr.updateZoom()});
                absdiv.style.left=abspos.x();
                absdiv.style.top=abspos.y();
        });
        $(element).on("mousedown",function(evt){
                switch(evt.which){
                case 2:
                        var x=evt.clientX,y=evt.clientY;
                        $(element).bind("mousemove",function(evt){
                                self.dmove(evt.clientX-x,evt.clientY-y);
                                x=evt.clientX;y=evt.clientY;
                        });
                        $(element).bind("mouseup",function(evt){
                                self.dmove(evt.clientX-x,evt.clientY-y);
                                $(element).unbind("mousemove");
                                $(element).unbind("mouseup");
                        });
                        break;
                case 1:
                        var     points=[],
                                line=draw.polyline([evt.clientX,evt.clientY].toLocaleString());
                        var style={stroke:{color:"blue",width:1},fill:"none"};
                        line.stroke(style.stroke);
                        line.fill(style.fill);
                        $(element).bind("mousemove",function(evt){
                                points.push([evt.clientX,evt.clientY]);
                                line.plot(points);
                        });
                        $(element).bind("mouseup",function(evt){
                                points.push([evt.clientX,evt.clientY]);
                                line.plot(points);
                                if(points.length>1)
                                        graphics.push(new Graphic(line,self,style));
                                $(element).unbind("mousemove");
                                $(element).unbind("mouseup");
                        });
                        break;
                }
        });
        $(document).on("keydown",function(evt){console.log(evt.keyCode)});
        this.dmove=function(dx,dy){
                abspos.dmove(dx,dy);
                graphics.forEach(function(gr){gr.updatePos()});
                absdiv.style.left=abspos.x();
                absdiv.style.top=abspos.y();
        };

}});
