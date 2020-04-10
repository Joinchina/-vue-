import API from '@/global/resource'
import http from '@/global/request'

export default {

	getOrgList (data, callback) {
		http.get(API.urls.userOrgList, data, 'h2', callback)
	},

	getProList (data, callback) {
		http.get(API.urls.userProList, data, 'h2', callback)
	},

	getClassList (data, callback) {
		http.get(API.urls.userClassList, data, 'h2', callback)
	},

	getProfessorList (data, callback) {
		http.get(API.urls.userProfessorList, data, 'h2', callback)
	},

	getStudentList (data, callback) {
		http.get(API.urls.userStuList, data, 'h2', callback)
	}
}