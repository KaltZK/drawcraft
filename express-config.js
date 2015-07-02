//express的初始化和配置模块
var express = require('express');
var bodyParser=require("body-parser");
var url=require('url');
module.exports=function(app,PORT){
        // express config
        (function(){
                app.set('port',PORT);
                app.set('views',__dirname+'/views');
                app.engine('.html', require('ejs').__express);
                app.set('view engine', 'html');//使ejs可以渲染HTML扩展名的文件，否则高亮很蛋疼
                app.use(express.static(__dirname + '/static'));//设置静态文件
                app.use(bodyParser.json());
                app.use(bodyParser.urlencoded({extended:false}));
        }).call();

        app.get('/',function(req,res){
                res.render("index");
        });
        app.get('/room-list',function(req,res){
                res.render("room-list");
        });
        app.get('/app',function(req,res){
                res.render("newapp");
        });
        app.get('/chat',function(req,res){
                res.render("chat");
        });
}
