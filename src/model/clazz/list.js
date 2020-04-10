import API from '@/global/resource'
import http from '@/global/request'

export default {

	getClazzList (data,callback) {
		http.get(API.urls.getClazzList+"?"+data,null, 'h2', callback)
	},

	createClass (data, callback) {
		http.post(API.urls.createClass, data, 'h2', callback)
	},

	editClass (data, callback) {
		http.post(API.urls.editClass, data, 'h2', callback)
	},

	delClass(data, callback) {
		http.post(API.urls.delClass, data, 'h2', callback)
	},

	getClassInfor(data, callback,loading) {
		http.get(API.urls.getClassInfor, data, 'h2', callback,loading)
	}
}