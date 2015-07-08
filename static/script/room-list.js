require.config({
        baseUrl:'/script',
        paths:{
                'jquery':"/jquery.min",
                'jquery.cookie':"//cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie",
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
        $(document).on("WebComponentsReady",function(){
                api.getRoomList(function(rooms){
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
                api.getUserData(function(data){
                        var notify=document.getElementById("notify");
                        console.log(data);
                        if(data.last_room)
                                $("#name_input").val(data.last_room);
                        if(data.login){
                                notify.text="Welcome, "+data.name+"!";
                        }else{
                                notify.text="You are an anonymous.";
                                notify.duration=5000;
                        }
                        notify.toggle();
                });
        });

        
        $(document).on("notify",function(evt){
                var notify=document.getElementById("notify");
                notify.text=evt.text;
                notify.toggle();
        });
        $("#login_button").on("click",function(){
                var dialog=document.getElementById("login_dialog");
                dialog.toggle();
        });
        
});
