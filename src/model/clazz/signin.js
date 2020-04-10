import API from '@/global/resource'
import http from '@/global/request'
export default {
  // 签到列表
  signList (data, callback) {
    http.get(API.urls.signList, data, 'h2', callback)
  },
  // 新建签到
  signSave (data, callback) {
    http.post(API.urls.signSave, data, 'h2', callback)
  },
  //签到详情，签到成功
  signFindId (data, callback) {
    http.get(API.urls.signFindId, data, 'h2', callback)
  },
  //下载二维码
  signCodeDownLoad (data, callback) {
    http.get(API.urls.signCodeDownLoad, data, 'h2', callback)
  },
  //导出EXCEL:班级签到信息
  exportSignExcel (data, callback) {
    http.get(API.urls.exportSignExcel, data, 'h2', callback)
  },
  //导出EXCEL:签到明细信息
  exportSigndetail (data, callback) {
    http.get(API.urls.exportSigndetail, data, 'h2', callback)
  },
  //导出EXCEL:学员名单
  exportUserList (data, callback) {
    http.get(API.urls.exportUserList, data, 'h2', callback)
  },
  //已签到学员列表
  signUserList (data, callback) {
    http.get(API.urls.signUserList, data, 'h2', callback)
  },
  //未签到学员列表
  unSignUserList (data, callback) {
    http.get(API.urls.unSignUserList, data, 'h2', callback)
  },
  //添加标签
  addSignTag(data, callback){
    http.post(API.urls.addSignTag, data, 'h2', callback)
  },
  //取消标签
  delSignTag(data, callback){
    http.post(API.urls.delSignTag, data, 'h2', callback)
  },
  //删除签到
  signDelete (data, callback) {
    http.post(API.urls.signDelete, data, 'h2', callback)
  },
  //代签
  agentSign (data, callback) {
    http.post(API.urls.agentSign, data, 'h2', callback)
  },
  //签到大屏幕
  largeScreen (data, callback) {
    http.get(API.urls.largeScreen, data, 'h2', callback)
  },
  //导入签到
  importSign(data,callback){
    http.post(API.urls.importSign, data, 'file', callback, 'file')
  },
  //签到-修改时间设置
  updateEndTime(data,callback,watingFlag){
    http.post(watingFlag ? API.urls.signInupdateTime : API.urls.updateEndTime, data, 'h2', callback)
  },

  //后台导出签到失败excel
  exportSignAddFalseExcel(data,callback){
      http.get(API.urls.exportSignAddFalseExcel, data, 'h2', callback)
  },

  //签到大屏幕
  signLargeScreen(data,callback){
    http.get(API.urls.signlargeScreen, data, 'h2', callback)
  }

}
