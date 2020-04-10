import API from '@/global/resource'
import http from '@/global/request'

export default {
	// 申请试用列表
	getList(data, callback) {
		http.get(API.urls.reserveUseList, data, 'h2', callback)
	},
	// 分页获取商务联系表
	buschat(data, callback) {
		http.get(API.urls.buschat, data, 'h2', callback)
	},
}