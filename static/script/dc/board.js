define( 'dc/board',['jquery','svg','dc/graphic','dc/abspos','dc/io',
        'dc/infofuncs','dc/boardevents','dc/board-device-events'],
function($,svg,Graphic,AbsPos,IO,infofuncs,BoardEvents,initDeviceEvents){return function(id,liteMode){
        var self=this;
        this.room=infofuncs.getRoom();
        var element=this.element=document.getElementById(id);
        var draw=this.draw=svg(element);
        var abspos=this.abspos=new AbsPos(this);
        var io=this.io=new IO(this.room);
        this.io.connect();
        var graphicsManager=this.graphicsManager=new Graphic.Manager(this);
        var eventsManager=this.eventsManager=new BoardEvents(this);

        this.touchMode=0;
        /*
        0: Draw
        1: Move
        */
        
        //~ $(element).bind("contextmenu",function(evt){console.log(evt);return false;});
        //屏蔽右键菜单&使用自制右键菜单

        this.dmove=function(dx,dy){
                abspos.dmove(dx,dy);
                graphicsManager.updatePos();
                eventsManager.send("move",
                        abspos.viewX(),abspos.viewY(),abspos.height());
                
                absdiv.style.left=abspos.x();
                absdiv.style.top=abspos.y();
        };
        this.dzoom=function(delta){
                self.abspos.dzoom(delta);
                self.graphicsManager.updateZoom();
                eventsManager.send("zoom",
                        self.abspos.viewX(),self.abspos.viewY(),self.abspos.height());
        };
        initDeviceEvents(self,liteMode);
        

}});
