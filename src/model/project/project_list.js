import API from '@/global/resource'
import http from '@/global/request'

export default {

	getProList (data,callback) {
		http.get(API.urls.getProList+"?"+data,null, 'h2', callback)
	},
	
	createPro (data, callback) {
		http.post(API.urls.createPro, data, 'h2', callback)
	}
	
}
