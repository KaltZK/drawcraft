define("dc/abspos",['dc/posfuncs'],function(posfuncs){
return {
        __screen:{//相对屏幕的状态
                x:posfuncs.centerX(),y:posfuncs.centerY(),//坐标原点相对屏幕左上角的位置
                zIndex:0,//视野相对绝对坐标平面的高度
        },
        x:function(){return this.__screen.x},
        y:function(){return this.__screen.y},
        z:function(){return this.__screen.zIndex},
        dmove:function(dx,dy){this.__screen.x+=dx;this.__screen.y+=dy;},
        dzoom:function(dz){
                this.__screen.x=posfuncs.mapX(this.__screen.x,this.__screen.zIndex,this.__screen.zIndex+dz);
                this.__screen.y=posfuncs.mapY(this.__screen.y,this.__screen.zIndex,this.__screen.zIndex+dz);
                this.__screen.zIndex+=dz;
        },
        //之后应改成对任意输入的z都能起效
        zoomMapping:function(){return posfuncs.zoomMapping(this.z());},
        mapXToAbs:function(px){
                return (px-this.x())/this.zoomMapping();
        },
        mapYToAbs:function(py){
                return (py-this.y())/this.zoomMapping();
        },
        reMapXFromAbs:function(absx){return this.x()+absx*this.zoomMapping();},
        reMapYFromAbs:function(absy){return this.y()+absy*this.zoomMapping();},
};
});
