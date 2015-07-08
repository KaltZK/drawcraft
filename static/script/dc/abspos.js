define("dc/abspos",['dc/posfuncs'],function(posfuncs){
return function(board){
        this.__screen={//相对屏幕的状态
                x:posfuncs.centerX(),y:posfuncs.centerY(),//坐标原点相对屏幕左上角的位置
                z:0,//视野相对绝对坐标平面的高度
        };
        this.x=function(){return this.__screen.x};
        this.y=function(){return this.__screen.y};
        this.z=function(){return this.__screen.z};
        this.viewX=function(){return -(this.x()-posfuncs.centerX())/this.zoomMapping()};
        this.viewY=function(){return -(this.y()-posfuncs.centerY())/this.zoomMapping()};
        this.height=function(){return 1/this.zoomMapping()};
        this.dmove=function(dx,dy){this.__screen.x+=dx;this.__screen.y+=dy;};
        this.dzoom=function(dz){
                this.__screen.x=posfuncs.mapX(this.__screen.x,this.__screen.z,this.__screen.z+dz);
                this.__screen.y=posfuncs.mapY(this.__screen.y,this.__screen.z,this.__screen.z+dz);
                this.__screen.z+=dz;
        };
        //之后应改成对任意输入的z都能起效
        this.zoomMapping=function(){return posfuncs.zoomMapping(this.z());};
        this.mapXToAbs=function(px){
                return (px-this.x())/this.zoomMapping();
        };
        this.mapYToAbs=function(py){
                return (py-this.y())/this.zoomMapping();
        };
        this.reMapXFromAbs=function(absx){return this.x()+absx*this.zoomMapping();};
        this.reMapYFromAbs=function(absy){return this.y()+absy*this.zoomMapping();};

        //当前视野在绝对坐标系上的大小
        this.viewLeft=function(){return this.mapXToAbs(0)};
        this.viewRight=function(){return this.mapXToAbs(window.screen.availWidth)};
        this.viewTop=function(){return this.mapYToAbs(0)};
        this.viewBottom=function(){return this.mapYToAbs(window.screen.availHeight)};

        this.chunkLeft=function(){return Math.floor(this.viewLeft()/posfuncs.chunkWidth)};
        this.chunkRight=function(){return Math.floor(this.viewRight()/posfuncs.chunkWidth)};
        this.chunkTop=function(){return Math.floor(this.viewTop()/posfuncs.chunkHeight)};
        this.chunkBottom=function(){return Math.floor(this.viewBottom()/posfuncs.chunkHeight)};
        this.__chunk={l:this.chunkLeft(),t:this.chunkTop(),
                      r:this.chunkRight(),b:this.chunkBottom()};
        this.chunkChanged=function(){
        };
};
});
