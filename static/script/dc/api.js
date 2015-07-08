define("dc/api",["jquery"],function($){
        var apis={};
        var names=[
                "getRoomList",
                "login",
                "register",
                "getUserData",
                
        ];
        names.forEach(function(name){
                apis[name]=function(data,callback){
                        $.post("/api?action="+name,data,function(bdata){
                                if(typeof(callback)=="function")
                                        callback(bdata);
                        });
                };
        });
        return apis;
});
