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
    $(document).on("WebComponentsReady",function(){
            api.getRoomList(function(rooms){
                    var list=document.getElementById("background");
                    rooms.forEach(function(data){
                            var room=document.createElement("room-name");
                            room.roomname=decodeURI(data.room);
                            list.appendChild(room);
                    });
            });
    });
});
