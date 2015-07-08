var model=require("./model");
var apis={};

//利用express提供JSON API的模块
function checkArgs(format,args,res){
        for(var name in format){
                if ((typeof format[name]=="string" &&
                format[name]!=typeof args[name]) ||
                (typeof format[name] == "object" && !checkArgs(name,args[name])) ){
                        res.status(417).json({err:"Invalid arguments."});
                        return false;
                }
        }
        return true;
}

function addAPI(name,format,func){
        apis[name]=function(body,session,callback,res){
                if(!checkArgs(format,body,res))return false;
                func(body,session,callback);
                return true;
        }
}

addAPI("getRoomList",{},function(body,session,callback){
        return model.loadRoomList(callback);
});
addAPI("login",{
        username:"string",
        password:"string",
        },function(body,session,callback){
        model.checkUser(body.username,body.password,function(username){
                if(username){
                        session.username=username;
                        session.login=true;
                        callback({
                                login:true,
                                name:username
                        });
                }else{
                        callback({
                                login:false,
                                err:"Wrong password or user does not exist."
                        });
                }
        });
});
addAPI("register",{
        username:"string",
        password:"string",
        },function(body,session,callback){
        model.registerUser(body.username,body.password,function(username){
                if(username){
                        session.username=username;
                        session.login=true;
                        callback({
                                login:true,
                                name:username
                        });
                }else{
                        callback({err:"User exists."});
                }
        });
});
addAPI("getUserData",{},function(body,session,callback){
        callback({
                login:session.login,
                name:session.username,
                last_room:session.last_room,
        });
});
addAPI("logout",{},function(body,session,callback){
        session.destroy();
        session.username="666";
        session.login=false;
});

module.exports=function DCApi(app){
        app.post('/api',function(req,res){
                var action = req.query["action"];
                if(!action || !apis[action]){
                        res.status(417).json({err:"Action not found."});
                        return;
                }
                !apis[action](req.body,req.session,function(result){
                        res.json(result);
                },res);
        });
        return apis;
}
