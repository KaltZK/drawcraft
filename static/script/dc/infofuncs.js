define("dc/infofuncs",[],function(){
return{
        getFragment:function (){
                var url=location.href;
                var res=url.match(/#(.+?)$/);
                return res? res[1] : undefined;
        },
        getRoom:function(){
                var code=this.getFragment();
                return typeof code=="string" ? decodeURI(code) : code;
        },
};
});
