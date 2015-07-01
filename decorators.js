//装饰器 主要服务于auth模块
function addDecorator(name,func){
        exports[name]=function(origin_func){
                var args=Array.prototype.slice.call(arguments,1);
                return function(msg){
                        return origin_func(func.apply(null,
                        [msg].concat(args)));
                };
        }
}
addDecorator("withTimestamp",function(msg){
        msg["timestamp"]=new Date().getTime();
        return msg;
});
addDecorator("withRoom",function(msg,room){
        msg["room"]=room;
        return msg;
});
