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
        var head=db.collection("graphic_head");
        var bodies=db.collection("graphic_bodies");
        var contents=db.collection("contents");                
        exports.storeGraphic=function(msg){
                console.log(msg);
                bodies.insert(bodies);
                head.insert(head);
                contents.insert(contents);
        };
        exports.loadChunk=function(load_chunk){
                bodies.find({x:load_chunk.x,y:load_chunk.y,room=load_chunk.room}).forEach(function(body){
                        if(!gra[body.id]) {
                                gra[body.id]={
                                head:head.findOne({id:body.id}),
                                bodies:[]
                        };
                        }
                        gra[body.id].bodies.push(body);
                });
                var cont=[];
                contents.find({x:load_chunk.x,y:load_chunk.y,room:load_chunk.room}).forEach(function(content){
                        cont.push(content);
                });
                var chunk={
                        x:load_chunk.x,
                        y:load_chunk.y,
                        graphics:[],
                        contents:cont,
                };
                for(var i in gra){
                        chunk.graphics.push(gra[i]);
                }
                return chunk;
        };
});
