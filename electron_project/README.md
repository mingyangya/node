## 基于koa2 + electron 构建桌面应用

### 目录结构

```
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

```

### 项目安装以及运行

``` bash
# 安装依赖
npm install

# 浏览器环境 server running is http://localhost:5000
npm run start 

# 客户端环境 (应用程序)
npm run dev 

# 生产环境 build for production with electron
npm run build
```

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

