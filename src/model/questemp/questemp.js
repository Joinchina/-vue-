import API from '@/global/resource'
import http from '@/global/request'

export default {
	// 更新模板被使用次数
	postUsedTimes(data, callback) {
		http.post(API.urls.questempUsedTimes, data, 'h2', callback)
	},
	// 添加至机构模板库
	postAddtoOrg(data, callback) {
		http.post(API.urls.questempAddtoOrg, data, 'h2', callback)
	},

	// 删除问卷模板
	postDel(data, callback) {
		http.post(API.urls.questempDel, data, 'h2', callback)
	},

	// 获取机构问卷模板集合列表
	getQuestempList(data, callback) {
		http.get(API.urls.questemplist, data, 'h2', callback)
	},

	// 获取机构问卷模板分页列表
	getQuestempOrgPage(data, callback) {
		http.get(API.urls.questempOrgPage, data, 'h2', callback)
	},

	// 获取admin问卷模板分页列表
	getQuestempAdminPage(data, callback) {
		http.get(API.urls.questempAdminPage, data, 'h2', callback)
	},

	// 查看模板详情
	getFindOne(data, callback) {
		http.get(API.urls.questempFindOne, data, 'h2', callback)
	},

	// 创建问卷模板
	postCreateTemp(data, callback) {
		http.jsonPost(API.urls.questempCreate, data, callback)
	},

	// 编辑问卷模板
	postUpdateTemp(data, callback) {
		http.jsonPost(API.urls.questempUpdate, data, callback)
	}

}