/*
	请求相关的配置卸载此文件中
*/
import {getToken} from '@/filters/userVerify'
import { host } from "@/global/util";

const requestType = {
	get : 1,
	post : 2,
	postJson : 3,
	postFile : 4 // shang
}

const normalHeaders = {
        'Content-Type': 'application/x-www-form-urlencoded',
		'Accept': 'application/json;charset=UTF-8',
		'Authorization': getToken()
	};

const jsonHeader = {
        'Content-Type': 'application/json;charset=UTF-8',
		'Accept': 'application/json;charset=UTF-8',
		'Authorization': getToken()
	};

const normarTimeout = 3000000;

const uploadTimeout = 400000000;

const networkErrorMsg = "网络异常，请重试！(错误码:x{0})";
const businessNormalErrorMsg = "网络请求异常，请联系师训宝工作人员处理!";


export default {
	requestType,
	normalHeaders,
	uploadTimeout,
	jsonHeader,
	normarTimeout,
	host,
	networkErrorMsg,
	businessNormalErrorMsg
}