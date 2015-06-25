define("dc/graphic",['jquery','svg','dc/posfuncs'],function($,svg,posfuncs){
        //debug用
        centerdiv.style.left=posfuncs.centerX();
        centerdiv.style.top=posfuncs.centerY();
Graphic=function(polyline,zIndex,board){
        var self=this;
        this.polyline=polyline;
        this.board=board;
        var abspos=board.abspos;
        
        var pwidth=polyline.width(),pheight=polyline.height();
        var px=polyline.x(),py=polyline.y();//图形相对屏幕位置
        var     width=polyline.width()/posfuncs.zoomMapping(zIndex),
                height=polyline.height()/posfuncs.zoomMapping(zIndex),
                absx=abspos.mapXToAbs(px),//图形相对绝对坐标位置
                absy=abspos.mapYToAbs(py);


        this.updateZoom=function(){
                var     centerX=window.screen.availWidth/2,
                        centerY=window.screen.availHeight/2;
                var multiple=posfuncs.zoomMapping(abspos.z());
                if(multiple<1e-6) return;
                polyline.size(width*multiple,height*multiple);
                polyline.move(abspos.reMapXFromAbs(absx),abspos.reMapYFromAbs(absy));
        };
        this.updatePos=function(){
                polyline.move(abspos.reMapXFromAbs(absx),abspos.reMapYFromAbs(absy));
        };
        
        this.toStruct=function(){
                return{
                        x:absx,y:absy,
                };
        };
};
return Graphic;

});
