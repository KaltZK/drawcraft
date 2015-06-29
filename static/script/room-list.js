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
    $(document).on("polymer-ready",function(){
            api.getRoomList(function(rooms){
                    var list=document.getElementById("back_fab");
                    rooms.forEach(function(data){
                            var room=Object.create("room-name");
                            room.roomname=data.room;
                            list.appendChild(room);
                    });
            });
    });
});