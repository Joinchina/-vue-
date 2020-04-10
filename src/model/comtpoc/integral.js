import API from '@/global/resource'
import http from '@/global/request'

export default {
	// 删除一条积分任务
	postDelTask(data, callback) {
		http.post(API.urls.usertaskDel, data, 'h2', callback)
	},

	// 查询单条积分任务
	getTaskOne(data, callback) {
		http.get(API.urls.usertaskFindOne, data, 'h2', callback)
	},

	// 查询所有积分
	getTaskList(data, callback) {
		http.get(API.urls.usertaskList, data, 'h2', callback)
	},

	// 获取手动加分原因
	getTaskReason(data, callback) {
		http.get(API.urls.usertaskReasonList, data, 'h2', callback)
	},

	// 编辑更新手动积分原因
	postTaskReasonSave(data, callback) {
		http.post(API.urls.usertaskReasonSave, data, 'h2', callback)
	},

	// 新增一条积分任务
	postTaskSave(data, callback) {
		http.post(API.urls.usertaskSave, data, 'h2', callback)
	},

	// 编辑更新积分任务
	postTaskUpdate(data, callback) {
		http.post(API.urls.usertaskUpdate, data, 'h2', callback)
	},

	// 启用或禁用一条任务
	postTaskAvailable(data, callback) {
		http.post(API.urls.usertaskAvailable, data, 'h2', callback)
	}
}