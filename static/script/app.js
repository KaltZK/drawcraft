require.config({
        baseUrl:'/script',
        paths:{
                'jquery':"/jquery.min",
                'jquery.cookie':"/jquery.cookie",
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

require(["jquery","dc/board",'dc/infofuncs','dc/poslabel','dc/board-init-event-solts'],function($,Board,infofuncs,PosLabel,initSolts){
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

        function notify(text){
                var notify=document.getElementById("notify");
                notify.duration=5000;
                notify.text=text;
                notify.toggle();
        }
        		
	//~ var colors_list=["red","green","blue","yellow"];
	//~ var select_color_inner_div=document.getElementById("select_color_inner_menu");
	//~ colors_list.forEach(function(color){
		//~ var pi=document.createElement("paper-item");
		//~ pi.style.color="#FFFFFF";
		//~ pi.style.backgroundColor=color;
		//~ select_color_inner_div.appendChild(pi);
	//~ });
        var hdialog = document.getElementById('help_dialog');
        $("#help_button").on("click",function(){
                hdialog.toggle(true);
        });
        $("#close_help_button").on("click",function(){
                hdialog.toggle(false);
        });
        var setting_dialog=document.getElementById('setting_dialog');
        $("#setting_button").on("click",function(){
                document.getElementById("style_setting_dialog").toggle(true);
        });

        var chat_content=document.getElementById("chat_content");
        function displayMessage(username,text){
                var d=document.createElement("p"),
                    p=document.createElement("span"),
                    s=document.createElement("strong");
                s.textContent=username+": ";
                p.textContent=text;
                d.appendChild(s);
                d.appendChild(p);
                chat_content.appendChild(d);
        }
        displayMessage("12","45045045045045045045045045045045045045045045045045\n0450450450450450450450450450450450450450450450450450450450450450450450450450450450450450450450450450450450450450450450450450450450450450450450450450450");
        $("#chat_block_header").text(infofuncs.getRoom());
})});
