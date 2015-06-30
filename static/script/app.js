require.config({
        baseUrl:'/script',
        paths:{
                'jquery':"//cdn.bootcss.com/jquery/2.1.4/jquery",
                'jquery.cookie':"//cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie",
                'svg':"//cdn.bootcss.com/svg.js/2.0.0-rc.1/svg",
                'jquery.mousewheel':"//cdn.bootcss.com/jquery-mousewheel/3.1.12/jquery.mousewheel",
                'socket.io':"//cdn.bootcss.com/socket.io/1.3.5/socket.io",

                'dc/board':'dc/board',
                "dc/graphic":"dc/graphic",
        },
        shim:{
                'jquery': {exports: '$',},
                'jqueryUI':{deps:["jquery"],},
                'jquery.cookie':{deps:["jquery"],},
                'jquery.mousewheel':{deps:["jquery"],},

                'socket.io':{exports:"io",},
                
                'dc/exportfuncs':{exports:"exportfuncs",},
        },
});

require(["dc/board",'dc/poslabel'],function(Board,PosLabel){
        var board=new Board("board");
        var poslabel=new PosLabel("pos_label",board);
});