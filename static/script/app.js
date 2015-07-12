require.config({
        baseUrl:'/script',
        paths:{
                'jquery':"/jquery.min",
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
$(document).on("WebComponentsReady",function(){
        $(document).on("pass_auth",function(){
                notify("Connected.");
        });
        $(document).on("disconnect",function(msg){
                notify("Disonnected. "+(msg.err||""));
        });
        $(document).on("create_graphic",function(evt){
                board.graphicsManager.updateNewGraphic(evt.msg);
        });
        var password_dialog=document.getElementById("password_dialog");
        board=new Board("board");
        
        var poslabel=new PosLabel("pos_label",board);
        $("#draw_radio_button").on("change",function(evt){
                board.touchMode=0;
        });
        $("#move_radio_button").on("change",function(evt){
                board.touchMode=1;
        });

        function notify(text){
                var notify=document.getElementById("notify");
                notify.duration=5000;
                notify.text=text;
                notify.toggle();
        }
        		
	var colors_list=["red","green","blue","yellow"];
	var select_color_inner_div=document.getElementById("select_color_inner_menu");
	colors_list.forEach(function(color){
		console.log(color)
		var pi=document.createElement("paper-item");
		pi.style.color="#FFFFFF";
		pi.style.backgroundColor=color;
		select_color_inner_div.appendChild(pi);
	});
			
				var hdialog = document.getElementById('help_dialog');
				document.getElementById("help_button").onclick=function(){
					hdialog.toggle(true);
					return false;
				};
				document.getElementById("close_help_button").onclick=function(){
					hdialog.toggle(false);
					return false;
				};
			
		
})});
