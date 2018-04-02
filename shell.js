const fs = require('fs');
const os=require('os');
const mainJs = `const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const winOption = {
    frame: true,
    modal: false,
    skipTaskbar: false,
    fullscreen: true,
    alwaysOnTop: true,
    /*  x: 7680,
     y: 3240,*/
    x:0,
    y:0,
    width: 7680,
    height: 3240,
    thickFrame: true,
    //title: 'VideoPlayer',
    autoHideMenuBar: true,
    enableLargerThanScreen: true,
    transparent: false,
    'web-preferences': {
        'plugins': true
    }
};

function createWindow () {
    //启动服务
    require( path.join(__dirname,'/app'));
    const service=require( path.join(__dirname,'/service/service.js'));
    
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600 })

    // and load the index.html of the app.
    // mainWindow.loadURL(url.format({
    //   pathname: path.join(__dirname, 'index.html'),
    //   protocol: 'file:',
    //   slashes: true
    // }));
    mainWindow.loadURL('http://localhost:'+service.servicePort());
    // Open the DevTools.
    //调试控制台是否打开
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', createWindow);

app.on('ready',function(){
    createWindow(winOption);
});
// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});
//
// require(__dirname+'/app.js');



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
`;
const packageJson = `{
  "name": "nodetest",
  "version": "1.0.0",
  "description": "",
  "main": "main.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "cross-env NODE_ENV=start  nodemon app.js",
    "start:zip" : "",
    "dev": "cross-env NODE_ENV=development  electron . && nodemon app.js ",
    "build": "cross-env NODE_ENV=production  electron-packager . app --win --out dist --arch=x64  --version 1.0.0 --overwrite --asar ",
    "build:unpackDir": "cross-env NODE_ENV=production  electron-packager . app --win --out dist --arch=x64  --version 1.0.0 --overwrite--asar.unpackDir mock "
  },
  "author": "mingyang",
  "license": "ISC",
  "dependencies": {
    "co-views": "^2.1.0",
    "cross-env": "^5.1.3",
    "ejs": "^2.5.7",
    "koa": "^2.4.1",
    "koa-body": "^2.5.0",
    "koa-router": "^7.3.0",
    "koa-static-server": "^1.3.3"
  },
  "devDependencies": {
    "electron": "^1.8.3",
    "electron-packager": "^11.1.0",
    "nodemon": "^1.8.1"
  }
}`;

const appJs = `const path=require('path');
const koa = require('koa');
const Router = require('koa-router');
const app = new koa();
const router = new Router();

const service = require(path.join(__dirname, '/service/service'));
const koa_static = require('koa-static-server');


//支持ejs模板解析
const views = require('co-views');

const render = views(path.join(__dirname, '/views'), {
    map: {html: 'ejs'}
});

//配置静态文件访问地址
app.use(koa_static({
    rootDir: path.join(__dirname, '/static/'),//实际静态文件的存放地址
    rootPath: '/static/'
}));


//配置路由
router.get('/',async (ctx)=>{
   
    ctx.body=await render('index',{title:'首页'});
})

//测试api

router.get('/api/test',async (ctx)=>{ 

    ctx.body=await service.getData(path.join(__dirname,'/mock/test.json'));
    // {"data":"test"}
})

app.use(router.routes());
//开启服务

let server = app.listen(service.servicePort(), function () {

    console.log('server running is http://localhost:'+service.servicePort());
});`;

const html = {
    index: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>index</title>
</head>
<body>
     <% include ./common/test.html %>
</body>
</html>`,
    test: '<h1>hello world !</h1>'
}

const resetCss = `html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;

  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
  outline:none;
  list-style: none;
  box-sizing:border-box;
  -webkit-box-sizing:border-box;
  -moz-box-sizing:border-box;
  -o-box-sizing:border-box;
  -ms-box-sizing:border-box;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
  display: block;
}
body {
  line-height: 1;
}
ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
/*全局控制*/
html,body{
  width:100%; min-height:100%;
}
body{
  margin:0;
  padding:0;
  font-size:16px;
  font-family:"微软雅黑";
  background: #fff;
}
a{
  text-decoration:none;
  cursor:default;
  color:#333;
}
img{
  max-width: 100%;
  display: block;
}
:focus {
  outline:0;
}

.box-sizing{
  box-sizing:border-box;
  -webkit-box-sizing:border-box;
  -moz-box-sizing:border-box;
  -o-box-sizing:border-box;
  -ms-box-sizing:border-box;
}`;

const serviceJs = `//引入文件模块
const fs = require('fs');

//读取数据

const getData = function(file) {
    return new Promise(function(resolve, reject) {
        fs.readFile(file, "utf-8", (err, data) => {
            if (err) {
                reject(err);

            } else {
                resolve(JSON.parse(data));
            }
        });
    });
};

//写入数据
const saveData = function(file, data) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(file, JSON.stringify(data), "utf-8", function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });

};

//开发环境和生产环境路径的配置
const realPath = function() {
    let result,
        baseDir = __dirname.split("service")[0];
    if (process.env.NODE_ENV === 'development') {
        //开发环境
        result = baseDir;
    } else if (process.env.NODE_ENV === 'start') {
        //测试环境
        result = baseDir;
    } else {
        //生产环境(打包后-electron)
        result = baseDir.replace('app.asar', "app.asar.unpacked");
    }
    return result
};

//配置不同环境下的服务
const servicePort = function() {
    const _type = envType();
    switch (_type) {
        case 0:
            port = 5000;
            break;
        case 1:
            port = 5001;
            break;
        case 2:
            port = 5002;
            break;
    }
    return port;
};

const envType = function() {
    let type = 0;
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'start') {
        //开发环境
        type = 0;
    } else if (process.env.NODE_ENV === 'development') {
        //测试环境
        type = 1;
    } else {

        //生产环境
        type = 2;
    }
    return type;
};

module.exports = {
    getData: getData,
    saveData: saveData,
    realPath: realPath,
    servicePort: servicePort,
    envType: envType
};`;


const readMe = `## 基于koa2 + electron 构建桌面应用

### 目录结构

\`\`\`
elctron-project
 |---mock
     |---test.json #数据文件
 |---service
     |---service.js #逻辑处理js
 |---static
     |---css #css 文件
         |---reset.css #重置 css 样式
     |---images #图片
     |---js #js 文件
 |---views
     |---index.html #html 模板文件
     |---common
         |---test.html #公用模板
 |---app.js #node 服务
 |---main.js #入口文件
 |---HISTROY.md #修改历史
 |---README.md #项目说明
 |---package.json #项目依赖

\`\`\`

### 项目安装以及运行

\`\`\` bash
# 安装依赖
npm install

# 浏览器环境 server running is http://localhost:5000
npm run start 

# 客户端环境 (应用程序)
npm run dev 

# 生产环境 build for production with electron
npm run build
\`\`\`

### 详细依赖介绍

+ koa 

+ koa-router

+ koa-body 

+ koa-static-server

+ ejs 

+ co-view

+ electron 

+ electron-packager
 
+ nodemon

`;

const history = `+ 创建于 `;

const defaultFiles = [mainJs, packageJson, appJs, readMe, history];

let data = {
    rootDir: { name: __dirname + '/electron_project/', state: true },
}

data = {
    rootDir: data.rootDir, //根目录
    urls: [{
            name: data.rootDir.name + "mock",
            state: true, //是否有子目录
            subUrl: [{
                url: data.rootDir.name + "mock/test.json",
                text: '{"data":"test"}',
                isFile: true
            }]
        }, {
            name: data.rootDir.name + "service",
            state: true,
            subUrl: [{
                url: data.rootDir.name + "service/service.js",
                text: serviceJs,
                isFile: true
            }]
        }, {
            name: data.rootDir.name + "static",
            state: true,
            subUrl: [{
                name: data.rootDir.name + "static/image",
                state: false,
                isFile: false
            }, {
                name: data.rootDir.name + "static/css",
                state: false,
                isFile: false,
                files: [{
                    url: data.rootDir.name + 'static/css/reset.css',
                    text: resetCss
                }]
            }, {
                name: data.rootDir.name + "static/js",
                state: false,
                isFile: false
            }]
        },
        {
            name: data.rootDir.name + "views",
            state: true,
            subUrl: [{
                name: data.rootDir.name + "views/common",
                state: true,
                isFile: false,
                files: [{
                    url: data.rootDir.name + 'views/common/test.html',
                    text: html.test
                }]
            }],
            html: {
                url: data.rootDir.name + 'views/index.html',
                text: html.index,
            }
        }
    ],
    relys: [{
        name: data.rootDir.name + "main.js",
        text: defaultFiles[0],
        state: false,
    }, {
        name: data.rootDir.name + "package.json",
        text: defaultFiles[1],
        state: false,
    }, {
        name: data.rootDir.name + "app.js",
        text: defaultFiles[2],
        state: false,
    }, {
        name: data.rootDir.name + "README.md",
        text: defaultFiles[3],
        state: false,
    }, {
        name: data.rootDir.name + "HISTORY.md",
        text: defaultFiles[4]+(new Date()).toLocaleString()+' --- '+os.userInfo().username,
        state: false,
    }]
}



fs.stat(data.rootDir.name, function(err, stats) {
    if (err) { //文件不存在
        fs.mkdir(data.rootDir.name, function(err) {

            if (err) {
                console.log(err);
                console.log('文件夹' + data.rootDir.name + '创建失败')
            } else {

                console.log('文件夹' + data.rootDir.name + '创建成功');

                makeData(data);
            }

        })
    } else { //文件存在

        makeData(data);
    }
})


const makeData = (data) => {

    //创建主体文件夹，以及相关文件
    data.urls.forEach(function(item, i) {
        fs.mkdir(item.name, function(err) {
            console.log('文件夹' + item.name + '创建成功2')

            if (item.state) {

                item.subUrl.forEach(function(itemJ, j) {

                    if (itemJ.isFile) {
                        fs.writeFile(itemJ.url, itemJ.text, function(err) {
                            console.log('文件' + itemJ.url + '创建成功')
                        })
                    } else {
                        fs.mkdir(itemJ.name, function(err) {
                            console.log('文件夹' + itemJ.name + '创建成功3');
                            //子目录存在文件
                            if (itemJ.files) {
                                itemJ.files.forEach(function(itemK, k) {
                                    fs.writeFile(itemK.url, itemK.text, function(err) {
                                        console.log('文件' + itemK.url + '创建成功')
                                    })
                                })
                            }
                        })
                    }

                })

            }
        });

        if (item.html) {
            fs.writeFile(item.html.url, item.html.text, function(err) {
                console.log('文件app' + item.html.url + '创建成功')
            })
        }

    })


    //项目所需要的依赖（app.js , main.js , package.json）
    data.relys.forEach(function(item, i) {
        fs.writeFile(item.name, item.text, function(err) {
            console.log('文件' + item.name + '创建成功')
        })
    })



}