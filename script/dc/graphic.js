define("dc/graphic",['jquery','svg'],
function($,svg){
        Graphic=function(polyline,zIndex,board){
                this.polyline=polyline;
                this.zIndex=zIndex;
                this.board=board;
                var pwidth=polyline.width(),pheight=polyline.height();
                var px=polyline.x(),py=polyline.y();
                this.zoom=function(viewpoint_zIndex){
                        var     centerX=window.screen.availWidth/2,
                                centerY=window.screen.availHeight/2;
                        var multiple=Math.exp((viewpoint_zIndex-zIndex)/10);
                        if(multiple<1e-6) return;
                        polyline.size(pwidth*multiple,pheight*multiple);
                        polyline.move(centerX-(centerX-px)*multiple,centerY-(centerY-py)*multiple);
                };
                this.dmove=function(dx,dy){
                        px+=dx;py+=dy;
                        polyline.move(px,py);
                }
        };
        return Graphic;
});
