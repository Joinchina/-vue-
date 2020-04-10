// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import store from './store'
import App from './App'
import router from './router'
import axios from 'axios'
import globalParam from './global/global_param'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import storge from '@/global/storage'
import Throttle from "./base/throttle/throttle"
import vipFuncPrompt from "./base/vipFuncPrompt/index"
import httpRequest from '@/model/orgAccount/index'
// 设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$axios = axios;

/**发抖与节流抽象控件 */
Vue.component("Throttle",Throttle)
/**vip功能同意弹框 */
Vue.component("vipFuncPrompt",vipFuncPrompt)

Vue.prototype.$globalParam = globalParam
router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requireLogin)){  
      if (storge.get('exp_token_json')) {  
        next();
      } else {
        next({
          path: '/login'
        })
      }
    }else {
      next();
    }
    let data = {}
    let orgId = !!to.query.orgId ? to.query.orgId : localStorage.orgId ? JSON.parse(localStorage.orgId).identification : '';
    let clazzId = !!to.query.clazzId ? to.query.clazzId : '';
    if(Boolean(orgId)){
      data.orgId = orgId;
    }else if(Boolean(clazzId)){
      data.clazzId = clazzId;
    }
    if(!!data.orgId || !!data.clazzId){
      httpRequest.getAccountInfo(data,(res)=>{
        if(res.status==200){
            if(JSON.parse(localStorage.exp_role).data == "ADMIN"){
              res.data.vip = true;
            }
            store.state.orgVipInfo = res.data;
        }else{
            // this.$message.error(res.message);
            if(JSON.parse(localStorage.exp_role).data == "ADMIN"){
              store.state.orgVipInfo = {vip: true}
            }
        }
      })
    }
    

  })
/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
})