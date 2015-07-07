define("dc/api",["jquery"],function($){
        var apis={};
        var names=[
                "getRoomList",
                "login",
                "getUserData",
                
        ];
        names.forEach(function(name){
                apis[name]=function(callback){
                        $.post("/api?action="+name,function(data){
                                callback(data);
                        });
                };
        });
        return apis;
});
