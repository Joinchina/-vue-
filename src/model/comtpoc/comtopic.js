import API from '@/global/resource'
import http from '@/global/request'
//通用题目
export default {
  comFindByAndTypeAndLevel(data, callback) {
    http.get(API.urls.comFindByAndTypeAndLevel, data, 'h2', callback)
  },

  comSave(data, callback) {
    http.jsonPost(API.urls.comSave, data, callback)
  },
  getdefaulttemplate(data, callback){
    http.get(API.urls.getdefaulttemplate, data, 'h2', callback)
  },
  getdetemplatedetail(data, callback){
    http.get(API.urls.getdetemplatedetail, data, 'h2', callback)
  },
  updatetemplatequestion(data, callback,progress){
    http.post(API.urls.updatetemplatequestion, data, 'file', callback, 'file', [], progress )
  },
  updatetemplatedetail(data, callback,progress){
    http.post(API.urls.updatetemplatedetail, data, 'file', callback, progress )
  }

}
