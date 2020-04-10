//提示框
toastr.options = {
	positionClass : "toast-top-center",
	timeOut : "1000"
}
//弹出对话框
function opendialog(id){
	$("#"+id).modal({
		backdrop : "static"
	});
}

function alertTip(content){
	bootbox.alert({
	    message: content,
	    backdrop: true,
	    size:"small",
	    buttons:{
	    	ok:{
	    		label:"确认"
	    	}
	    }
	});
}

function deleteConfirm(callback){
	bootbox.confirm({
		message:"确认删除？",
		buttons:{
			confirm:{
				label:"确认",
				className:"btn-success",
			},
			cancel:{
				label:"取消",
				className:"btn-danger"
			}
		},
	    callback: function (result) {
	    	if(result){
	    		if (typeof callback === "function"){
		            callback(); 
		        }
	    	}
	    },
	    size:"small",
	    backdrop: true
	});
}

function deleteConfirm(callback, confirmMsg){
	bootbox.confirm({
		message:confirmMsg?confirmMsg:"确认删除？",
		buttons:{
			confirm:{
				label:"确认",
				className:"btn-success",
			},
			cancel:{
				label:"取消",
				className:"btn-danger"
			}
		},
	    callback: function (result) {
	    	if(result){
	    		if (typeof callback === "function"){
		            callback(); 
		        }
	    	}
	    },
	    size:"small",
	    backdrop: true
	});
}

/**       
 * 对Date的扩展，将 Date 转化为指定格式的String       
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符       
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)       
 * eg:       
 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423       
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04       
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04       
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04       
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18       
 */          
Date.prototype.pattern=function(fmt) {           
    var o = {           
    "M+" : this.getMonth()+1, //月份           
    "d+" : this.getDate(), //日           
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时           
    "H+" : this.getHours(), //小时           
    "m+" : this.getMinutes(), //分           
    "s+" : this.getSeconds(), //秒           
    "q+" : Math.floor((this.getMonth()+3)/3), //季度           
    "S" : this.getMilliseconds() //毫秒           
    };           
    var week = {           
    "0" : "日",           
    "1" : "一",           
    "2" : "二",           
    "3" : "三",           
    "4" : "四",           
    "5" : "五",           
    "6" : "六"          
    };           
    if(/(y+)/.test(fmt)){           
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));           
    }           
    if(/(E+)/.test(fmt)){           
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "星期" : "周") : "")+week[this.getDay()+""]);           
    }           
    for(var k in o){           
        if(new RegExp("("+ k +")").test(fmt)){           
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));           
        }           
    }           
    return fmt;           
}  

function getQueryString (name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
function host(){
	var url = window.location.host;
	if(url.indexOf("http") > 0){
		url = url;
	}else{
		url ="http://"+url;
	}
	return url;
}