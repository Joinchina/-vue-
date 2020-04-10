import API from '@/global/resource'
import http from '@/global/request'

export default {
    // 班级资源:资源列表
    resClazzList(data, callback) {
        http.get(API.urls.resClazzList, data, 'h2', callback)
    },

    // 通用资源列表 admin
    resCommonList(data, callback) {
        http.get(API.urls.resCommonList, data, 'h2', callback)
    },

    // 单个资源详情
    resDetails(data, callback) {
        http.get(API.urls.resDetails, data, 'h2', callback)
    },

    // 删除文件夹或资源
    resDelete(data, callback) {
        http.post(API.urls.resDelete, data, 'h2', callback)
    },

    // 新建文件夹或上传资源
    resSave(data, callback, progress) {
        http.post(API.urls.resSave, data, 'file', callback, 'file', [], progress )
    },

    // 编辑文件夹或资源
    resUpdate(data, callback) {
        http.post(API.urls.resUpdate, data, 'file', callback, 'file')
    },

    // 班级资源：选择资源列表
    resRelateClazz(data, callback) {
        http.get(API.urls.resRelateClazz, data, 'h2', callback)
    },

    // 班级资源：查看人列表
    resViewUser(data, callback) {
        http.get(API.urls.resViewUser, data, 'h2', callback)
    },


}
