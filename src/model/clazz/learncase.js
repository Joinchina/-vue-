import API from '@/global/resource'
import http from '@/global/request'

// 学情信息
export default {
	// 学情列表
	clazzLearnList(data, callback) {
        http.get(API.urls.clazzLearnList, data, 'h2', callback)
    },

    // 个人学情
    clazzLearnOne(data, callback) {
      	http.get(API.urls.clazzLearnOne, data, 'h2', callback)
    },

    // 获取学情规则
    clazzLearnRuleGet(data, callback) {
    	http.get(API.urls.clazzLearnRuleGet, data, 'h2', callback)
    },

    // 更新学情规则
    clazzLearnRulePost(data, callback) {
    	http.post(API.urls.clazzLearnRulePost, data, 'h2', callback)
    }
    
}