import API from '@/global/resource'
import http from '@/global/request'

export default {
	// 培训效果数据
	getTrain(data, callback) {
		http.get(API.urls.reportTrainData, data, 'h2', callback)
	},
	

}