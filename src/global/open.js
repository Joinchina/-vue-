// 显示提示框
export const showMsg = (_this, close, msg, type) => {
    _this.$message({
        showClose: close,
        message: msg,
        type: type
    })
}

export function delTip(_this, str, callback, obj, errorcb) {
    _this.$confirm(str, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        if (obj) {

            callback(obj);
        } else {
            callback();
        }

    }).catch(() => {
        // _this.$message({
        // 	type: 'info',
        // 	message: '已取消删除',
        // 	duration: 1000,
        // onClose() {
        //         if (errorcb) {
        //             errorcb();
        //         }
        //     }
        // });
        console.log("点击了取消")
    });
}

export function delTipSign(_this, str, callback, obj, errorcb) {
    _this.$confirm(str, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        if (obj) {

            callback(obj);
        } else {
            callback();
        }

    }).catch(() => {
        console.log("已取消删除");

    });
}

export function delTipCustom(_this, str, callback, obj, errorcb) {
    _this.$msgbox({
        title: '提示',
        message: str,
        showCancelButton: true,
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
            if (action === 'confirm') {

                if (obj) {

                    callback(obj);
                    done();

                } else {
                    callback();
                    done();
                }

            } else {
                done();
            }
        }
    }).then(action => {
        //  this.$message({
        //   type: 'info',
        //   message: 'action: ' + action
        // });
    });
}


//拆分search
export function splitSearchMethod() {
    var obj = {};
    var paperIdSearch = location.search;
    var paperIdSearchQud = paperIdSearch.substring(paperIdSearch.indexOf("?") + 1);
    var paperIdArry = paperIdSearchQud.split("&");
    for (var i = 0; i < paperIdArry.length; i++) {
        paperIdArry[i] = paperIdArry[i].split("=");
        obj[paperIdArry[i][0]] = paperIdArry[i][1];
    }
    return obj;
}

//  date格式转化为字符串
export const dateFormatStr = (date) => {
    let d = new Date(date);
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}

export const dateFormatStr2 = (date) => {
    let d = new Date(date);
    let mm = (d.getMonth() + 1).toString().length == 1 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
    let dd = d.getDate().toString().length == 1 ? '0' + d.getDate() : d.getDate();

    return d.getFullYear() + '-' + mm + '-' + dd;
}

export const strFormatDate = (str) => {
    return new Date(str);
}

export const dateFormatTime = (date) => {
    let d = new Date(date);
    return d.getHours() + ':' + d.getMinutes();
}

export const dateFormatTime2 = (date) => {
        let d = new Date(date);
        let h = d.getHours().toString().length == 1 ? '0' + d.getHours() : d.getHours();
        let m = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes();
        return h + ':' + m;
    }
    // 大屏幕-google浏览器可显示
export const isChromeCheck = (browserFlag) => {
    var isChrome = navigator.userAgent.toLowerCase().match(/chrome/) != null; //判断是否是谷歌浏览器
    if (isChrome) {
        browserFlag = false;
    } else {
        browserFlag = true;
    }
    return browserFlag;
}

// 判断当前的环境---本地、开发和测试
export function env(){
    if(process.evn.NODE_ENV === "development"){
        return "development";
    }else if(window.location.host.includes("10.98.24.67")){
        return "test"
    }else{
        return "production";
    }
}

/**
  *params对象{
     name:"jia",
     age:30
   }
  *转为拼接图
   ?name=jia&age=30
**/
export function pars(param, key, encode) {
    if (param == null) return '';
    var arr = [];
    var t = typeof (param);
    if (t == 'string' || t == 'number' || t == 'boolean') {
        arr.push(key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param));
    } else {
        for (var i in param) {
            var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
            arr.push(pars(param[i], k, encode));
        }
    }
    return arr.join("&");
};