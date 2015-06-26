/*
为了解决IE浏览器造成的各路非主流问题
建立本文件
*/

/*
解决IE不支持__defineGetter__的问题
代码来自网络
*/
if(navigator.appName=="Microsoft Internet Explorer"){
        Object.prototype.__defineGetter__ = function(attributeName,hanlder){
                if(typeof(hanlder)=="string"){
                        handler=new Function(hanlder);
                }
                else if(typeof(hanlder)=="function"){
                        $owner = this;
                        this[attributeName]={
                                valueOf:function(){return hanlder.apply($owner, arguments)},
                                toString:function(){return hanlder.apply($owner, arguments)}
                        };
                }
                else throw new TypeError();
        }
}
