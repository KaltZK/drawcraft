//接下来是全局变量 请使用全大写命名
//以下是用来设置的全局变量
CHUNK_WIDTH=1000;
CHUNK_HEIGHT=1000;
CHUNK_X_MOVING_SPEED=30;
CHUNK_Y_MOVING_SPEED=30;

//控制缩放
Z_MOVING_SPEED=20;
DEFAULT_DEPTH=1;


HIDDEN_AREA_WIDTH=1000;//屏幕外区域，预先加载Chunks
HIDDEN_AREA_HEIGHT=1000;



COMMANDS={//聊天框命令
        tp:function(s){
                var ra=s.split(' ');
                var x=parseInt(ra[1]),y=parseInt(ra[2]);
                if(x==NaN||y==NaN) throw "Invalid arguments.";
                ABSOLUTE_POSITION.moveRelatively(-(x-VIEW_POSITION.x),-(y-VIEW_POSITION.y));
        }
};
