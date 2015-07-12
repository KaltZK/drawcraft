//这是对数据库访问的模块
var mongodb=require('mongodb');
var crypto=require("crypto");
var server=new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var db=new mongodb.Db('drawcraft', server, {safe:true});
var config=require('./config');

function hash(src){
        return  crypto.createHmac('sha1',config.secretKey)
                .update(src).digest("hex");
}
exports.hash=hash;

db.open(function(err,db){
        if(err){
                console.log(err);
                return;
        }

        var bodies=db.collection("graphic_bodies");
        var graphics=db.collection("graphics");
        var contents=db.collection("contents");
        var rooms=db.collection("rooms");
        var users=db.collection("users");
        exports.storeNewGraphic=function(data){
                graphics.insert(data);
        };
        exports.loadGraphicsInRange=function(room,data,callback){
                console.log(room,data);
                graphics.find({
                        room:room,
                        cleft:{$lte:data.right},
                        cright:{$gte:data.left},
                        cbottom:{$gte:data.top},
                        ctop:{$lte:data.bottom},
                }).forEach(callback);
        };
        exports.removeGraphic=function(msg){
                bodies.remove({id:msg.id,room:msg.room});
        };
        exports.roomExists=function(room,callback){
                rooms.findOne({room:room},function(err,room){
                        callback(room!=null);
                });
        };
        exports.createRoom=function(data){
                rooms.insert({
                        room:data.room,
                        public: data.public || false,
                        password: data.password && hash(data.password),
                        members:data.members || [],
                        enter_num: 0,
                });
        };
        exports.roomNeedPassword=function(room,callback){
                rooms.findOne({room:room},function(err,room){
                        callback(room && typeof room.password=="string" && room.password);
                });
        };
        exports.checkRoom=function(username,password,callback){
                password = password || "";
                rooms.findOne({$or:[
                        {public:true},
                        {password:hash(password)},
                        {members:{$in:username}}
                ]},function(err,room){
                        callback(room!=null);
                });
        };
        exports.checkRoom=function(username,password,callback){
                password = password || "";
                rooms.findOne({$or:[
                        {public:true},
                        {password:hash(password)},
                        {members:{$in:username}}
                ]},function(err,room){
                        callback(room!=null);
                });
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
        exports.userExists=function(username,callback){
                users.findOne({name:username.toLowerCase()},function(err,user){
                        callback(user!=null);
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
