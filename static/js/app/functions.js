
//全局函数
function addTextMessage(message){
        var divs=$("#text_message_content");
        var para=document.createElement("p");
        para.textContent=message.author+": "+message.text;
        para.classList.add("text_message_entry");
        divs.append(para);
        var header_panel=document.getElementById("core-header-panel");
        var scroller=header_panel.scroller;
        scroller.scrollTop=scroller.scrollHeight;
}
function sendTextMessage(text){
        var text= (typeof text=="string" && text) || $("#content_input").val();
        $("#content_input").val("");
        if(!text) return;
        var matchres;
        if(matchres=text.match(/^\/(\w*)(.*)$/)){//如果格式符合命令的话
                if(!COMMANDS[matchres[1]]) addTextMessage({author:"System",text:"No such command."});
                else{
                        try{ COMMANDS[matchres[1]](matchres[2]);
                        }catch(err){ addTextMessage({author:"System",text:"Error: "+err});
                        }
                }
        }
        else{
                var message={
                        author: getUsername(),
                        room:   getRoomname(),
                        text: text,
                };
                socket.emit("text_message",message);
                addTextMessage(message);
        }
}
function atAllElement(css,callback){
        var ele_list=$(css);
        for(var i=0;i<ele_list.length;i++){
                var ele=ele_list[i];
                callback.call(undefined,ele);//"call"的第一个参数是"this"
        }
}
function getChunkId(x,y){
        return "chunk("+x+","+y+")";
}
function moveChunkDiv(dx,dy){
        /*console.log(ABSOLUTE_POSITION.displayedChunksLeft,
        ABSOLUTE_POSITION.displayedChunksRight,
        ABSOLUTE_POSITION.displayedChunksTop,
        ABSOLUTE_POSITION.displayedChunksBottom);*/
        atAllElement("div.chunk",function(div){
                div.style.left=parseInt(div.style.left||0)+dx;
                div.style.top=parseInt(div.style.top||0)+dy;
        });
        DISPLAYED_CHUNKS_STATUS.updateChunks();
}
function showPosition(x,y,chunk_id){
        $("#position_label").text("("+x+","+y+")@"+chunk_id);
}
function api(name,body){
        return $.post("/api?action="+name,body).responseText;
}


function getQuery(){
        var url=location.href;
        var query={};
        url.match(/\?(.+?)$/)[1].split("&").forEach(function(param){
                var item=param.split("=");
                query[item[0]]=item[1];
        });
        return query;
}
function getFragment(){
        var url=location.href;
        return url.match(/#(.+?)$/)[1];
} 

function getChunk(x,y){
        return CHUNK[getChunkId(x,y)];
}




//这部分用到了ejs模板所以必须写在这里
//Update:改用Cookies保存之后就不再需要了
function getUsername(){
        return $.cookie("user");
}
function getXShiftedBetweenChunks(x,from_chunk,to_chunk){
        return x-(to_chunk.x-from_chunk.x)*CHUNK_WIDTH;
}
function getYShiftedBetweenChunks(y,from_chunk,to_chunk){
        return y-(to_chunk.y-from_chunk.y)*CHUNK_HEIGHT;
}
function getRoomname(){
        return decodeURI(getFragment());
}

function showMessage(message){
        alert(message);
}

function createContent(msg){
        /*
                msg包含id的话就不新建id
                否则新建id并更新
        */
        var chunk=getChunk(msg.chunk_x,msg.chunk_y);
        if(!chunk) return;
        var content=({
                "img":ImageContent,
        })[msg.type];
        var content=new content(msg.x,msg.y,msg.data,chunk);
        return content;
}


function addGraphicBody(body){
        var chunk=getChunk(body.chunk_x,body.chunk_y);
        if(!chunk) return;
        var path=chunk.addGraphicBody(body);
        var gra=GRAPHICS[body.id] || (GRAPHICS[body.id]=[]);
        gra.push({
                path:path,
                body:body,
        });
}

function removeGraphic(id,update){
        var gra=GRAPHICS[id];
        if(!gra) return;
        gra.forEach(function(body_data){
                body_data.path.remove();
        });
        if(update)
                socket.emit("remove_graphic",{
                        user:getUsername(),
                        room:getRoomname(),
                        id:id,
                });
}
function removeContent(id){
        socket.emit("remove_content",{
                user:getUsername(),
                room:getRoomname(),
                id:id,
        });
}
