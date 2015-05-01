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
        exports.storeGraphic=function(data){
                bodies.insert(data);
        };
        exports.storeContent=function(data){
                contents.insert(data);
        };
        exports.loadChunk=function(load_chunk,graphic_callback,content_callback){
                var gra={};
                bodies.find({chunk_x:load_chunk.x,chunk_y:load_chunk.y,room:load_chunk.room}).forEach(function(body){
                        graphic_callback(body);
                });
                contents.find({chunk_x:load_chunk.x,chunk_y:load_chunk.y,room:load_chunk.room}).forEach(function(content){
                        content_callback(content);
                });
        };
});
