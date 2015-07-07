var model=require("./model");
var apis={};

//利用express提供JSON API的模块
apis.roomList=function(body,session,callback){
        return model.loadRoomList(callback);
}
apis.login=function(body,session,callback){
        model.checkUser(body.username,body.password,function(username){
                if(username){
                        session.username=username;
                        callback(true);
                }else{
                        callback(false);
                }
        });
}
apis.register=function(body,session,callback){
        model.registerUser(body.username,body.password,function(username){
                if(username){
                        session.username=username;
                        callback(true);
                }else{
                        callback(false);
                }
        });
}
apis.logout=function(body,session,callback){
        session.username=undefined;
}

module.exports=function DCApi(app){
        app.post('/api',function(req,res){
                console.log(apis);
                var action = req.query["action"];
                if(!action || !apis[action]){
                        res.status(417).json({err:"Action not found."});
                        return;
                }
                apis[action](req.body,req.session,function(result){
                        res.json(result);
                });
        });
        return apis;
}
