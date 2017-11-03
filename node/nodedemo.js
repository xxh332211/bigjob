'use strict';
var http = require("http");
var fs = require("fs");
var events = require("events");
var demoevents = new events.EventEmitter();

var connectHandler = function connected () {
    console.log("连接成功");
    //触发另一个事件
    demoevents.emit("xxh");
};
demoevents.on("connection",connectHandler);


//同步
var datasync = fs.readFileSync("./node/input.text");
//异步
// var dataasync = fs.readFile("input.text",function(){
//     if(err) return console.error(err);
//     console.log(dataasync.toString());
// });
console.log(datasync.toString());
var num = 0;
http.createServer(function(request,response){
    //发送http头部
    //http状态值200:ok
    //内容类型:text/plain

    response.writeHead(200,{'Content-Type':'text/plain'});
    response.write(`你是第${num++}个连接用户`);
    //发送响应数据 "holle world"
    response.end();
}).listen(8888);

console.log('xxserver running at http://127.0.0.1:8888');

