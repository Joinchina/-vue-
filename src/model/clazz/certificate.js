import API from '@/global/resource'
import http from '@/global/request'
//证书信息
export default {
    //下载导入学员模板Excel
    clazzCertDownTemp(data, callback) {
        http.get(API.urls.clazzCertDownTemp, data, 'h2', callback)
    },

    // 班级下证书全部删除
    clazzCertDelAll(data, callback) {
      	http.post(API.urls.clazzCertDelAll, data, 'h2', callback)
    },

    // 证书单个删除
    clazzCertDelOne(data, callback) {
        http.post(API.urls.clazzCertDelOne, data, 'h2', callback)
    },

    // 导出学员证书失败
    clazzCertExpFail(data, callback) {
        http.get(API.urls.clazzCertExpFail, data, 'h2', callback)
    },

    // 批量导入学员证书信息
    clazzCertImportUser(data, callback) {
        http.post(API.urls.clazzCertImportUser, data, 'file', callback, 'file')
    },

    // 颁发证书列表
    clazzCertList(data, callback) {
        http.get(API.urls.clazzCertList, data, 'h2', callback)
    },

    // 证书搜索
    clazzCertSearch(data, callback) {
        http.get(API.urls.clazzCertSearch, data, 'h2', callback)
    },

    // 证书编辑
    clazzCertUpdate(data, callback) {
        http.post(API.urls.clazzCertUpdate, data, 'h2', callback)
    },
}