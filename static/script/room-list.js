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
        function enterRoom(room){
                setTimeout(function(){
                        window.location.href="/app#"+room;
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
        $(document).on("enterroom",function(evt){
                api.roomExists({room:evt.room},function(re){
                        if(re) enterRoom(evt.room);
                        else{
                                $.event.trigger({type:"create_room",room:evt.room});
                                $(document).bind("new_room_done",function(){
                                        enterRoom(evt.room);
                                        $(document).unbind("new_room_done");
                                });
                        }
                });
        });
        $("#login_button").on("click",function(){
                var dialog=document.getElementById("login_dialog");
                dialog.toggle();
        });
        $("#logout_button").on("click",function(){
                api.logout({});
                displayLogout();
                $.event.trigger({type:"loggedout"});
                notifySend("Bye.");
        });
        
});
