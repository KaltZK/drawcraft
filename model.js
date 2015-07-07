//这是对数据库访问的模块
var mongodb=require('mongodb');
var crypto=require("crypto");
var server=new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var db=new mongodb.Db('drawcraft', server, {safe:true});

function hash(src){
        var app_secret="2333333";//这部分后面要改掉
        return  crypto.createHmac('sha1',app_secret)
                .update(src).digest("hex");
}
exports.hash=hash;

db.open(function(err,db){
        if(err){
                console.log(err);
                return;
        }

        var bodies=db.collection("graphic_bodies");
        var contents=db.collection("contents");
        var rooms=db.collection("rooms");
        var users=db.collection("users");
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
        exports.createRoom=function(data){
        };
        exports.enterRoom=function(room){
                rooms.update({room:room},{$inc:{enter_num:1}},{upsert:true,multi:false});
        };
        exports.loadRoomList=function(callback){//msg,loadRoomCallback){
                var array=rooms.find({public:true}).sort({enter_num:-1}).toArray(function(err,array){
                        callback(array);
                });
        };
        exports.getRoomData=function(name,callback){
                rooms.findOne({room:name},function(err,room){
                        callback(room);
                });
        }
        exports.checkUser=function(username,password,callback){
                users.findOne({name:username.toLowerCase()},function(err,user){
                        if(err || user==null || user.password!=hash(password)){
                                callback(null);
                        }else{
                                callback(user.name);
                        }
                });
        };
        exports.registerUser=function(username,password,callback){
                users.findOne({name:username.toLowerCase()},function(err,user){
                        if(user==null){
                                console.log(password);
                                users.insert({
                                        name:username.toLowerCase(),
                                        password:hash(password),
                                });
                                callback(username);
                        }else{
                                callback(null);
                        }
                });
        };
});
