define('dc/board',['jquery','svg','jquery.mousewheel'],
function($,svg){return function(id){
        draw=this.draw=svg(id);
        element=this.element=document.getElementById(id);
        var     centerX=window.screen.availWidth/2,
                centerY=window.screen.availHeight/2;
        g=draw.polyline("0,0 1000,1000");
        g.stroke({color:"blue",width:2,});
        var i=0;
        var width=g.width(),height=g.height();
        var gX=g.x(),gY=g.y();
        $(element).bind("mousewheel",function(evt,delta){
                var b=Math.exp(i+=delta*0.05);
                g.size(width*b,height*b);
                g.move(centerX-(centerX-g.x())*b,centerY-(centerY-g.y())*b);
                console.log(delta);
        });
        $(element).on("mousedown",function(evt){
                if(evt.which!=1) return;
                var x=evt.clientX,y=evt.clientY;
                $(element).bind("mousemove",function(evt){
                        gX=g.x()+evt.clientX-x;
                        gY=g.y()+evt.clientY-y;
                        g.move(gX,gY);
                        x=evt.clientX;y=evt.clientY;
                });
                $(element).bind("mouseup",function(evt){
                        gX=g.x()+evt.clientX-x;
                        gY=g.y()+evt.clientY-y;
                        g.move(gX,gY);
                        $(element).unbind("mousemove");
                        $(element).unbind("mouseup");
                });
        });
}});
