/**
 * 动态遍历目录加载路由工具
 * author: bling兴哥
 * 
 * edited by Marco, added file extention filtering
 */
var fs = require("fs");
// 动态路由
var router = {
    folder : './routes',
    fileList: [],
    acceptExts: ['js'],
    // 遍历目录
    listDir : function(path){
        var fileList = fs.readdirSync(this.folder+path,'utf-8');
        for(var i=0;i<fileList.length;i++) {
            var stat = fs.lstatSync(this.folder+path + fileList[i]);
            // 是目录，需要继续
            if (stat.isDirectory()) {
                this.listDir(path + fileList[i]  + '/');
            } else {
                var splited = fileList[i].split('.')
                var ext = splited[splited.length - 1]
                if (this.acceptExts.includes(ext)) {
                    this.addFile(path + fileList[i]);
                }
            }
        }
    },
    // 加载文件路径(无后缀)
    addFile : function(file){
        file = file.substring(0,file.lastIndexOf('.'));
        //console.log(file);
        this.fileList.push(file);
    },
    getList: function(){
        this.listDir("/");
        return this.fileList;
    },
    // 初始化入口
    init : function(folder){
        this.folder = folder==undefined?this.folder:folder;
        return this;
    }
};
 
module.exports = router;