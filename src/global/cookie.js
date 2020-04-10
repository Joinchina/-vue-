// set cookie
export function setCookie(name, value, Days) {
	if(Days == null || Days == '') {
		Days = 300
	}
	var exp = new Date();
	exp.setTime(exp.getTime() + Days*24*60*60*1000);
	document.cookie = name + "="+ escape (value) + "; path=/;expires=" + exp.toGMTString();
}


// get cookie
export function getCookie(name) {
    var arr,reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

// get all cookie
export function getAllCookie(){
    return document.cookie;
}

// clear cookie
export function clearCookie(name){
    setCookie(name, '', -1);
}

// del cookie
export function delCookie(name){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+"; path=/;expires="+exp.toGMTString();
}

// Set the cookie time for session
export function setSessionCookie(name,value,cookiePath){
    var isIE=!-[1,];//判断是否是ie核心浏览器
    if(isIE){
        if(value){
            var expire = "; expires=At the end of the Session";
            var path="";
            if(cookiePath!=null){
                path="; path="+cookiePath;
            }
            document.cookie = name + "=" + escape(value) + expire+path;
        }
    }else{
        if(value){
            var expire = "; expires=Session";
            var path="";
            if(cookiePath!=null){
                path="; path="+cookiePath;
            }
            document.cookie = name + "=" + escape(value) + expire+path;
        }
    }
}
