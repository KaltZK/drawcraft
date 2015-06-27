define('dc/board',['jquery','svg','dc/graphic','dc/abspos','dc/io','dc/infofuncs','jquery.mousewheel',],
function($,svg,Graphic,AbsPos,IO,infofuncs){return function(id){
        var self=this;
        var element=this.element=document.getElementById(id);
        var draw=this.draw=svg(element);
        var graphics=[];
        var abspos=this.abspos=new AbsPos(this);
        var io=this.io=new IO(infofuncs.getRoom());

        var gstyle={stroke:{color:"#5677fc",width:3,opacity:0.5},fill:"none"};
        g=draw.polyline("0,0 "+[document.body.clientWidth,document.body.clientHeight].toString());
        g.stroke(gstyle.stroke);
        g.fill(gstyle.fill);
        graphics.push(new Graphic(g,this,gstyle));

        $(element).bind("contextmenu",function(evt){console.log(evt);return false;});
        //屏蔽右键菜单&使用自制右键菜单

        $(element).bind("mousewheel",function(evt,delta){
                abspos.dzoom(delta);
                console.log(abspos.chunkLeft(),abspos.chunkRight(),abspos.chunkTop(),abspos.chunkBottom());
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
                        var style={stroke:{color:"#5677fc",width:2,opacity:0.5},fill:"none"};
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
        $(document).on("keydown",function(evt){
                var speed=25,dx=0,dy=0;
                switch(evt.keyCode){
                case 37://LEFT
                case 65:dx=speed;break;//A
                case 39://RIGHT
                case 68:dx=-speed;break;//D
                case 38://UP
                case 87:dy=speed;break;//W
                case 40://BOTTOM
                case 83:dy=-speed;break;//S
                }
                self.dmove(dx,dy);
        });
        this.dmove=function(dx,dy){
                abspos.dmove(dx,dy);
                graphics.forEach(function(gr){gr.updatePos()});
                absdiv.style.left=abspos.x();
                absdiv.style.top=abspos.y();
        };

}});
