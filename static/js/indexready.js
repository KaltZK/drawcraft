$(document).ready(function(){
        (function(){
                var user=$.cookie("user");
                var room=$.cookie("room");
                if(user) $("#user_input").val(user);
                if(room) $("#room_input").val(room);
        }).call();
        $("#room_input").val("Lobby");
        $(document).keydown(function(event){
                if(event.keyCode==13)//按下回车事件
                        enterRoom();
        });
        $("#enter_button").on("click",enterRoom);
});
function enterRoom(){
        var user=$("#user_input").val();
        var room=$("#room_input").val();
        if(!user||!room) return;
        $.cookie("user",user);
        $.cookie("room",room);
        window.location.href="/app?room="+room;
}
