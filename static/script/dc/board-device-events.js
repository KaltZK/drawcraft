define("dc/board-device-events",["jquery","dc/infofuncs",'jquery.mousewheel',"jquery.touch"],function($,infofuncs){
return  function(self,liteMode){
        $(self.element).bind("mousewheel",function(evt,delta){
                self.dzoom(delta);
                return false;
        });


        var mouse_config={
                onevt:"mousemove",
                doneevt:"mouseup",
                element:self.element,
                evt2x:function(evt){return evt.clientX},
                evt2y:function(evt){return evt.clientY},
        };
        $(self.element).bind("mousedown",function(evt){
                switch(evt.which){
                case 2: initMove(evt,mouse_config);break;
                case 1:
                        switch(self.touchMode){
                        case 0: initDraw(evt,mouse_config);break;
                        case 1: initMove(evt,mouse_config);break;
                        }
                        break;
                }
                return false;
        });
        var touch_config={
                onevt:"touchmove",
                doneevt:"touchend",
                element:self.element,
                evt2x:function(evt){
                        if(evt.touches.length)
                                return evt.touches[0].clientX;
                },
                evt2y:function(evt){
                        if(evt.touches.length)
                                return evt.touches[0].clientY;
                },
        };
        $(self.element).bind("touchstart",function(evt){
                var start_evt=evt;
                $(self.element).bind("touchmove",function(evt){
                        $(self.element).unbind("touchmove");
                        switch(self.touchMode){
                                case 0: initDraw(start_evt,touch_config);break;
                                case 1:
                                        switch(evt.touches.length){
                                        case 1:
                                                initMove(start_evt,touch_config);
                                                break;
                                        case 2:
                                                initTouchZoom(start_evt);
                                                break;
                                        }
                                        break;
                        }
                        return false;
                });
                return false;
        });
        function initMove(evt,config){
                var x=config.evt2x(evt),y=config.evt2y(evt);
                $(config.element).bind(config.onevt,function(evt){
                        self.dmove(config.evt2x(evt)-x,config.evt2y(evt)-y);
                        x=config.evt2x(evt);y=config.evt2y(evt);
                        return false;
                });
                $(config.element).bind(config.doneevt,function(evt){
                        var px=config.evt2x(evt),py=config.evt2y(evt);
                        if(px!=undefined&&py!=undefined)
                                self.dmove(px-x,py-y);
                        $(config.element).unbind(config.onevt);
                        $(config.element).unbind(config.doneevt);
                        return false;
                });
        }
        function initDraw(evt,config){
                if(evt.shiftKey) initStraightLine(evt,config);
                else if(liteMode) initDrawLite(evt,config);
                else initDrawFull(evt,config);
        }
        function initDrawLite(evt,config){
                var     points=[],
                        line=self.draw.polyline([config.evt2x(evt),config.evt2y(evt)].toLocaleString());
                line.stroke(self.graphicsManager.style.stroke);
                line.fill(self.graphicsManager.style.fill);
                $(config.element).bind(config.onevt,function(evt){
                        points.push([config.evt2x(evt),config.evt2y(evt)]);
                        line.plot(points);
                        return false;
                });
                $(config.element).bind(config.doneevt,function(evt){
                        var px=config.evt2x(evt),py=config.evt2y(evt);
                        if(px!=undefined&&py!=undefined){
                                points.push([px,py]);
                                line.plot(points);
                        }
                        if(points.length>1){
                                var gr=new Graphic(line,infofuncs.newId(),self.graphicsManager);
                                self.io.createGraphic(gr);
                        }
                        $(config.element).unbind(config.onevt);
                        $(config.element).unbind(config.doneevt);
                        return false;
                });
        }
        function initDrawFull(evt,config){
                self.graphicsManager.newGraphic(config.evt2x(evt),config.evt2y(evt));
                $(config.element).bind(config.onevt,function(evt){
                        self.graphicsManager.addGraphicPoint(
                                config.evt2x(evt),config.evt2y(evt),
                                evt.shiftKey);
                });
                $(config.element).bind(config.doneevt,function(evt){
                        self.io.createGraphic(
                                self.graphicsManager.finishGraphic(
                                        config.evt2x(evt),config.evt2y(evt)));
                        $(config.element).unbind(config.onevt);
                        $(config.element).unbind(config.doneevt);
                });
        }
        function initStraightLine(evt,config){
                var afx=self.abspos.mapXToAbs(config.evt2x(evt)),
                    afy=self.abspos.mapYToAbs(config.evt2y(evt));
                var line=self.draw.polyline([config.evt2x(evt),config.evt2y(evt)].toLocaleString());
                line.stroke(self.graphicsManager.style.stroke);
                line.fill(self.graphicsManager.style.fill);
                $(config.element).bind(config.onevt,function(evt){
                        var tx=config.evt2x(evt),ty=config.evt2y(evt);
                        line.plot([[self.abspos.reMapXFromAbs(afx),
                                    self.abspos.reMapYFromAbs(afy)],[tx,ty]]);
                });
                $(config.element).bind(config.doneevt,function(evt){
                        var tx=config.evt2x(evt),ty=config.evt2y(evt);
                        if(tx!=undefined&&ty!=undefined)
                                line.plot([[self.abspos.reMapXFromAbs(afx),
                                        self.abspos.reMapYFromAbs(afy)],[tx,ty]]);
                        self.io.createGraphic(new Graphic(line,self.graphicsManager));
                        $(config.element).unbind(config.onevt);
                        $(config.element).unbind(config.doneevt);
                });
        }
        function initTouchZoom(evt){
                $(self.element).unbind("touchmove");
                $(self.element).unbind("touchend");
                function getDist(evt){
                        with(Math) return sqrt(
                                pow(evt.touches[0].clientX-
                                        evt.touches[1].clientX,2)+
                                pow(evt.touches[0].clientY-
                                        evt.touches[1].clientY,2));
                }
                var dist=getDist(evt);
                $(self.element).bind("touchmove",function(evt){
                        var nd=getDist(evt);
                        self.dzoom((nd-dist)/10);
                        dist=nd;
                        return false;
                });
                $(self.element).bind("touchend",function(evt){
                        $(self.element).unbind("touchmove");
                        $(self.element).unbind("touchend");
                        return false;
                });
        }
        
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
}
});
