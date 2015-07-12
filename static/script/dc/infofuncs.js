define("dc/infofuncs",["jquery","jquery.cookie"],function($){
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
        getUsername:function(){
                return $.cookie("user");
        },
        newId:function(){
                return this.getUsername()+"@"+this.getRoom()+"_"+new Date().getTime();
        },
};
});
