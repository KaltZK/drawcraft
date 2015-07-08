require.config({
        baseUrl:'/script',
        paths:{
                'jquery':"//cdn.bootcss.com/jquery/2.1.4/jquery",
                'jquery.cookie':"//cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie",
                'jquery.touch':"/jquery.touch",
                'svg':"//cdn.bootcss.com/svg.js/2.0.0-rc.1/svg",
                'jquery.mousewheel':"//cdn.bootcss.com/jquery-mousewheel/3.1.12/jquery.mousewheel",
                'socket.io':"//cdn.bootcss.com/socket.io/1.3.5/socket.io",

                'dc/board':'dc/board',
                "dc/graphic":"dc/graphic",
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

require(["jquery","dc/board",'dc/poslabel'],function($,Board,PosLabel){
        $(document).on("pass_auth",function(){
                notify("Connected.");
        });
        $(document).on("disconnect",function(msg){
                notify("Disonnected. "+(msg.err||""));
        });
        $(document).on("create_graphic",function(evt){
                board.graphicsManager.updateNewGraphic(evt.msg);
        });

        
        board=new Board("board");
        
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

        function notify(text){
                var notify=document.getElementById("notify");
                notify.duration=5000;
                notify.text=text;
                notify.toggle();
        }
});
