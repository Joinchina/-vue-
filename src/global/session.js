//  存储导航信息
export const setStore = (key, data) => {
    //存储之前先清除这样保持始终只有一个账户的信息
    window.sessionStorage.clear();
    let setdata = JSON.stringify(data)
    window.sessionStorage.setItem(key, setdata)
}

//获取导航信息
export const getStore = (keyname) => {
    let str = sessionStorage.getItem(keyname);
    str = JSON.parse(str)
    return str
}