import API from '@/global/resource'
import http from '@/global/request'

export default {

  getBootDiagram (data,callback) {
    http.get(API.urls.getBootDiagram, data,'h2', callback)

  },

  saveBootDiagram (data, callback) {
  	http.post(API.urls.saveBootDiagram, data, 'h2', callback)
  },

  uploadPic(data, callback) {
  	http.post(API.urls.uploadApp, data, 'file', callback, 'file')
  }
 
}