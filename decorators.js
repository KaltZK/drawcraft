exports.withTimestamp=function(msg){
        msg["timestamp"]=new Date().getTime();
        return msg;
};
exports.withRoom=function(msg,room){
        msg["room"]=room;
        return msg;
};
