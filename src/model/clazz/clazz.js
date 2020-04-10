import API from '@/global/resource'
import http from '@/global/request'
//学员信息
export default {
    //学员信息
    getStuMsg(data, callback) {
        http.get(API.urls.getUser, data, 'h2', callback)
    },

    getClassInfor(data, callback, loading) {
        http.get(API.urls.getClassInfor, data, 'h2', callback, loading)
    },

    editClass(data, callback) {
        http.post(API.urls.editClass, data, 'h2', callback)
    },

    // 生活服务-查看
    lifeDetails(data, callback) {
        http.get(API.urls.lifeDetails, data, 'h2', callback)
    },
    // 保存生活服务
    lifeSave(data, callback) {
        http.post(API.urls.lifeSave, data, 'h2', callback)
    },


    // 班级设置
    clazzRemoteStatus(data, callback) {
        http.post(API.urls.clazzRemoteStatus, data, 'h2', callback)
    },
    //班级下的项目满意度
    getobjectclassfull(data, callback) {
        http.get(API.urls.getobjectclassfull, data, 'h2', callback)
    },
    //班级明细
    getclassdetail(data, callback) {
        http.get(API.urls.getclassdetail, data, 'h2', callback)
    },
    //机构项目反思留言
    getorgmessage(data, callback) {
        http.get(API.urls.getorgmessage, data, 'h2', callback)
    },
    //机构统计
    getorgId(data, callback) {
        http.get(API.urls.getorgId, data, 'h2', callback)
    },
    //机构课程满意度
    getclazzstatis(data, callback) {
        http.get(API.urls.getclazzstatis, data, 'h2', callback)
    },
}