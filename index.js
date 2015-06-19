require.config({
        paths:{
                jquery:"//cdn.bootcss.com/jquery/2.1.4/jquery",
                jqueryCookie:"//cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie",
                svg:"//cdn.bootcss.com/svg.js/2.0.0-rc.1/svg",
                'jquery.mousewheel':"//cdn.bootcss.com/jquery-mousewheel/3.1.12/jquery.mousewheel",
        },
        shim:{
                jquery: {
                        exports: '$',
                },
                jqueryUI:{
                        deps:["jquery"],
                },
                jqueryCookie:{
                        deps:["jquery"],
                },
                'jquery.mousewheel':{
                        deps:["jquery"],
                },
        },
});

require(["jquery","svg",'jquery.mousewheel'],function($,svg){
        draw=svg("board");
        g=draw.polyline("0,0 1000,1000");
        g.stroke({color:"blue",width:2,});
        var i=0;
        var w=g.width(),h=g.height();
        $("#board").mousewheel(function(evt,delta){
                var b=Math.exp(i+=delta*0.1);
                g.size(w*b,h*b);
        });
});
