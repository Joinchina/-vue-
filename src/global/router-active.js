//基于element组件实现的tab切换
/**
 * 
 * @param {*} pathName 需要是一个由path为键名，path对应的activeName为键值组成的Object;
 * @param {*} superThis  传入
 */
function elementTabState(pathName,superThis,activeName){  //pathName
    let currentPath = window.location.href;
    let keyArr = [];
    for (let key in pathName){
        // keyArr.push(key);
        let urlReg = new RegExp(key);
        if(urlReg.test(currentPath)){
            superThis[activeName]=pathName[key];
        }
    }
}
function windowBingPop(param1,param2,param3){
    let pathName = param1;
    let superThis = param2;
    let activeName = param3;
    window.addEventListener("popstate", function(){
        elementTabState(pathName,superThis,activeName);
    },false);
}

export default {windowBingPop};