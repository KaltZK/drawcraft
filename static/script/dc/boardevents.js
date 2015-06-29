define("dc/boardevents",[],function(){
return function(board){
        var events=this.events={};
        this.on=board.on=function(event,callback){
                if(!events[event]) events[event]=[];
                events[event].push(callback);
        }
        this.send=function(event){
                if(!events[event]) return;
                var args=Array.prototype.slice.call(arguments,1);
                this.events[event].forEach(function(callback){
                        callback.apply(null,args);
                });
        }
}});
