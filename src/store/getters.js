//获取状态信息
const getters = {

    showOrgObj(state) {
        return state.orgObj;
    },

    showCurProIdEdit(state) {
        return state.curProIdEdit;
    },


    showCurProIdDel(state) {
        return state.curProIdDel;
    },

    showCurOrgLogo(state) {
        return state.curOrgLogo;
    },

    showCurClazzName(state) {
        return state.curClazzName;
    },

    showContenttitle(state) {
        return state.Contenttitle;
    },
    showwhileend(state) {
        return state.Whileend
    },

    showCurClazzId(state) {
        return state.curClazzId;
    },
    /**
     * 或者班级下的机构id
     */
    getClazzorgid(state) {
        return state.clazzOrgid
    },
    /**
     * 获取答题器数据
     */
    getanswer(state){
        return state.answerdata
    },
    /**
     * 存储直播间角色信息
     */
    getliveAuthInfo(state){
        return state.liveAuthInfo
    },
    /**
     * 存储助教已关闭连线状态
     */
    getAssistantStatus(state){
        return state.assisCloseLine
    },
    /**
     * 获取设备检测
     */
    getdetection(state){
        return state.detection
    },

    /**
     * 获取机构vip信息
     */
    getOrgVipInfo(state){
        return state.orgVipInfo
    },
    
    /**
     * 统一付费功能弹框控制
     */
    vipFuncPop(state){
        return  state.vipFuncPopFalg
    }
}
export default getters;