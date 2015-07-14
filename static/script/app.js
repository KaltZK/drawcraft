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
        var hdialog = document.getElementById('help_dialog');
        $("#help_button").on("click",function(){
                hdialog.toggle(true);
        });
        $("#close_help_button").on("click",function(){
                hdialog.toggle(false);
        });
        var setting_dialog=document.getElementById('setting_dialog');
        var commands={
                tp:function(_x,_y){
                        var x=parseInt(_x),y=parseInt(_y);
                        if(isNaN(x) || isNaN(y))throw Error("Invalid argument.");
                        board.move(-x,-y);
                },
        };
        
        $("#setting_button").on("click",function(){
                document.getElementById("style_setting_dialog").toggle(true);
        });

        var header_panel=document.getElementById("chat_paper_header_panel");
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
                header_panel.scroller.scrollTop=header_panel.scroller.scrollHeight;
        }

        
        $("#room_name_label").text(infofuncs.getRoom());
        function sendMessage(){
                var text=$("#content_input").val(),
                    user=infofuncs.getUsername();
                if(!text) return;
                $("#content_input").val('');
                var res,func;
                if(res=text.match(/^\/(\w*)(.*)$/)){
                        if(func=commands[res[1]]){
                                try{
                                        func.apply(null,res[2].split(" ").filter(function(t){return t!=""}));
                                }catch(e){
                                        displayMessage("System",e.message);
                                }
                        }else{
                                displayMessage("System","Unknown command: "+res[1]);
                        }
                }else{
                        displayMessage(user,text);
                        board.io.sendMessage(user,text);
                }
        }
        $("#send_button").on("click",sendMessage);
        $("#content_input").on("keydown",function(evt){
                if(evt.keyCode==13)
                        sendMessage();
        });
        $(document).on("text_message",function(evt){
                displayMessage(evt.user,evt.text);
        });
})});
