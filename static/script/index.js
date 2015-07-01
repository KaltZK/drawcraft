$(document).on("WebComponentsReady",function(){
        function enter(){
                var name=$("#username_input").val();
                if(!name) return;
                $.cookie("user",name);
                setTimeout(function(){
                        window.location.href="/room-list";
                },500);
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
