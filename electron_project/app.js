const path=require('path');
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
});