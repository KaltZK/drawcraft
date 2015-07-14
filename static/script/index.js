require.config({
        baseUrl:'/script',
        paths:{
                'jquery':"/jquery.min",
                'jquery.cookie':"/jquery.cookie",
        },
        shim:{
                'jquery': {exports: '$',},
                'jquery.cookie':{deps:["jquery"],},
        },
});
require(["jquery","dc/api","jquery.cookie"],function($,api){
$(document).on("WebComponentsReady",function(){
        function notifySend(text){
                var notify=document.getElementById("notify");
                notify.duration=10000;
                notify.text=text;
                notify.toggle();
        }
        function jump(name){
                $.cookie("user",name);
                setTimeout(function(){
                        window.location.href="/room-list";
                },500);
        }
        $(document).on("notify",function(evt){
                if(evt.login){
                        jump(evt.name);
                }else{
                        notifySend(evt.text);
                }
        });
        var login_status;
        api.getUserData({},function(ud){
                login_status=ud;
                if(ud.login){
                        notifySend("Welcome, "+ud.name+".");
                        jump(ud.name);
                }
        });
        function enter(){
                var name=$("#username_input").val();
                if(!name) return;
                api.userExists({username:name},function(ue){
                        if(ue){
                                var login_dialog=document.getElementById("login_dialog");
                                $("#dialog_username_input").val(name);
                                login_dialog.toggle(true);
                        }else{
                                jump(name);
                        }
                });
        };
        $("#enter_button").on("click",enter);
        $(document).keydown(function(event){
                if(event.keyCode==13)//按下回车事件
                        enter();
        });
        if($.cookie("user")){
                $("#username_input").val($.cookie("user"));
        }
});
});
