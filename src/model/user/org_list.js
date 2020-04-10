import API from '@/global/resource'
import http from '@/global/request'

export default {

	getOrgAdminList (data, callback) {
		http.get(API.urls.getOrgAdminList, data, 'h2', callback)
	},

	getProAdminList (data, callback) {
		http.get(API.urls.getProAdminList, data, 'h2', callback)
	},

	getClassAdminList (data, callback) {
		http.get(API.urls.getClaList, data, 'h2', callback)
	},

	getProfessorList (data, callback) {
		http.get(API.urls.getProfessorList, data, 'h2', callback)
	},

	getStudentList (data, callback) {
		http.get(API.urls.getStudentList, data, 'h2', callback)
	}
}