#DrawCraft

DrawCraft是一个在线协作画板项目

边写边画感觉会比单纯的文字更有表现力一些




#项目成员
* Chelle
* KaltZK <715480954@qq.com>
* xuxinang <13889402737@163.com>
* Li Yifei <923475486@qq.com>
* XX <380162951@qq.com>

#一些说明
**这部分是给项目成员看的**


##关于将会用到的事件

###格式说明

【事件名】【发送端(使用emit)】>>【接收端(使用on)】 【用途及其他说明】

```
格式
```

发送端这样发送事件
```
socket.emit("事件名",【内容(也就是下面这些格式)】);
```

接收端这样处理事件
```
socket.on("事件名",function(【对面发来的内容】){
        //处理代码
});
```

###事件

enter_room 网页>>服务器 进入房间事件

```
{
        user: "用户名",
        room: "所在房间"
}
```

leave_room 网页>>服务器 离开房间事件

```
{
        user: "用户名",
        room: "所在房间"
}
```

load_room_list 网页>>服务器 请求房间列表

```
{
        user: "用户名"
}
```

load_room_list 服务器>>网页 发送房间列表

```
{
        room_list:[
                "房间名",
                "房间名",
                ...
        ]
}
```

text_message 网页>>服务器 用户发送文本信息

text_message 服务器>>网页 向用户广播文本信息

```
{
        author: "发送者",
        room: "所在房间",
        text: "发送内容"
}
```

update_graphic 网页>>服务器 创建了新图形 or 更改了已有图形

update_graphic 服务器>>网页 广播其他用户更改或创建图形的行为

```
{
        head:{//整个图形共享的信息
                id: "图形所独有的id",
                author:"作者",
                room:"所在房间",
                style:图形样式
        },
        bodies:[//分散在各个区块的body的信息
                {
                        id: 同上,
                        room: 同上,
                        index: 这部分在图形中的顺序,
                        chunk_x: 所在区块的x,
                        chunk_y: 所在区块的y,
                        points: 所含所有点的数据
                },
                ...
        ]
}
```

update_content 网页>>服务器 创建了新内容 or 更改了已有内容

update_content 服务器>>网页 广播其他用户更改或创建内容的行为

```
{
        id: 内容所独有的id,
        chunk_x: 所在chunk的x,
        chunk_y: 所在chunk的y,
        x: 内容在chunk中的x,
        y: 内容在chunk中的y,
        type: 内容类型,
        data:{
                //content的数据
                //视具体类型而定
        }
}
```


load_chunk 网页>>服务器 请求一个区块的数据
```
{
        x:区块的x,
        y:区块的y,
        room:区块所在房间
}
```


load_chunk 服务器>>网页 发送区块数据
```
{
        x: 区块的x,
        y: 区块的y,
        graphics:[
                //区块所涉及到的所有图形组成的数组
                //格式见update_graphic
                ...
        ],
        contents:[
                //区块所含有的内容组成的数组
                //格式见update_content
                //目前还没加入
                ...
        ]
}
```


##关于使用polymer

起步项目我放回static/components文件夹了

之前的那些文件还能直接用

*使用自己想要的Element*

1. 在[Elements集合](http://docs.polymerchina.org/docs/elements/)选择想要的Elemet
2. 点进选中的介绍页面，会出现一个GET XXX按钮，点开之后切换到Github标签
3. 复制绿色框里的命令，在static文件夹 右键>>Git Bash 点击窗口边框>>编辑>>粘贴 回车运行
4. 完~成~，在页面引用即可直接使用

