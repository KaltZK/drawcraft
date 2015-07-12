require.config({
        baseUrl:'/script',
        paths:{
                'jquery':"/jquery.min",
                'jquery.cookie':"/jquery.cookie",
                'jquery.touch':"/jquery.touch",
                'svg':"/svg",
                'jquery.mousewheel':"/jquery.mousewheel",
                'socket.io':"/socket.io",
        },
        shim:{
                'jquery': {exports: '$',},
                'jquery.cookie':{deps:["jquery"],},
                'jquery.mousewheel':{deps:["jquery"],},
                'jquery.touch':{deps:["jquery"],},

                'socket.io':{exports:"io",},
                
                'dc/exportfuncs':{exports:"exportfuncs",},
        },
});

require(["jquery","dc/board",'dc/poslabel','dc/board-init-event-solts'],function($,Board,PosLabel,initSolts){
$(document).on("WebComponentsReady",function(){
        board=new Board("board");
        initSolts(board);
        var password_dialog=document.getElementById("password_dialog");
        
        var poslabel=new PosLabel("pos_label",board);
        $("#draw_radio_button").on("change",function(evt){
                board.touchMode=0;
        });
        $("#move_radio_button").on("change",function(evt){
                board.touchMode=1;
        });
        return;
        (function(){
                var contextmenu=document.getElementById("contextmenu");
                contextmenu.setElement(
                document.getElementById(
                "board"));
                contextmenu.addItem("show",function(){console.log()});
                $("#board").bind("contextmenu",function(){
                        return false;
                })
        }).call();

});});
