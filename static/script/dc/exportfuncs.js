define("dc/exportfuncs",{
        move:function move(x,y){
                with(board){
                board.dmove(x-abspos.x(),y-abspos.y());
        }},
});
