'use strict'

import axios from 'axios'
import qs from 'qs'
import {
    getToken,getQuery
} from '@/filters/userVerify'
import API from '@/global/resource'
import {
    Message,
    Loading
} from 'element-ui'
import router from '@/router'
import Vue from 'vue';


axios.interceptors.request.use(function(config){
    if(config.url.indexOf("/aliyun/")>-1){
        let orgId = Boolean(getQuery("orgId")) ? getQuery("orgId") : Boolean(localStorage.orgId) ? JSON.parse(localStorage.orgId).identification : null;
        if(config.method == "get"){
            config.params = typeof config.params == "object" ? config.params : {};
            config.params.organizationId = orgId;
            config.params.clazzId = getQuery("clazzId");
        }
        
    }
	return config
},function(error){
	return Promise.reject(error)
})

function setArg(headers, successCallBack) {
    const BOUNDARY = "----" + new Date().getTime();
    // 设置headers请求参数
    if (typeof headers === 'function') {
        successCallBack = successCallBack || headers;
        headers = undefined;
    }

    if (headers == 'h1') {
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json;charset=UTF-8'
        }
    } else if (headers == 'h2') {
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json;charset=UTF-8',
            'Authorization': getToken()
        }
    } else if (headers == 'file') {
        headers = {
            'Content-Type': 'multipart/form-data;',
            'Authorization': getToken()
        }
    } else {
        headers = headers
    }

    return headers;
}

function errorMsg(error) {
    if (error.response) {
        //请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
        // console.log(error.response.data);
        // console.log(error.response.header);
        console.log(error.response.status); // 500 404
        if (error.response.status == 500) {
            console.log("服务器错误");
        }

        if (error.response.status == 404) {
            console.log("找不到页面");
        }
        if(error.response.status == 403){
            console.log("没有登录，跳转到登录页面");
        }

    } else {
        //一些错误是在设置请求的时候触发
        // console.log('Error',error.message);
    }
    // console.log(error.config);
};

export default {
    /**
    url  data  successCallBack 必填
    data 无 可用 {} 代替
    */
    getFailSet: function(url = '', params, headers, successCallBack, fail = false) {
        // 设置请求参数
        headers = setArg(headers, successCallBack);
        
        // params 可传空        
        // 返回请求数据
        axios({
            url,
            baseURL: '',
            method: 'get',
            params: params,
            headers: headers,
            timeout: API.intServiceReqTimeout,
            maxContentLength: 2000,
        }).then(res => {
            if (res.data.status == 900) {
                router.push({
                    path: "/login"
                })
                Message.error(res.data.message);
                localStorage.clear();
                return false;
            }
            successCallBack(res.data);


            // console.log("resdata",res.data);
        }).catch(error => {
            errorMsg(error);
            console.log("errorMsg ", error);
            if (fail) {
                Message.error("请求错误，请检查网络！")
            }
        })
    },
    get: function(url = '', params, headers, successCallBack, fail) {
        this.getFailSet(url, params, headers, successCallBack, false)

    },


    postFailSet: function(url = '', data = {}, headers, successCallBack, file, fileArray, fileArray2, progress, fail = false) {
        // 设置请求参数
        headers = setArg(headers, successCallBack);

        console.log('作业附件1' + fileArray2);
        // 返回请求数据
        if (file === 'file' || !!file) {

            let param = new FormData();
            //console.log(fileArray)
            if (!!fileArray) {

                for (var i = 0; i < fileArray.length; i++) {
                    param.append('files', fileArray[i]);
                }
            }

            if (!!fileArray2) {

                for (var i = 0; i < fileArray2.length; i++) {
                    param.append('attachmentFiles', fileArray2[i]);
                }
            }

            for (var j in data) {
                if(j !="errCallBack"){
                    param.append(j, data[j]);
                }
            }
            //console.log("file",param.get('file'),param.get('name'),param.get('description'));

            axios({
                url,
                baseURL: '',
                method: 'post',
                data: param,
                headers: headers,
                timeout: API.intServiceReqTimeout,
                maxContentLength: 2000,
                onUploadProgress: function(progressEvent) {
                    if (progressEvent.lengthComputable) {
                        progress && progress(progressEvent);
                    }
                },
            }).then(res => {
                if (res.data.status == 900) {
                    router.push({
                        path: "/login"
                    })
                    Message.error(res.data.message);
                    localStorage.clear();
                    return false;
                }
                successCallBack(res.data);
            }).catch(error => {
                errorMsg(error);
                console.log("errorMsg ", error);
                if (fail) {
                    Message.error("请求错误，请检查网络！")
                }
                typeof data.errCallBack == "function" ? data.errCallBack(error) : "";
            })
        } else {
            let errCallBack = null;
            if(typeof data.errCallBack == 'function'){
                errCallBack = data.errCallBack;
                delete data.errCallBack;
            }
            axios({
                url,
                baseURL: '',
                method: 'post',
                data: qs.stringify(data),
                headers: headers,
                timeout: API.intServiceReqTimeout,
                maxContentLength: 2000,
                onUploadProgress: function(progressEvent) {
                    if (progressEvent.lengthComputable) {
                        progress && progress(progressEvent);
                    }
                },
            }).then(res => {
                if (res.data.status == 900) {
                    router.push({
                        path: "/login"
                    })
                    Message.error(res.data.message);
                    localStorage.clear();
                    return false;
                }
                successCallBack(res.data);
            }).catch(error => {
                errorMsg(error);
                console.log("errorMsg ", error);
                if (fail) {
                    Message.error("请求错误，请检查网络！")
                };
                if(error.response.status == 423 && typeof errCallBack == 'function'){
                    errCallBack(error.response);
                }
            })
        }


    },
    post: function(url = '', data = {}, headers, successCallBack, file, fileArray, fileArray2, progress) {
        this.postFailSet(url, data, headers, successCallBack, file, fileArray, fileArray2, progress, false);
    },

    jsonPost: function(url = "", data = {}, successCallBack) {
        axios({
            method: 'post',
            url: url,
            data: data,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Accept': 'application/json;charset=UTF-8',
                'Authorization': getToken()
            }
        }).then((res) => {
            if (res.data.status == 900) {
                router.push({
                    path: "/login"
                })
                Message.error(res.data.message);
                localStorage.clear();
                return false;
            }
            successCallBack(res.data);
        }).catch(error => {
            errorMsg(error);
            console.log("errorMsg ", error);
           
        })
    }


}