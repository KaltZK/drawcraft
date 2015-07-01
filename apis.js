var model=require("./model");
var apis={};

//利用express提供JSON API的模块
apis.test=function(body){
        return body;
}
apis.roomList=function(body,callback){
        return model.loadRoomList(callback);
}

module.exports=function DCApi(app){
        app.post('/api',function(req,res){
                console.log(apis);
                var action = req.query["action"];
                if(!action || !apis[action]){
                        res.status(417).json({err:"Action not found."});
                        return;
                }
                apis[action](req.body,function(result){
                        res.json(result);
                });
        });
        return apis;
}
