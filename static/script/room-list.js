require.config({
        baseUrl:'/script',
        paths:{
                'jquery':"//cdn.bootcss.com/jquery/2.1.4/jquery",
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
                        var list=document.getElementById("background");
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
                $(document).on("keydown",function(evt){
                        if(evt.keyCode==13)
                                enterRoom();
                });
                $("#find_button").on("click",enterRoom);
        });
});
