import API from '@/global/resource'
import http from '@/global/request'

export default {
    // 查看班级网课配置规则
    getOnlineSet(data, callback) {
        http.get(API.urls.onlineSetGet, data, 'h2', callback)
    },

    //发布课程规则
    publishTaskRule(data,callback){
         http.jsonPost(API.urls.onlineSetPost, data, callback)

          // http.post(API.urls.onlineSetPost, data, 'h2', callback)
    },

    // 发布必修课
    postOnlinePublic(data, callback) {
        http.post(API.urls.onlinePublish, data, 'h2', callback)
    },

    // 移除必修课
    postOnlineRemove(data, callback) {
        http.post(API.urls.onlineRemove, data, 'h2', callback)
    },

    // 全部已选必须课
    getOnlineRequire(data, callback) {
        http.get(API.urls.onlineAllRequire, data, 'h2', callback)
    },

    // 已选课程状态信息
    getOnlineRequireInfo(data, callback) {
        http.get(API.urls.onlineRequireInfo, data, 'h2', callback)
    },

    // 网课学员列表
    getOnlineUser(data, callback) {
        http.get(API.urls.onlineUser, data, 'h2', callback)
    },

    //搜索必须课
    searchRequiredCourse(data, callback){
        http.get(API.urls.onlineSearch, data, 'h2', callback)
    },

    //添加必须课
    addRequiredCourse(data, callback){
        http.post(API.urls.onlineAdd, data, 'h2', callback)
    },

    //获取学段学科数据
    onlineStageAndSubject(data,callback){
         http.get(API.urls.onlineStageAndSubject, data, 'h2', callback)
    },
    //查看班级未发布课程
    onlineunPublish(data, callback){
        http.get(API.urls.onlineunPublish, data, 'h2', callback)
    },
    //获取课程详细信息
    onlineCourseDetail(data,callback){
        http.get(API.urls.onlineCourseDetail, data, 'h2', callback)
    }
}
