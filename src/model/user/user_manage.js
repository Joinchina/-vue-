import API from '@/global/resource'
import http from '@/global/request'

export default {
	// 通过ID获取用户
	getUser (data, callback) {
		http.get(API.urls.getUser, data, 'h2', callback)
	},
	// 密码重置
	updatePwd (data, callback) {
		http.post(API.urls.updatePassword, data, 'h2', callback)
	},

	// 删除账号
	deleteUser (data, callback) {
		http.post(API.urls.deleteUser, data, 'h2', callback)
	},

	// 当前机构下新增用户
	orgAddUser (data, callback) {
		http.post(API.urls.orgAddUser, data, 'h2', callback)
	},

	// 当前机构下新增专家用户，有头像
	orgAddProfessor (data, callback) {
		http.post(API.urls.orgAddUser, data, 'file', callback, 'file')
	},

	// 当前机构下编辑用户
	orgEditUser (data, callback) {
		http.post(API.urls.orgEditUser, data, 'h2', callback)
	},

	// 当前机构下编辑专家
	orgEditProfessor (data, callback) {
		http.post(API.urls.orgEditUser,  data, 'file', callback, 'file')
	},

	// 项目管理员--选项目--项目列表
	proSelect (data, callback) {
		http.get(API.urls.proSelect, data, 'h2', callback)
	},

	// 当前机构下-项目管理员选项目
	joinProject (data, callback) {
		http.post(API.urls.joinProject, data, 'h2', callback)
	},

	// 班主任，专家-选班-班级列表
	ClassSelect (data, callback) {
		http.get(API.urls.classSelect, data, 'h2', callback)
	},

	// 当前机构下-班主任、专家-选班级
	joinClass (data,  callback) {
		http.post(API.urls.joinClass, data, 'h2', callback)
	}

}