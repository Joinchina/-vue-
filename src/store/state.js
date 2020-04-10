//存储状态
const state = {

    /**
	*存储当前机构信息
	*orgObj{
		"identification":"10",
		"userFirst":"30318",
		"userIds":["30318"],
		"role":"PROFESSOR"
	 }
  */
    orgObj: {},

    /**
	存储当前的项目id
	admin项目列表、班级项目列表编辑删除
  */
    curProIdEdit: "",

    curProIdDel: "",

    /**
	存储当前机构logo
 */
    curOrgLogo: "",

    /**
    存储当前班级名称
    */
    curClazzName: "",
    curClazzId: "",

    /**
     * 存储当前栏目名和展示再什么端
     */
    Contenttitle: "",
    Whileend: "",
    /** 
     * 存储班级所在的机构id
     */
    clazzOrgid: "",
    /**
     * 存储答题器数据
     */
     answerdata:{},
    /**
     * 存储直播间角色信息 
     * */ 
    liveAuthInfo:{},

    /*
        存储助教被下线的提示
    */
    assisCloseLine: "",

    /**
    *删除申请连线id集合
    **/
    deletApplyList:{},
    /**
     * 存储设备检测结果
     */
    detection: {},

    /**
     * 
     * 机构vip信息
     */
    orgVipInfo : {},

    /**
     * 统一付费功能弹框控制
     */
    vipFuncPopFalg : false,
}
export default state;