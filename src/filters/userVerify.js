import storage from '@/global/storage'
import { Base64 } from 'js-base64'
import router from '@/router'

// 存储动态变动的authorization
export function setToken(userId) {
  	let day30 = 60*60*24*30;
  	let token_obj = storage.get("exp_token_json");
  	    token_obj = JSON.parse(token_obj);
    let token;
    // console.log('tokentokentoken',token_obj);
    // let userId = storage.get("userId");
    // 默认获取第一个userid
    if(!!userId) {
      token = token_obj[userId];

    } else {
      // 第一次登录无userId
      for (let i in token_obj) {
        token = token_obj[i];
      }
    }
    let host = window.location.host;
    if(host.indexOf("10.98.24.67") > -1||host.indexOf("10.98.25.5") > -1){
         storage.set("authorization_test", token, day30);
    }else if(host.indexOf("mgr.shixunbao.cn") > -1){
         storage.set("authorization", token, day30);
    }else if(host.indexOf("mgr.shixunbao.cn:8081") > -1){
         storage.set("authorization_prev", token, day30);
    }else{
         storage.set("authorization_local", token, day30);
    }
    return token;
}
// 获取动态变动的authorization
window.addEventListener('storage', getToken, false);

export function getToken() {
  var authorization = null;
  if(storage.get('exp_authorization_test')){
    authorization = storage.get('exp_authorization_test');
  }else if(storage.get('exp_authorization')){
    authorization = storage.get('exp_authorization');
  }else if(storage.get('exp_authorization_prev')){
    authorization = storage.get('exp_authorization_prev');
  }else{
    authorization = storage.get('exp_authorization_local');
  }
  // 确保其他位置使用token时不用判断
  if(!((typeof authorization == 'string') && authorization.constructor == String && authorization != 'undefined' && authorization.length > 0)){
    authorization = null;
  }
  return authorization;
}

//获取所有userids集合

export function setIds(exp_token_json) {
       var num = 0;
       var ids = "";
       var curArray = arrayObj(exp_token_json);
       if(exp_token_json !== undefined && curArray.length !== 0){
       var obj = curArray[0];
       //admin或者非admin为一个账号
       if(curArray.length == 1){
         for(var i in obj){
           ids = i;
         }
       }else{
       //一个账号对应多个账号
         for(var j in exp_token_json){
           if(num == curArray.length - 1){
             ids += "userIds=" + j;
           }else if(num == 0){
             ids += j + "&";
           }else{
             ids += "userIds=" + j + "&";
           }
           num++;
         }
       }
     }
    return ids;
}

//解析登录后所有的登录权限集合
export function decodeToken(){
   let deCodeArray = {};
   let token_json = JSON.parse(storage.get("exp_token_json"));
   for(var i in token_json){
      let item = token_json[i].split(".")[1];
      let itemDecode = JSON.parse(Base64.decode(item));
      deCodeArray[itemDecode["userName"]] = itemDecode;
   }
  return deCodeArray;

}



//获取其中任意一个token
export function setOneToken(exp_token_json) {
      var token = "";
     // console.log("dengluhotoken" + JSON.stringify(exp_token_json))
      var curArray = arrayObj(exp_token_json);
      var curArrayFirst = curArray[0];
    //  console.log("moren" + JSON.stringify(curArray));
      for(var i in curArrayFirst){
        token = curArrayFirst[i];
      }
      return token;
}
function arrayObj(exp_token_json) {
  var array = [];
  for(var i in exp_token_json){
    var obj = {};
    obj[i] = exp_token_json[i];
    array.push(obj);
  }
  return array;
}


// 整合数组变get参数
export function turnQueryStr() {
  // 只有一个参数 userIds 数组
  // 偶数传参错误
  let str,userIds;
  if (arguments.length%2 == 0) {
    return false;
  }
  if(arguments.length == 1 && arguments[0].constructor == Array) {
    userIds = arguments[0];
    userIds = userIds.join("&userIds=");
    str = "userIds="+userIds;
  }

  if(arguments[0].constructor == Array && typeof arguments[1] == "string") {
    userIds = arguments[0].join("&userIds=");
    str = arguments[1]+"="+arguments[2]+"&userIds="+userIds;

  }
  // console.log("str",arguments[1]);
  return str;
}
//存储权限
export function limits(userIds){
  if(!!userIds){
    var role = "", userId="";
    var userIdFirst = userIds[0];
    var token_json = JSON.parse(storage.get("exp_token_json"));
    var token_name = token_json[userIdFirst].split(".")[1];
    var decode_token = JSON.parse(Base64.decode(token_name));
    // console.log("decode_token",decode_token);
    role = decode_token["role"];
    userId = decode_token["sub"];
    // console.log("统一存储role=" + role);
    var day30 = 60*60*24*30;
    //存储角色,userId
    storage.set("role", role, day30);
    storage.set("userId", userId, day30);
     // 切换token
    setToken(userIdFirst);

    return role;
  }

}
//获取当前角色
export function  getCurRole() {
  var role = storage.get("exp_role");
  return role;
}

// 获取当前的用户id
export function getCurUserId() {
  var userId = storage.get("exp_userId");
  return userId;
}


//退出
export function exitSys(){
    storage.remove('orgId');
    storage.remove('exp_name')
    storage.remove('exp_role')
    storage.remove('exp_token_json')
    storage.remove('exp_authorization')
    router.push('/login');
    storage.remove("orgVipInfo")
}

//退出
export function getQuery(name){
  let paramVal = null;
  if(window.location.href.indexOf("=")>-1){
    let paramArr = window.location.href.split('?')[1].split("&");
    paramArr.forEach(element => {
      let singalArr = element.split("=")
      if(singalArr[0] == name){
        paramVal = singalArr[1];
      }
    });
  }
  return paramVal;
}