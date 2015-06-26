$(document).on("polymer-ready",function(){
        var socket=io.connect();
        
        socket.emit("load_room_list",{user:$.cookie("user")});
        socket.on("load_room",function(room_data){
                var room_ele=document.createElement("room-name");
                room_ele.classList.add("room-name");
                room_ele.roomname=decodeURI(room_data.room);
                document.getElementById("background").appendChild(room_ele);

                //后面是无用代码
                return;

                var last_z_height=1;
                $(room_ele).on("mouseenter",function(evt){
                        last_z_height=evt.target.z_height;
                        evt.target.z_height=3;
                });
                $(room_ele).on("mouseleave",function(evt){
                        evt.target.z_height=last_z_height;
                });
        });
        
        function enterRoom(){
                var text=$("#name_input").val();
                if(!text) return false;
                setTimeout(function(){
                        socket.disconnect();
                        window.location.href="/app#"+text;
                },500);
                return true;
        }

        (function(){
                var lrn=$.cookie("last_room");
                if(lrn)
                        $("#name_input").val(decodeURI(lrn));
        }).call();

        $("#find_button").on("click",enterRoom);
        $("#name_input").on("keydown",function(evt){
                if(evt.keyCode==13)
                        enterRoom();
        });
        $(document).on("keydown",function(evt){
                if(evt.keyCode==13)
                        enterRoom();
        });
        
        $("#back_fab").on("click",function(){
                setTimeout(function(){
                        window.location.href="/";
                },500);
        });
});
