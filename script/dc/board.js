define('dc/board',['jquery','svg','jquery.mousewheel'],
function($,svg){return function(id){
        draw=this.draw=svg(id);
        element=this.element=document.getElementById(id);
        g=draw.polyline("0,0 1000,1000");
        g.stroke({color:"blue",width:2,});
        var i=0;
        var width=g.width(),height=g.height();
        $(element).bind("mousewheel",function(evt,delta){
                var b=Math.exp(i+=delta*0.05);
                g.size(width*b,height*b);
        });
        $(element).bind("mousedown",function(evt){
                if(evt.which!=1) return;
                var x=evt.clientX,y=evt.clientY;
                $(element).bind("mousemove",function(evt){
                        g.move(g.x()+evt.clientX-x,g.y()+evt.clientY-y);
                        x=evt.clientX;y=evt.clientY;
                });
                $(element).bind("mouseup",function(evt){
                        $(element).unbind("mousemove");
                        $(element).unbind("mouseup");
                });
        });
}});
