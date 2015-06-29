define("dc/poslabel",[],function(){
return function(id,board){
        var element=this.element=document.getElementById(id);
        board.on("move",function(x,y,h){
                element.textContent="("+x.toFixed(2)+", "+y.toFixed(2)+", "+h.toFixed(2)+")";
        });
        board.on("zoom",function(x,y,h){
                element.textContent="("+x.toFixed(2)+", "+y.toFixed(2)+", "+h.toFixed(2)+")";
        });
}});
