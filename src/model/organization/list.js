import API from '@/global/resource'
import http from '@/global/request'

export default {

  getOrgList (data,callback) {
    http.get(API.urls.getOrgList+"?userIds="+data,null,'h2', callback)
  },
  createOrg (data, callback) {
  	http.jsonPost(API.urls.createOrgVip, data,  callback)
  },
  getDetail(data, callback){
    http.get(API.urls.getVipOrgDetail,data,'h2', callback)
  },
  orgUpdate(data, callback){
    http.jsonPost(API.urls.orgUpdateVip, data, callback)
  },

  getOrgType(data, callback) {
    http.get(API.urls.getOrgType, data, 'h2', callback)
  },
  getProvince(data, callback) {
    http.get(API.urls.getProvince, data, 'h2', callback)
  },

  //阿里云图片上传
  getAliyunImg(data, callback) {
      http.get(API.urls.AliyunEditImg, data, 'h2', callback)
  },
  //阿里云机构logo上传
  getAliyunOrgLogo(data, callback) {
    http.get(API.urls.getAliyunOrgLogo, data, 'h2', callback)
},
  // 获取vip与非vip默认配置
  defaultConfiguration(data, callback){
    http.get(API.urls.vipDefaultConfiguration, data, 'h2', callback)
    
  }
}
