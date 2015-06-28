var d=10,a=0.2;
var z0=-Math.tan((1-a-d)*Math.PI/(2*d));
define("dc/posfuncs",{
chunkWidth:10000,
chunkHeight:10000,
zoomMapping:function(zIndex){
        //将高度映射为倍率的函数
        //对-inf<zIndex<inf有
        //zoomMapping>=minZoom>0 zoomMapping(0)=1
        //~ return Math.exp((zIndex||0)/10)/2+0.5;
        //~ return Math.exp((zIndex||0)/10);//这是测试用的
        //~ return  (Math.atan((zIndex||0)/10)/Math.PI+1);
        return Math.atan(zIndex/10-z0)/Math.PI*2*d+a+d;
},
centerX:function(width){return (width||window.screen.availWidth)/2;},
centerY:function(height){return (height||window.screen.availHeight)/2;},
mapPos:function(x1,z1,z2,cx){return cx-this.zoomMapping(z2)/this.zoomMapping(z1)*(cx-x1);},
mapX:function(x1,z1,z2){return this.mapPos(x1,z1,z2||0,this.centerX());},
mapY:function(y1,z1,z2){return this.mapPos(y1,z1,z2||0,this.centerY());},
reMapPos:function(){},
});
