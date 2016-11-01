/**
 * 动态遍历目录加载路由工具
 * author: bling兴哥
 */
var fs = require("fs");
// 动态路由
var folder = {
    folder : './routes',
    hasSuffixes: null, 
    fileList: [],
    // 遍历目录
    listDir : function(path){
        var fileList = fs.readdirSync(this.folder+path,'utf-8');
        for(var i=0;i<fileList.length;i++) {
            var stat = fs.lstatSync(this.folder+path + fileList[i]);
            // 是目录，需要继续
            if (stat.isDirectory()) {
                this.listDir(path + fileList[i]  + '/');
            } else {
                this.addFile(path + fileList[i]);
            }
        }
    },
    // 加载文件路径(无后缀)
    addFile : function(file){
        if(!this.hasSuffixes)
            file = file.substring(0,file.lastIndexOf('.'));
        //console.log(file);
        this.fileList.push(file);
    },
    getList: function(){
        this.listDir("/");
        return this.fileList;
    },
    // 初始化入口
    init : function(folder, hasSuffixes){
        //this.folder = folder;
        this.hasSuffixes = hasSuffixes==undefined?true:hasSuffixes;
        return this;
    }
};
 
module.exports = folder;