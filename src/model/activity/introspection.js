import API from '@/global/resource'
import http from '@/global/request'

export default {
	// 反思列表
	introspectionList (data, callback) {
		http.get(API.urls.introspectionList, data, 'h2', callback)
	}
}