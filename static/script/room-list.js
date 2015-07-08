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
require(["jquery","dc/api"],function($,api){
        function enterRoom(){
                var text=$("#name_input").val();
                if(!text) return false;
                setTimeout(function(){
                        window.location.href="/app#"+text;
                },500);
                return true;
        }
        function displayLogin(name){
                $("#un_lab").text("Hi, "+name+". ");
                $("#login_button").css("display","none");
                $("#login_lab").css("display","block");
        }
        function displayLogout(){
                $("#login_button").css("display","block");
                $("#login_lab").css("display","none");
        }
        function notifySend(text){
                var notify=document.getElementById("notify");
                notify.duration=10000;
                notify.text=text;
                notify.toggle();
        }
        $(document).on("WebComponentsReady",function(){
                api.getRoomList({},function(rooms){
                        var list=document.getElementById("rooms_background");
                        rooms.forEach(function(data){
                                var room=document.createElement("room-name");
                                room.roomname=decodeURI(data.room);
                                room.number=data.enter_num
                                list.appendChild(room);
                        });
                });
                $("#back_fab").on("click",function(){
                        setTimeout(function(){
                                window.location.href="/";
                        },500);
                });
                api.getUserData({},function(data){
                        if(data.last_room)
                                $("#name_input").val(data.last_room);
                        if(data.login){
                                displayLogin(data.name);
                        }else{
                                notifySend("You are an anonymous.");
                                displayLogout();
                        }
                });
        });


        $(document).on("notify",function(evt){
                if(evt.login){
                        displayLogin(evt.name);
                }
                notifySend(evt.text);
        });
        $("#login_button").on("click",function(){
                var dialog=document.getElementById("login_dialog");
                dialog.toggle();
        });
        $("#logout_button").on("click",function(){
                api.logout({});
                displayLogout();
                notifySend("Bye.");
        });
        
});
