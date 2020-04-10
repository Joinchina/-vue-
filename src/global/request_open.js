'use strict'

import axios from 'axios'
import qs from 'qs'
import config from '@/global/requestdemo/openRequestConfig.js'
import {getToken} from '@/filters/userVerify'
import storage from '@/global/storage'
import {Message} from 'element-ui'
import {env,pars} from '@/global/open'
var openPostInstance = axios.create({
	baseURL: process.env.BASE_API,
	// timeout: config.normarTimeout,
});

// before send request 拦截进行headers统一处理
openPostInstance.interceptors.request.use(function (headerConfig) {
	if (headerConfig["headers"]) {
		let token = getToken(); 
		// 确保当前为登录状态
		if(token){
			 headerConfig["headers"]["Authorization"] = token;
			 if (Boolean(storage.get("orgId"))) {
				 headerConfig["headers"]["orgId"] = storage.get("orgId");
			 }
			 if (Boolean(storage.get("clazzId"))) {
				 headerConfig["headers"]["clazzId"] = storage.get("clazzId");
			 }
	 }
	}
    return headerConfig;
  }, function (error) {
    return Promise.reject(error);
  });

/**
 * 取出匿名参数内容，根据实际判断data,cantoast,callbacks分别是否有值
 * @param 参数列表 
 * @return 返回数组 [params, canToast, callbacks]
 */
function getCallbacks(agr) {
	var len = agr.length;
	if (len <= 1){
		return [{},false,{}];
	}
	var params = (agr[1] && typeof agr[1] == 'object') ? agr[1] : {};
	// [bool,对象]
	var canToast = len >= 2 && agr[len - 2] === true;
	var callbacks = {};
	var obj = agr[len - 1];
	var existsCallback = (typeof obj == 'object') 
	&& 
	(
		typeof obj.uploadprogress == 'function' ||
		typeof obj.succ == 'function' || 
		typeof obj.fail == 'function' ||
		typeof obj.error == 'function' || 
		typeof obj.final == 'function'
	);
	if (existsCallback) {
		callbacks = obj;
	}
	return [params, canToast, callbacks];
}

function sendRequest(type,url,timeout,params,canToast,obj) {
	var obj = obj || {};
	var headers = config.normalHeaders;
	var method = type == config.requestType.get ? "get" : "post";
	console.log(method);
	console.log("canshu", params);
	if (type == config.requestType.postJson) {
		headers = config.jsonHeader;
	}
	if(!((typeof url == 'string') && url.constructor == String && url.length > 0)){ 
		throw Error("url 不允许为空");
	}
	openPostInstance({
		url,
		method : method,
		data : method === "post" ? params : null,
		params : method === "get" ? params : null,
		headers : headers,
		timeout : timeout,
		onUploadProgress: function(progressEvent) {
            if (progressEvent.lengthComputable && obj.uploadprogress) {
                obj.uploadprogress && obj.uploadprogress(progressEvent);
            }
        }
	}).then(res => {
		if (res && res.data && res.data.status == 200) {
			res.data = res.data || {};
			obj.succ && obj.succ(res.data);
		}else{
			businessErrorCode(res.data.status);
			var msg = res.data.message;
			res.data.message = (msg && msg.length > 0 && msg != 'undefined') ? msg : config.businessNormalErrorMsg;
			obj.fail && obj.fail(res.data);
		}
	}).catch(err => {
		console.log("err====",err);
		//服务器500 服务器报错
		httpErrorCode(err.response.status);
		if (canToast) {
			Message.error(config.networkErrorMsg.replace("{0}",err.response.status + 1000000));
		}
		obj.neterror && obj.neterror(err);
	}).finally(() => {
		obj.final && obj.final();
	});
}

function businessErrorCode(status){
	switch(status){
		case 900:
		router.push({
            path: "/login"
        })
        Message.error(res.data.message);
        localStorage.clear();
		break;
		case 505:
		console.log("系统异常");
		break;
		case 205:
		console.log("业务出错");
		break;
		default:
	}
}

function httpErrorCode(status){
	var errorMsg = "";
	switch(status){
		case 500:
				errorMsg = "服务器报错";
				break;
		case 404:
				errorMsg = "未找到页面";
				break;
		case 403:
				errorMsg = "未授权";
				break;
		default:
				errorMsg = "未标记错误";
				break;
	}
	console.log(errorMsg + "!错误码：" + status);
}

export default {
	// get request
	get(url,data,canToast,{succ,fail,error,final} = {}){
		let agrs = getCallbacks(arguments);
		sendRequest(config.requestType.get,url,config.normarTimeout,agrs[0],agrs[1],agrs[2]);
	},

	// post request
	post(url,data,canToast,{uploadprogress,succ,fail,neterror,final} = {}){
		let agrs = getCallbacks(arguments);
		let datas = qs.stringify(agrs[0]);
		sendRequest(config.requestType.post,url,config.normarTimeout,datas,agrs[1],agrs[2]);
	},

	// uploadFile request
	postFile(url,data,canToast,{uploadprogress,succ,fail,neterror,final}){
		let agrs = getCallbacks(arguments);
		let param = new FormData();
		if(!!agrs[0] && !!agrs[0].file && Object.prototype.toString.call(agrs[0].file) == "[object Object]"){
			//复制数据
			let fileCopy = Object.assign({}, agrs[0]);
			for(var i in fileCopy.file){
				let len = fileCopy.file[i].length;
				for(var z = 0; z < len; z++){
					console.log(fileCopy.file[i][z]);
					param.append(z,fileCopy.file[i][z])
				}
			}
			delete fileCopy.file;
			console.log("filecopy====",fileCopy);
			for(var j in fileCopy){
				param.append(j,fileCopy[j]);
			}
			let datas = param;
			sendRequest(config.requestType.postFile,url,config.uploadTimeout,datas,agrs[1],agrs[2]);
		}else{
			Message.error("请传对象格式")
		}
	},

	//postJson
	postJson(url,data,canToast,{uploadprogress,succ,fail,neterror,final}){
		let agrs = getCallbacks(arguments);
		sendRequest(config.requestType.postJson,url,config.normarTimeout,agrs[0],agrs[1],agrs[2]);
	},
}