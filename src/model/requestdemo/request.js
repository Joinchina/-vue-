'use strict'
/*
	建议所有业务写在这里
*/

import http from "@/global/requestdemo/request.js"


var vdata = {
	obj : {a:"12"},
	msg : 'Welcome to Your Vue.js App',
	items : ["1","2","3","4"],
	formName : {
		name : "",
		photos: [], // 上传图片数组
		fileLists:[], // 上传文件数组
	},
	rules: {
		name: [
			{ required: true, message: '必须输入手机号', trigger: 'blur' },
			// { type:'number', message: '11位数字', trigger: 'blur' }
		]
	},
	labelWidth : "130px",
	imageUrl : [], // 上传图片 -- 获取指定文件图片的数组
	num : 0, // 上传图片 -- 记录图片上传的个数
	fileNum:0, //上传文件 -- 记录文件的上传的个数
	loading:true, // loading标识
	loadingText:"", // loading文本
}


export default {
	 vdata,
	 //获取班级详情
	 getClazzDetail(params,vm) {
		return new Promise((resolve,reject) => {
			http.get("clazz/id",params,{
				succ: function (res){
					vm.msg += "callback succ";
				},
				fail: function (res){
					vm.obj.a += "callback fail";
					reject(res);
				},
				neterror: function (res){
					console.log("netError");
					vm.msg += "callback neterror";
				},
				// final: function (res){
				// 	vm.msg += "callback final";
				// 	// vm.data1.a = "callback final";
				// }
			});
		});
	},

	//登录
	userNameLogin(params,vm) {
		return new Promise((resolve,reject) => {
			http.post("login",params,true,{
				succ: function (res){
					console.log("login-success-",res);
					resolve(res);
				},
				fail: function (res){
					console.log("fail-",res)
					reject(res);
				},
				neterror: function (res){
					console.log("login-neterror-",res);
				},
				final: function (res){
					console.log("login-final-",res);
				}
			});
		});
	},

	//作业上传
	uploadHomeWork(params,vm){
		return new Promise((resolve,reject)=>{
			http.postFile("homework/save",params,true,{
				succ: function(res){
					console.log("login-success-",res);
				},
				uploadprogress : function (res){
					console.log("文件长传中zao=================",res);
					let progress = Math.round(parseFloat(res.loaded/res.total)*100);
		    		vm.loadingText = "文件上传中" + progress + '%';
		    		console.log("文件上传中=====",vm.loadingText);
				},
				final: function (res){
					console.log("login-final-",res);
				}
			})
		});
	},

	//报名
	signUpName(params,vm){
		return new Promise((resolve,reject)=>{
			http.postJson("signup/set/info",params,true,{
				succ: function(res){
					console.log("login-success-",res);
				},
				fail: function (res){
					console.log("fail-",res)
					reject(res);
				},
				neterror: function (res){
					console.log("login-neterror-",res);
				},
				final: function (res){
					console.log("login-final-",res);
				}
			})
		});
	},

	//导出文件
	exportFile(params){
		http.exportFile(params);
	},

	userNameLogin1(params,vm){
		return new Promise((resolve,reject) => {
			http.post("login",params,{});
		});
	}
}
// {
//                                   'username': _this.ruleForm.username,
//                                   'password': _this.ruleForm.password
//                               }
