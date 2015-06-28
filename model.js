//这是对数据库访问的模块
var mongodb=require('mongodb');
var server=new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var db=new mongodb.Db('drawcraft', server, {safe:true});
db.open(function(err,db){
        if(err){
                console.log(err);
                return;
        }

        var bodies=db.collection("graphic_bodies");
        var contents=db.collection("contents");
        var rooms=db.collection("rooms");
        exports.storeGraphic=function(data){
                bodies.insert(data);
        };
        exports.removeGraphic=function(msg){
                bodies.remove({id:msg.id,room:msg.room});
        };
        exports.storeContent=function(data){
                contents.insert(data);
        };
        exports.removeContent=function(data){
                contents.remove({id:msg.id,room:msg.room});
        };
        exports.loadChunk=function(load_chunk,graphic_callback,content_callback){
                var gra={};
                bodies.find({chunk_x:load_chunk.x,chunk_y:load_chunk.y,room:load_chunk.room})
                        //~ .sort({create_time:1})
                        .forEach(graphic_callback);
                contents.find({chunk_x:load_chunk.x,chunk_y:load_chunk.y,room:load_chunk.room})
                        //~ .sort({create_time:1})
                        .forEach(content_callback);
        };
        exports.enterRoom=function(room){
                rooms.update({room:room},{$inc:{enter_num:1}},{upsert:true,multi:false});
        };
        exports.loadRoomList=function(callback){//msg,loadRoomCallback){
                var array=rooms.find({}).sort({enter_num:-1}).toArray(function(err,array){
                        callback(array);
                });
        };
});
