import API from '@/global/resource'
import http from '@/global/request'

export default {
	// 签到详细数据
	getSignData(data, callback) {
		http.get(API.urls.reportSign, data, 'h2', callback)
	},
	// 签到人员明细
	getSignDetail(data, callback) {
		http.get(API.urls.reportSignDet, data, 'h2', callback)
	}

}