//引入文件模块
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
};