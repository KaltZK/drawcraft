//这是对数据库访问的模块
var mongodb=require('mongodb');
var server=new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var db=new mongodb.Db('drawcraft', server, {safe:true});
db.open(function(err,db){
        if(err){
                console.log(err);
                return;
        }
        var test=db.collection("test");
        //这里的操作跟交互模式的mongodb差不多了
        test.find({x:1,y:2}).forEach(function(doc){
                console.log(doc);
        });
        
        exports.storeGraphic=function(msg){
                console.log(msg);
        };
});
