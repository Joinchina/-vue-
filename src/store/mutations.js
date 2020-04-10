//
const mutations = {

	saveMsg(state, msg) {
        state.orgObj = msg;
        // console.log("切换角色已拿到");

        // console.log(state.orgObj);
    },

    editProject(state,msg){
    	state.curProIdEdit = msg;
    },

    deleteProject(state,msg){
    	state.curProIdDel = msg;
    },

    changeLogoOrg(state,msg){
        state.curOrgLogo = msg;
    },

    curClazzId(state,msg){

        state.curClazzId = msg;

    },
    assisCloseLine(state,msg){

        state.assisCloseLine = msg;

    },

    deletApplyList(state,msg){
        state.deletApplyList = msg;
    }
}
export default mutations;