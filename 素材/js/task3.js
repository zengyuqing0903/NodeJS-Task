const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const queryString = require('querystring');
var chapterList = require('./file').chapterList;
var userList = require('./file').userList;
http.createServer(function(req,res){
    var urlObj = url.parse(req.url,true);
    var pathName = urlObj.pathname;
    if(pathName == '/list'){
        // 列表页
        showPage(res,"chapterList.html")
    }else if(pathName == '/getlist'){
        // 列表页信息
        res.writeHead(200,{"Content-Type":"text/plain"});
        res.write(JSON.stringify(chapterList));
        res.end();
    }else if(pathName.indexOf("images")>=0 && req.method == 'GET'){
        // 图片响应
        showImg(res,pathName);
    }else if(pathName.indexOf("css")>=0 && req.method == 'GET'){
        // css响应
        showCss(res,pathName);
    }else if(pathName.indexOf("js")>=0 && req.method == 'GET'){
        // js响应
        showJs(res,pathName);
    }else if(pathName == '/detail'){
        // 点击阅读全文显示chapter.html
        showPage(res,"chapter.html");
    }else if(pathName == '/getDetail'){
        // 点击阅读全文，根据chapterId替换信息
        showPassage(res,urlObj);
    }else if(pathName == '/login'){
        // 后台登录页
        showPage(res,"login.html");
    }else if(pathName == '/login_bg.jpg'){
        // 后台登录页图
       showImg(res,pathName);
    }else if(pathName == '/upload'){
        // 登录验证
        res.writeHead(200,{"Content-Type":"text/plain"});
        res.write(JSON.stringify(userList));
        res.end();   
    } 
    else if(pathName == '/listmanager'){
        // 显示后台文章列表页
        showPage(res,"list.html");
    }else if(pathName == '/showlist'){
        // 后台文章基本内容
        res.writeHead(200,{"Content-Type":"text/plain;charset=utf-8"});
        res.write(JSON.stringify(chapterList));
        res.end();
    }
    else if(pathName == '/addChapter'){
        // 显示后台添加文章页
        showPage(res,"addChapter.html");
    }else if(pathName == '/add'){
        // 添加文章
        addChapter(req,res,urlObj);
    }
}).listen(8083);
console.log("server is listening 8083");

function showPage(res,filename){
    var filePath = path.join(__dirname,'..');
    var fc1 = fs.readFileSync(filePath +"\\/"+ filename);
    res.writeHead(200,{"Content-Type":"text/html"});
    res.write(fc1);
    res.end();
}
function showImg(res,pathName){
    var imgPath = path.join(__dirname,'..');
    var imgSrc = path.join(imgPath,pathName);
    var imgContent = fs.readFileSync(imgSrc);
    res.writeHead(200,{"Content-Type":"image/png"});            
    res.end(imgContent); 
}
function showCss(res,pathName){
    var cssPath = path.join(__dirname,'..');
    var cssSrc = path.join(cssPath,pathName);
    var cssContent = fs.readFileSync(cssSrc);
    res.writeHead(200,{"Content-Type":"text/css"});
    res.end(cssContent);
}
function showJs(res,pathName){
    var jsPath = path.join(__dirname,'..');
    var jsSrc = path.join(jsPath,pathName);
    var jsContent = fs.readFileSync(jsSrc);
    res.writeHead(200,{"Content-Type":"application/x-javascript"});
    res.end(jsContent); 
}
function showPassage(res,urlObj){
    var chapterId=urlObj.query.chapterId;
    for(var i=0;i<chapterList.length;i++){
        if(chapterList[i].chapterId==chapterId){
            chapterList[i].views+=1;
            res.writeHead(200,{"Content-Type":"text/plain"}) ;
            res.write(JSON.stringify([chapterList[i]]));
            res.end();
            return ;
        }
    }
}
function addChapter(req,res,urlObj){
    var dataStr = '';
    req.on("data",function(chunk){
        dataStr += chunk;
    })
    req.on("end",function(){
        var dataObj = queryString.parse(dataStr);
        var title = dataObj.title;
        var content = dataObj.content;
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        var day = date.getDate();
        var obj={
            "chapterId": chapterList[chapterList.length-1].chapterId+1,
            "chapterName": title,
            "imgPath": "images/1442457564979540.jpeg",
            "chapterDes": content,
            "chapterContent": content,
            "publishTimer": year+"-"+month+"-"+day,
            "author": "admin",
            "views": 0
        }
        chapterList.push(obj);
        res.writeHead(200,{"Context-Type":"text/plain"});
        // res.write("success");
        res.end();
    })

}