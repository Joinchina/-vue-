import API from '@/global/resource'
import http from '@/global/request'

export default {
	
	// 获取照片墙活动照片数量
	getMsgBoardCount(data, callback) {
		http.get(API.urls.msgBoardCount, data, 'h2', callback)
	}

	
}