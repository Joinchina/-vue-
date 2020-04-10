/**
时间戳转化为日期

let time:1469281964000;
formatDate(time) {
    var date = new Date(time);
    return formatDate(date, "yyyy-MM-dd hh:mm:ss");
}
*/

export function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}


/**       
 * 对Date的扩展，将 Date 转化为指定格式的String       
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符       
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)       
 * eg:       
 * pattern(new Date(), "yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423       
 * pattern(new Date(), "yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04       
 * pattern(new Date(), "yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04       
 * pattern(new Date(), "yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04       
 * pattern(new Date(), "yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18       
 */ 

 export function pattern(date, fmt) {
     let o = {
        "M+" : date.getMonth()+1, //月份           
        "d+" : date.getDate(), //日           
        "h+" : date.getHours()%12 == 0 ? 12 : date.getHours()%12, //小时           
        "H+" : date.getHours(), //小时           
        "m+" : date.getMinutes(), //分           
        "s+" : date.getSeconds(), //秒           
        "q+" : Math.floor((date.getMonth()+3)/3), //季度           
        "S" : date.getMilliseconds() //毫秒        };
    };

    let week = {           
        "0" : "日",           
        "1" : "一",           
        "2" : "二",           
        "3" : "三",           
        "4" : "四",           
        "5" : "五",           
        "6" : "六"          
    };  
    if(/(y+)/.test(fmt)){           
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));           
    }           
    if(/(E+)/.test(fmt)){           
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "星期" : "周") : "")+week[date.getDay()+""]);           
    }           
    for(var k in o){           
        if(new RegExp("("+ k +")").test(fmt)){           
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));           
        }           
    }           
    return fmt;  
}

















