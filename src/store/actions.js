
//给action注册一个事件处理函数，当这个函数被触发时，讲状态提交到mutations中处理

const action = {

	  //切换机构
	  swichtab({commit}, msg) {
        commit('saveMsg', msg)    // 提交到mutations中处理    
      },

      //编辑项目机构
      editPro({commit},msg){
      	commit('editProject',msg)
      },

      //删除项目机构
      deletePro({commit},msg){
      	commit('deleteProject',msg);
      },

      //机构详情改变当前logo
      changeLogo({commit},msg){
            commit('changeLogoOrg',msg)
      }

}
export default action;