define("dc/board-init-event-solts",["jquery"],function($){
        function notify(text){
                var notify=document.getElementById("notify");
                notify.duration=5000;
                notify.text=text;
                notify.toggle();
        }
        $(document).on("pass_auth",function(){
                notify("Connected.");
        });
        $(document).on("disconnect",function(msg){
                notify("Disonnected. "+(msg.err||""));
        });
        $(document).on("create_graphic",function(evt){
                board.graphicsManager.updateNewGraphic(evt.msg);
        });

        $(document).on("update_chunk_border",function(evt){
                board.graphicsManager.cleanOuterGraphics();
});
        
return function(bd){
        board=bd;
}});
