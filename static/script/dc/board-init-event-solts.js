define("dc/board-init-event-solts",["jquery"],function($){
        var board;
        function notify(text){
                var notify=document.getElementById("notify");
                notify.duration=5000;
                notify.text=text;
                notify.toggle();
        }
        $(document).on("remove_graphic",function(evt){
                board.io.removeGraphic(evt.id);
        });
        $(document).on("pass_auth",function(){
                board.graphicsManager.pullInnerGraphics();
        });
        $(document).on("pass_auth",function(){
                notify("Connected.");
        });
        $(document).on("disconnect",function(msg){
                notify("Disonnected. "+(msg.err||""));
        });
        $(document).on("create_graphic",function(evt){
                board.graphicsManager.updateNewGraphic(evt.msg);
        });
        $(document).on("pull_inner_graphic",function(evt){
                board.graphicsManager.fromStruct(evt.struct);
        });
        $(document).on("update_chunk_border",function(evt){
                board.graphicsManager.cleanOuterGraphics(evt);
                board.graphicsManager.pullInnerGraphics(evt);
        });
        
return function(bd){
        board=bd;
}});
