import API from '@/global/resource'
import http from '@/global/request'

export default {
    // 班级资源:资源列表
    paperFindByClazzIdAndTypeAndLevel(data, callback) {
        http.get(API.urls.paperFindByClazzIdAndTypeAndLevel, data, 'h2', callback)
    },

    // 模板库评价反思
    paperUploadClazzTemplate(data, callback,progress) {
        http.post(API.urls.paperUploadClazzTemplate, data, 'file', callback, 'file', [], progress )
    },

    //课程评价反思模板
    paperUploadCourseTemplate(data, callback, progress) {
        http.post(API.urls.paperUploadCourseTemplate, data, 'file', callback, 'file', [], progress )
    },


}
