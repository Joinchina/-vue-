import API from '@/global/resource'
import http from '@/global/request'

export default {
	// 讨论历史消息列表
	liveroomChatRecord (data, callback) {
		http.get(API.urls.liveroomChatRecord, data, 'h2', callback)
	}
}