import API from '@/global/resource'
import http from '@/global/request'

export default {
    // 获取课程领域
    getclazzfield(data, callback) {
        http.get(API.urls.getclazzfield, data, 'h2', callback)
    },
    // 删除课程领域
    deleteclazzfield(data, callback) {
        http.post(API.urls.deleteclazzfield, data, 'h2', callback)
    },
    // 新增课程领域
    addclazzfield(data, callback) {
        http.post(API.urls.addclazzfield, data, 'h2', callback)
    },
    // 修改课程领域
    editclazzfield(data, callback) {
        http.post(API.urls.editclazzfield, data, 'h2', callback)
    },
    // ------------------------专家库------------------------------
    //获取专家库列表
    getexpertlist(data,callback){
        http.get(API.urls.getexpertlist,data,'h2',callback)
    },
    // 新增专家
    addexpert(data, callback) {
        http.jsonPost(API.urls.addexpert, data, callback)
    },
    // 编辑专家
    editexpert(data, callback) {
        http.jsonPost(API.urls.editexpert, data, callback)
    },
    // 删除专家
    deleteexpert(data, callback) {
        http.post(API.urls.deleteexpert, data, 'h2', callback)
    },
    // 获取专家信息
    getexpertinfo(data, callback) {
        http.get(API.urls.getexpertinfo, data, 'h2', callback)
    },
    //获取专家职称
    getexperttitle(data,callback){
        http.get(API.urls.getexperttitle,data,'h2',callback)
    },
    //获取所有的学段学科
    getstudentinfo(data,callback){
        http.get(API.urls.getstudentinfo,data,'h2',callback)
    },
    //申请专家联系表
    applylist(data,callback){
        http.get(API.urls.applylist,data,'h2',callback)
    },
    //申请专家联系表导出
    applyexport(data,callback){
        http.get(API.urls.applyexport,data,'h2',callback)
    },
    //新增申请专家联系
    applyadd(data,callback){
        http.post(API.urls.applyadd,data,'h2',callback)
    },
    //省市县联动
    getcity(data,callback){
        http.get(API.urls.getcity,data,'h2',callback)
    },
    getshi(data,callback){
        http.get(API.urls.getshi,data,'h2',callback)
    },
    //阿里云上传头像
    postimg(data,callback){
        http.get(API.urls.posttopimg,data,'h2',callback)
    },  
}
