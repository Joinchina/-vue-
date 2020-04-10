import API from '@/global/resource'
import http from '@/global/request'
export default {
  /**
   * 积分
   **/
  // 列表
  IntegralList (data, callback) {
    http.get(API.urls.IntegralList, data, 'h2', callback)
  },
  // 获取加分原因和分值
  IntegraDicFindAll (data, callback) {
    http.get(API.urls.IntegraDicFindAll, data, 'h2', callback)
  },
  // 加分
  IntegraSave (data, callback) {
    http.post(API.urls.IntegraSave, data, 'h2', callback)
  },
  // 查看
  IntegrafindByUserId(data, callback, fileArray) {
    http.get(API.urls.IntegrafindByUserId,  data, 'h2', callback)
  },
  // 查看单项积分
  integraItemsDetail(data, callback) {
    http.get(API.urls.integraItemsDetail,  data, 'h2', callback)
  },
}
