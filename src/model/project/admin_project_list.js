import API from '@/global/resource'
import http from '@/global/request'

export default {

  getAdminProList (data, callback) {
    http.get(API.urls.getAdminProList + "?"+data, null, 'h2', callback)
  }
}
