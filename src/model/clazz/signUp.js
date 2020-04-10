import API from '@/global/resource'
import http from '@/global/request'
import {getToken} from '@/filters/userVerify'
export default {
	// 获取可用于搜索的字段信息
	searchableFields (data, callback) {
		http.get(API.urls.searchableFields, data, 'h2', callback)
	},
	// 获取选择的所有报名字段信息
	selectedFields (data, callback) {
		http.get(API.urls.selectedFields, data, 'h2', callback)
	},
	// 分页查询已报名学员信息
	pageSearch (data, callback) {
		http.get(API.urls.pageSearch, data, 'h2', callback)
	},
	// 下发报名二维码
	qRCode(data, callback) {
		http.post(API.urls.qRCode, data, 'h2',callback)
    },
    // 设置报名字段信息
	setFields(data, callback) {
		http.jsonPost(API.urls.setFields, data,callback)
    },
    // 设置报名信息
	setInfo(data, callback) {
		http.jsonPost(API.urls.setInfo, data,callback)
    },
    // 获取班级报名设置信息
	viewInfo(data, callback) {
		http.get(API.urls.viewInfo, data,  'h2', callback)
	},
	// 下载二维码
	getQrCode(data, callback) {
		window.open(API.urls.getQrCode+'?clazzId='+data.clazzId+'&token='+data.token,'_self')
	},
	// 修改学员信息 
	signUpEditUser(data, callback,flag=true) {
		// flag为true不导入   false=》导入
		let apiUrl = flag?API.urls.signUpEditUser:API.urls.signUpEditUserImport;
		http.jsonPost(apiUrl,data,callback);
	},
	// 拒绝选中的多个学员
	batchRefuse(data, callback) {
		http.jsonPost(API.urls.batchRefuse, data,callback)
	},
	// 导入选中的多个学员
	batchImport(data, callback) {
		http.jsonPost(API.urls.batchImport, data,callback)
    },
    // 一键全部导入
	allImport(data, callback) {
		http.post(API.urls.allImport, data,"h2",callback)
    },
    // 导出报名学员名单 
	exportSignUp(data, callback) {
        // http.get(API.urls.exportSignUp, data,"h2",callback);
        window.open(API.urls.exportSignUp+'?clazzId='+data.clazzId+'&token='+getToken(),'_blank');
    },
    // 恢复学员的报名状态 
	recoverSignUp(data, callback) {
        http.post(API.urls.recoverSignUp, data,"h2",callback);
    },
    // 拒绝单个学员 
	refuseSingle(data, callback) {
        http.post(API.urls.refuseSingle, data,"h2",callback);
    },
    // 导入单个学员 
	importSingle(data, callback) {
        http.post(API.urls.importSingle, data,"h2",callback);
	},
}