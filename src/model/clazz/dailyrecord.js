import API from '@/global/resource'
import http from '@/global/request'
//日志管理
export default {
  //日志 - 学员列表页-分页
  getUserlogPageByClazzId(data, callback) {
    http.get(API.urls.getUserlogPageByClazzId, data, 'h2', callback)
  },

  //日志 - 任务要求
  getUserlogRule(data,callback){
  	http.get(API.urls.getUserlogRule, data, 'h2', callback)
  },

  //日志 - 已完成、未完成
  getUserlogFindProgressByClazzId(data, callback) {
    http.get(API.urls.getUserlogFindProgressByClazzId, data, 'h2', callback)
  },

  //日志 - 编辑
  getUserlogUpdate(data, callback) {
    http.post(API.urls.getUserlogUpdate, data, 'h2', callback)
  },

  //日志 - 详情
  getUserlogDetails(data, callback) {
    http.get(API.urls.getUserlogDetails, data, 'h2', callback)
  },

}

