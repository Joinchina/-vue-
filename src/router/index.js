import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'

Vue.use(Router)
    // admin数据展示页面

const Statistical = () =>
    import ('../components/admindata/admin_data')
const overData = () =>
    import ('../components/admindata/overtrain')
const beforeData = () =>
    import ('../components/admindata/beforetrain')
const centerTrain = () =>
    import ('../components/admindata/centertrain')
const afterTrain = () =>
    import ('../components/admindata/aftertrain')
const datailData = () =>
    import ('../components/admindata/detaildata')
const beforedatailData = () =>
    import ('../components/admindata/beforedatadetails')
const centerdatailData = () =>
    import ('../components/admindata/centerdatadetails')
const afterdatailData = () =>
    import ('../components/admindata/afterdatadetails')
const otherdatailData = () =>
    import ('../components/admindata/othertrain')
    /** **************************************************  登录页 *************************************************************************/
    // const Login = resolve => require(['../components/login/login'], resolve)

const Login = () =>
    import ('../components/login/login')

const projectEditPassword = () =>
    import ('../components/project/password')

const Home = () =>
    import ('../components/home/home')

/** **************************************************  admin -- 机构列表 *************************************************************************/
const OrgAdminList = () =>
    import ('../components/organization/list')
const requestDemo = () =>
    import ('../components/requestpage/demo')
    // 机构列表
const OrganizationList = () =>
    import ('../components/organization/org_list')

// admin-全部项目列表
const adminProList = () =>
    import ('../components/project/project_list_admin')

// admin-通用资源
const adminRes = () =>
    import ('../components/resource/admin_list')

// admin-通用资源-文件夹内部
const adminDepth = () =>
    import ('../components/resource/admin_depth_list')

// 机构成员
const OrgMembers = () =>
    import ('../components/user/org/org_list')

// 用户入口文件
const UserList = () =>
    import ('../components/user/user_list')

// 机构管理
const OrgManage = () =>
    import ('../components/organization/org_manage')

// 机构详情
const OrgDetail = () =>
    import ('../components/organization/detail')

// app启动屏
const App = () =>
    import ('../components/organization/app')

// 证书设置
const SetCertificate = () =>
    import ('../components/certificate/set')

// 编辑证书
const UpdateCertificate = () =>
    import ('../components/certificate/update')
    /** **************************************************  项目 *************************************************************************/
    // 项目管理菜单
    // const ProjectMenu = resolve => require(['../components/project/project_menu'], resolve)
    // 项目首页
const ProjectObjnav = () =>
    import ('../components/project/objnav')
    // 项目首页路由
const classDetail = () =>
    import ('../components/project/classdetail')
const objectFull = () =>
    import ('../components/project/objectfull')
const classFull = () =>
    import ('../components/project/classfull')
    // 项目列表
const ProjectList = () =>
    import ('../components/project/list')

// 项目列表--具体项目列表
const ProjectListList = () =>
    import ('../components/project/project_list')

/** **************************************************  班级 *************************************************************************/
// 班级列表
const ClassList = () =>
    import ('../components/clazz/list')

// 班级列表 --click 具体班级菜单
const clazzMenuP = () =>
    import ('../components/clazz/clazz_menu_p')

// 投票列表
const ClazzVoteList = () =>
    import ('../components/clazz/index/vote')

// 问卷列表
const ClazzQuestionaireList = () =>
    import ('../components/clazz/index/questionaire')


//课程管理
//课程管理 -- 菜单
const CourseAdmin = () =>
    import ('../components/course/admin_menu')
    //课程管理 -- 全部课程
const CourseAll = () =>
    import ('../components/course/all')
    // 课程管理 -- 搜索课程
const CourseSearch = () =>
    import ('../components/course/search')
    //课程管理 -- 我的课程-专家登录
const CourseExperts = () =>
    import ('../components/course/experts')
    //课程管理 -- 项目任务
const CourseTask = () =>
    import ('../components/course/task')
    //课程管理 -- 课程详情
const CourseDtail = () =>
    import ('../components/course/detail')


// 成员管理
const MembersMenu = () =>
    import ('../components/members/member_menu')

// 班主任
const ClazzManagerList = () =>
    import ('../components/members/headmaster')

// 专家
const ProfessorList = () =>
    import ('../components/members/pfessor')

// 学员
const StudentList = () =>
    import ('../components/members/student')

/** ************************************************************************** 班级活动 *************************************************************************/
// 作业大屏幕

const Homeworkview = () =>
    import ('../components/activity/homework/homeworkview')
const Homeworkdetail = () =>
    import ('../components/activity/homework/homeworkdetail')
    // 课程管理 -- 投票结果页
const CourseVoteRes = () =>
    import ('../components/activity/vote/result')

// 课程管理 -- 评价 -- 饼图统计数据
const PieStatistics = () =>
    import ('../components/evaluation/static_pie')

// 课程管理 -- 投票题目预览页面
const CourseVoteView = () =>
    import ('../components/activity/vote/view')

// 课程管理 -- 投票提交人数页面
const CourseVoteMan = () =>
    import ('../components/activity/vote/man')

// 课程管理 -- 投票提交人数页面
const CoursePaperFUll = () =>
    import ('../components/activity/vote/fullScreen')

// 课程管理 -- 查看反思详情页
const CourseIntroDetail = () =>
    import ('../components/activity/introspection/detail')

// 课程管理 -- 照片墙详情页面
const CoursePhotoView = () =>
    import ('../components/activity/photo/view')

// 课程管理 -- 照片墙大屏幕页面
const CoursePhotoFull = () =>
    import ('../components/activity/photo/fullScreen')

// 课程管理 -- 作业提交人数页面
const CourseWorkMan = () =>
    import ('../components/activity/homework/man_sum')

// 课程管理 -- 作业 -- 结果
const CourseHomeResult = () =>
    import ('../components/activity/homework/result')

// 课程管理 -- 作业 -- 详情
const CourseHomeDetail = () =>
    import ('../components/activity/homework/detail')

// 课程管理 -- 问答查看 -- 不要删掉
const ActivityAnswer = () =>
    import ('../components/activity/answer/result')

// 课程管理 -- 留言板
const CourseMessage = () =>
    import ('../components/activity/message/list')

// 课程管理 -- 讨论组结果
const CourseDiscussResult = () =>
    import ('../components/activity/discuss/result')

// 创建问卷
const QuestionCreate = () =>
    import ('../components/activity/questionare/create')

// 编辑问卷
const QuestionEdit = () =>
    import ('../components/activity/questionare/edit')

/** **************************************************  班级管理 *************************************************************************/
// 班级首页
const ClazzIndex = () =>
    import ('../components/clazz/index')

// 菜单
const ClazzMenu = () =>
    import ('../components/clazz/clazz_menu')

// 通知列表
const ClazzNoticeList = () =>
    import ('../components/clazz/notice/list')


// 通知详情
const ClazzNoticeDet = () =>
    import ('../components/clazz/notice/detail')

// 签到
const ClazzSignin = () =>
    import ('../components/clazz/signin/res')

// 大屏幕
const ClazzSigninScreen = () =>
    import ('../components/clazz/signin/screen')

// 已签到、未签到
const ClazzSigninDetail = () =>
    import ('../components/clazz/signin/detail')

// 积分
const ClazzIntegral = () =>
    import ('../components/clazz/integral/list')

// 帖子列表
const ClazzPostRes = () =>
    import ('../components/clazz/post/list')

// 帖子列表
const ClazzPostDet = () =>
    import ('../components/clazz/post/details')

// 分组管理
const ClazzGroupList = () =>
    import ('../components/clazz/group/list')

// 分组 - 查看详情
const ClazzGroupDetail = () =>
    import ('../components/clazz/group/detail')

// 分组 - 查看聊天详情
const ClazzGroupResult = () =>
    import ('../components/clazz/group/result')

// 分组 - 未分组学员
const ClazzUnGroupMembers = () =>
    import ('../components/clazz/group/ungroup')
    // 分组-小组排行

const ClazzGroupRank = () =>
    import ('../components/clazz/group/rank')

// 课程安排
const ClazzCourseRes = () =>
    import ('../components/clazz/course/result')

// 课程安排创建
const ClazzCourseAdd = () =>
    import ('../components/clazz/course/add')

// 视频回顾查看人数
const ClazzReviewPeoples = () =>
    import ('../components/clazz/course/viewPeoples.vue')

// 互动点名
const ClazzInteract = () =>
    import ('../components/clazz/interact/res')

// 互动点名大屏幕
const ClazzInteractFull = () =>
    import ('../components/clazz/interact/full')

// 班级详情
const ClazzDetail = () =>
    import ('../components/clazz/clazz_details')

// 班级设置
const ClazzSet = () =>
    import ('../components/clazz/clazz_set')

// 生活服务
const ClazzLifeService = () =>
    import ('../components/clazz/life_service')

// 颁发证书
const ClazzCertificate = () =>
    import ('../components/clazz/certificate/list')

// 班级学情
const ClazzLearnCase = () =>
    import ('../components/clazz/learncase/list')

// 步骤列表
const ClazzSteps = () =>
    import ('../components/clazz/signUp/steps')

// 报名信息
const signupInfo = () =>
    import ('../components/clazz/signUp/info')


/** ***********************************班级首页****************************************/
// 课程满意度
const ClazzCourseSatList = () =>
    import ('../components/clazz/index/course_satisfied')

// 照片墙列表
const ClazzPhotoList = () =>
    import ('../components/clazz/index/photo_list')

// 评价列表
const ClazzEvalList = () =>
    import ('../components/clazz/index/eval_list')

// 反思列表
const ClazzIntrospectList = () =>
    import ('../components/clazz/index/introspect_list')

// 作业列表
const ClazzHomeworkList = () =>
    import ('../components/clazz/index/homework_list')

// 作业列表
const ClazzAllWorkList = () =>
    import ('../components/clazz/index/allWork')


// 讨论组列表
const ClazzDiscussList = () =>
    import ('../components/clazz/index/discuss_list')

/** **************************************************  资源管理 *************************************************************************/
const ResourceClazz = () =>
    import ('../components/resource/list')

const ResourceFolderList = () =>
    import ('../components/resource/depth_list')

const ResourceViewUser = () =>
    import ('../components/resource/user')

const ResourceNet = () =>
    import ('../components/resource/net/online')

const ResourceNetUser = () =>
    import ('../components/resource/net/user')

/** **************************************************  资源管理 -- 网络课程 *************************************************************************/
const ResourceNetRequire = () =>
    import ('../components/resource/net/require')

/** **************************************************  草稿箱 *************************************************************************/
const Draft = () =>
    import ('../components/activity/questionare/draft')

/** **************************************************  模板库管理 *************************************************************************/
// 模板管理菜单
const EvalTemplateMenu = () =>
    import ('../components/evaltemp/admin')
const EvalResult = () =>
    import ('../components/evaltemp/result')

/** **************************************************  admin-通用管理 *************************************************************************/

// 首页
const GeneralManage = () =>
    import ('../components/comtopic/index')
const Helpcenter = () =>
    import ('../components/comtopic/helpcenter/index')
const Publishcenter = () =>
    import ('../components/comtopic/publish/index')
const Publishedit = () =>
    import ('../components/comtopic/publish/edit')
const Publishword = () =>
    import ('../components/comtopic/publish/word')
const Publishvideo = () =>
    import ('../components/comtopic/publish/video')
    // 题目列表
const GeneralSubject = () =>
    import ('../components/comtopic/subject')

// 申请试用
const ApplyTrial = () =>
    import ('../components/comtopic/apply/trial')

// 列表页面
const GeneralList = () =>
    import ('../components/comtopic/list')

// 系统维护通知
const SystemMaintain = () =>
    import ('../components/comtopic/system/maintain')

// 积分列表页面
const IntegralList = () =>
    import ('../components/comtopic/integral/list')

// 版本管理
const VersionList = () =>
    import ('../components/comtopic/version/list')

// 微信接受数据
const wechatList = () =>
    import ('../components/comtopic/wechat/list')
// 商务联系表
const buschat = () =>
    import ('../components/comtopic/business/business')

 // 专家库
 const orgexpert = () =>
    import ('../components/expert/org/expert')
 // 课程领域管理
 const management = () =>
    import ('../components/expert/org/management')

// 申请专家联系表
const expertlist = () =>
import ('../components/expert/org/expertlist')
// vip申请列表
const vipApplylist = () =>
import ('../components/comtopic/vipapply/list')

/** *****************************************        admin-用户管理        ********************************************************/
// 菜单
const UserMenu = () =>
    import ('../components/user/user_menu')

// 机构-机构管理员
const OrgAdminAllList = () =>
    import ('../components/user/org/org_list')

// 机构-项目管理员
const ProjectAdminAllList = () =>
    import ('../components/user/org/pro_list')

// 机构-班主任
const ClazzManagerAllList = () =>
    import ('../components/user/org/class_list')

// 机构-专家
const ProfessorAllList = () =>
    import ('../components/user/org/professor_list')

// 机构-学员
const StudentAllList = () =>
    import ('../components/user/org/stu_list')

// admin-机构管理员
const AdminUserOrgList = () =>
    import ('../components/user/admin/org_list')

// admin-项目管理员
const AdminUserProList = () =>
    import ('../components/user/admin/pro_list')

// admin-机构管理员
const AdminUserClassList = () =>
    import ('../components/user/admin/class_list')

// admin-机构管理员
const AdminUserProfessorList = () =>
    import ('../components/user/admin/professor_list')

// admin-机构管理员
const AdminUserStuList = () =>
    import ('../components/user/admin/stu_list')

/** ************************************    班级-总结报告    *************************************/
const ReportMenu = () =>
    import ('../components/report/menu')
    // 课程报告
const ReportCourse = () =>
    import ('../components/report/course/creport')
const ReportAllCourse = () =>
    import ('../components/report/course/allcourse')

// 考勤报告
const ReportAttendance = () =>
    import ('../components/report/attendance/areport')

// 专家报告
const ReportExpert = () =>
    import ('../components/report/expert/ereport')

// 培训报告
const ReportTraining = () =>
    import ('../components/report/training/treport')

// 学员报告
const ReportStudent = () =>
    import ('../components/report/stu/sreport')

// 培训效果报告
const ReportTrainEffective = () =>
    import ('../components/report/traineff/freport')

// 项目总结模板
const ReportProjectSummary = () =>
    import ('../components/report/pro/summary')

// 日志管理模块
const RecordList = () =>
    import ('../components/clazz/dailyrecord/list')

const RecordEdit = () =>
    import ('../components/clazz/dailyrecord/edit')

const RecordDetail = () =>
    import ('../components/clazz/dailyrecord/detail')

const RecordCommit = () =>
    import ('../components/clazz/dailyrecord/commit')

/** ********************************    问卷模板    *************************************/
// admin 问卷模板库
const QuestempListAdmin = () =>
    import ('../components/questemp/listadmin')
    // 机构 班级 问卷模板库
const QuestempListOrg = () =>
    import ('../components/questemp/listorg')
const RepositoryFile = () =>
    import ('../components/questemp/reposilist')
const RepositoryDepthlist = () =>
    import ('../components/questemp/depth_list')
    // 预览
const QuestempView = () =>
    import ('../components/questemp/view')
    // 选择模板
const QuestempSeltemp = () =>
    import ('../components/questemp/seltemp')
    // 选择模板内容
const QuestempSeltempCont = () =>
    import ('../components/questemp/seltempcont')

// admin、机构管理员、班级 问卷 - 创建
const QuestempCreate = () =>
    import ('../components/questemp/create')

// admin、机构管理员、班级 问卷 -- 编辑
const QuestempEdit = () =>
    import ('../components/questemp/edit')

/** ****************************************  模板及资源库   ****************************************/
// 模板及资源库 菜单页
const RepositoryMenu = () =>
    import ('../components/repository/index')

/** ********************************    机构-总结报告    *************************************/
const OrgReportMenu = () =>
    import ('../components/orgreport/menu')

// 课程满意度
const OrgReportCourseSat = () =>
    import ('../components/orgreport/coursesatisfaction')
    // 课程评分
const OrgReportCourseScore = () =>
    import ('../components/orgreport/coursescore')

// 专家授课情况
const OrgReportExpert = () =>
    import ('../components/orgreport/expertstate')

// 项目满意度
const OrgReportItemSat = () =>
    import ('../components/orgreport/itemsatisfaction')

// 项目评分
const OrgReportItemScore = () =>
    import ('../components/orgreport/itemscore')

// 项目统计
const OrgReportItemStat = () =>
    import ('../components/orgreport/itemstat')

// 学生留言
const OrgReportLeaveMsg = () =>
    import ('../components/orgreport/leavemsg')

// 任务完成情况
const OrgReportTask = () =>
    import ('../components/orgreport/taskstate')

// 网络课程预览
const PreviewCourse = () =>
    import ('../components/resource/previewCourse')

/******************************************************直播页******************************************************************************/
const liveShow = () =>
    import ('../components/agora/myLiveShow')

const LiveLogin = () =>
    import ('../components/agora/login')

const liveShow2 = () =>
    import ('../components/agora/myLiveShow2')

const live = () =>
    import ('@/components/live/liveShow');
const livedown = () =>
    import ('@/components/live/plug_in');

/******************************************************直播页******************************************************************************/
/********************************** 直播相关活动 ************************************/
// 直播课讨论区历史信息
const LiveDiscuss = () =>
    import ('../components/activity/live/discuss')
    // 直播课当前讨论区大屏幕
const LiveChatScreen = () =>
    import ('../components/activity/live/chatscreen')
    // 课堂表现
const coursePerformance = () =>
    import ('../components/course/performance')
//专家库
const expertindex=()=>
    import('@/components/expert/expert')
const expertdetail=()=>
   import('@/components/expert/expertdetail')
/*****************************************************学员互评作业**************************************************/
// 学员互评作业列表
const mutualWorkList = () =>
    import ('../components/clazz/index/mutualWorkList');
const mutualActivity = ()=>
    import ('../components/clazz/mutualDetail');
const studentMutualDetail = ()=>
    import ('../components/clazz/studentMutualDetail');
const mutualPeoples = ()=>
    import ('../components/clazz/mutualPeoples');

/******************************************** 机构账户中心 ************************************************************/
const orgAccount = ()=>
    import ('../components/orgAccount/index');
// 功能剩余跳转页
const orgDealFunc = ()=>
    import ('../components/orgAccount/dealFunc');

export default new Router({
    linkActiveClass: 'active',
    // mode: 'history',
    routes: [
        // {
        //   path: '/',
        //   // redirect: '/home'
        //   component: Home
        // },
        // 登录

        {
            path: '/login',
            component: Login
        },

        // 大屏幕
        {
            path: '/clazz/signin/screen',
            component: ClazzSigninScreen,
            meta:{
                requireLogin:true 
            }
        },

        //直播页面
        {
            path: "/agora/liveShow",
            component: liveShow,
            meta:{
                requireLogin:true 
            }
        },
        //直播下载页面
        {
            path:"/live/plug_in",
            component:livedown
        },
        //专家库页面
        {
            path:"/expert/index",
            component:expertindex
        },
        //专家库详情页面
        {
            path:"/expert/detail",
            component:expertdetail
        },
        {
            path: '/',
            component: Home,
            children: [
                /** *****************************************        机构列表  -- admin       ********************************************************/

                {
                    path: '/',
                    redirect: '/project/prolist'
                },

                // 课程 - 创建问卷
                { path: '/activity/questionare/create', component: QuestionCreate },

                // 课程 - 编辑问卷
                { path: '/activity/questionare/edit', component: QuestionEdit },

                // 模板库 - 创建问卷
                { path: '/questemp/create', component: QuestempCreate },

                // 模板库 - 编辑问卷
                { path: '/questemp/edit', component: QuestempEdit },

                // 问卷模板库 - 预览
                { path: '/questemp/view', component: QuestempView },
                // 问卷模板库 - 选择模板

                {
                    path: '/questemp/seltemp',
                    component: QuestempSeltemp,
                    children: [
                        { path: '/', redirect: '/questemp/seltemp/cont' },
                        { path: '/questemp/seltemp/cont', component: QuestempSeltempCont }
                    ]
                },

                {
                    path: '/org/list',
                    component: OrgAdminList,

                    children: [
                        { path: "/", redirect: "/organization/list" },
                        { path: "/organization/list", component: OrganizationList },
                        { path: "/requestDemo/request", component: requestDemo },
                        { path: "/adminpro/list", component: adminProList },
                        {
                            path: "/admin/user",
                            component: UserList,
                            children: [
                                { path: '/', redirect: '/adminuser/org_list' },
                                { path: '/adminuser/org_list', component: AdminUserOrgList },
                                { path: '/adminuser/pro_list', component: AdminUserProList },
                                { path: '/adminuser/class_list', component: AdminUserClassList },
                                { path: '/adminuser/professor_list', component: AdminUserProfessorList },
                                { path: '/adminuser/stu_list', component: AdminUserStuList }
                            ]
                        },
                        { path: "/adminres/resource", component: adminRes },
                        { path: "/adminres/resdepth", component: adminDepth },

                        //通用管理
                        { path: "/adminger/manage", component: GeneralManage },
                        {
                            path: "/comtopic/list",
                            component: GeneralList,
                            children: [
                                { path: "/", redirect: "/comtopic/courseeval/" },
                                { path: "/comtopic/courseeval/", component: GeneralSubject }
                            ]
                        },
                        // 申请试用
                        { path: "/comtopic/apply/trial", component: ApplyTrial },
                        // 系统维护通知
                        { path: "/comtopic/system/maintain", component: SystemMaintain },
                        // 版本发布
                        { path: "/comtopic/version/list", component: VersionList },
                        // 积分管理

                        { path: "/comtopic/integral/list", component: IntegralList },
                        // 帮助中心
                        { path: "/comtopic/helpcenter/index", component: Helpcenter },

                        // 微信接受数据
                        { path: "/comtopic/wechat/list", component: wechatList },
                         // 商务联系表
                        { path: "/comtopic/business/business", component: buschat },
                         // 专家库
                         { path: "/expert/org/expert", component: orgexpert },
                          // 课程领域管理
                        { path: "/expert/org/management", component: management },
                         // 申请专家联系表
                         { path: "/expert/org/expertlist", component: expertlist },
                         // vip申请列表
                         { path: "/comtopic/vipapply/list", component: vipApplylist },
                        {
                            path: "/comtopic/publish/index",
                            component: Publishcenter,
                            children: [
                                { path: "/", redirect: "/comtopic/publish/word" },
                                { path: "/comtopic/publish/edit", component: Publishedit },
                                { path: "/comtopic/publish/word", component: Publishword },
                                { path: "/comtopic/publish/video", component: Publishvideo },
                            ]
                        },

                        { path: "/comtopic/integral/list", component: IntegralList },
                        // admin 问卷模板库
                        { path: "/comtopic/questemp/list", component: QuestempListAdmin },


                        // 数据统计
                        {
                            path: "/admindata/admin_data",
                            component: Statistical,
                            children: [
                                { path: "/", redirect: "/admindata/admin_data/overdata" },
                                { path: "/admindata/admin_data/overdata", component: overData },
                                { path: "/admindata/admin_data/beforedata", component: beforeData },
                                { path: "/admindata/admin_data/centerdata", component: centerTrain },
                                { path: "/admindata/admin_data/afterdata", component: afterTrain },
                                { path: "/admindata/admin_data/overdatadetails", component: datailData },
                                { path: "/admindata/admin_data/beforedatadetails", component: beforedatailData },
                                { path: "/admindata/admin_data/centerdatadetails", component: centerdatailData },
                                { path: "/admindata/admin_data/afterdatadetails", component: afterdatailData },
                                { path: "/admindata/admin_data/otherdata", component: otherdatailData },
                            ]
                        },

                    ]
                },
                /*******************************************        机构列表 -- admin -- click -- 项目列表         ********************************************************/
                {
                    path: "/project/prolist?orgId=:orgId&userId=:userId",
                    component: ProjectList
                },
                /*******************************************        admin - 机构 -- 机构成员        ********************************************************/
                {
                    path:"/project/password",
                    component:projectEditPassword
                },
                {
                    path: '/project/prolist',
                    component: ProjectList,
                    children: [
                        //{ path: "/", redirect: "/project/objnav" },
                        { path: '/project/objnav', component: ProjectObjnav },
                        { path: '/project/classdetail', component: classDetail },
                        { path: '/project/objectfull', component: objectFull },
                        { path: '/project/classfull', component: classFull },
                        { path: "/project/prolist", component: ProjectListList },
                        {
                            path: "/org/user",
                            component: UserList,
                            children: [
                                // { path:"/",redirect:"/orguser/org_list" },
                                { path: '/orguser/org_list', component: OrgAdminAllList },
                                { path: '/orguser/pro_list', component: ProjectAdminAllList },
                                { path: '/orguser/class_list', component: ClazzManagerAllList },
                                { path: '/orguser/professor_list', component: ProfessorAllList },
                                { path: '/orguser/stu_list', component: StudentAllList }
                            ]
                        },
                        { path: "/org/manage", component: OrgManage },
                        { path: "/org/detail", component: OrgDetail },
                        { path: "/app", component: App },
                        // 机构证书认证
                        { path: "/org/certificate", component: SetCertificate },
                        { path: "/org/certificate/update", component: UpdateCertificate },
                        // 模板及资源库
                        { path: "/org/repository/menu", component: RepositoryMenu },
                        { path: "/org/repository/queslist", component: QuestempListOrg },
                        // 机构总结报告
                        { path: "/orgreport/menu", component: OrgReportMenu },
                        // 课程满意度
                        { path: "/orgreport/coursesat", component: OrgReportCourseSat },
                        // 课程评分
                        { path: "/orgreport/coursescore", component: OrgReportCourseScore },
                        // 专家授课情况
                        { path: "/orgreport/expertstate", component: OrgReportExpert },
                        // 项目满意度
                        { path: "/orgreport/itemsat", component: OrgReportItemSat },
                        // 项目评分
                        { path: "/orgreport/itemscore", component: OrgReportItemScore },
                        // 项目统计
                        { path: "/orgreport/itemstat", component: OrgReportItemStat },
                        // 学员留言
                        { path: "/orgreport/leavemsg", component: OrgReportLeaveMsg },
                        // 任务完成情况
                        { path: "/orgreport/taskstate", component: OrgReportTask },

                        { path: "/org/repository/reposilist", component: RepositoryFile },
                        { path: "/org/repository/depth_list", component: RepositoryDepthlist }

                    ]
                },
                /*******************************************        班级        ********************************************************/
                //班级菜单
                {
                    path: "/course/all?clazzId=:clazzId",
                    component: clazzMenuP,
                    children: [
                        // 班级首页
                        {
                            path: "/clazz/index",
                            component: ClazzIndex,
                        },
                        {
                            path: "/clazz/index/vote",
                            component: ClazzVoteList
                        },
                        {
                            path: "/clazz/index/questionaire",
                            component: ClazzQuestionaireList
                        },
                        {
                            path: "/clazz/index/coursesatisfied", // 课程满意度
                            component: ClazzCourseSatList
                        },
                        {
                            path: "/clazz/index/photolist", // 照片墙列表
                            component: ClazzPhotoList
                        },
                        {
                            path: "/clazz/index/evalist", // 评价列表
                            component: ClazzEvalList
                        },
                        {
                            path: "/clazz/index/introspectlist", // 反思列表
                            component: ClazzIntrospectList
                        },
                        {
                            path: "/clazz/index/homeworklist", // 作业列表 
                            component: ClazzHomeworkList
                        },
                        {
                            path: "/clazz/index/mutuallist", // 学员互评作业列表 
                            component: mutualWorkList
                        },
                        {
                            path: "/clazz/index/discusslist", // 讨论组列表
                            component: ClazzDiscussList
                        },
                        // 课程管理
                        {
                            path: "/course/all",
                            component: CourseAll,

                        },
                        // 全部课程搜索
                        { path: "/course/search", component: CourseSearch },
                        { path: "/course/experts", component: CourseExperts },
                        { path: "/course/detail", component: CourseDtail },
                        { path: "/course/task", component: CourseTask },
                        { path: "/course/performance", component: coursePerformance },

                        { path: "/activity/vote/result", component: CourseVoteRes },

                        { path: "/activity/questionare/result", component: CourseVoteRes },
                        { path: "/activity/evaluation/result", component: CourseVoteRes },
                        { path: "/activity/introspection/result", component: CourseVoteRes },

                        { path: "/evaluation/static_pie", component: PieStatistics },

                        { path: "/activity/introspection/detail", component: CourseIntroDetail },

                        { path: "/activity/vote/view/", component: CourseVoteView },
                        { path: "/activity/vote/man/", component: CourseVoteMan },

                        { path: "/activity/photo/view", component: CoursePhotoView },

                        { path: "/activity/homework/detail", component: CourseHomeDetail },
                        { path: "/activity/homework/result", component: CourseHomeResult },
                        { path: "/activity/homework/mansum", component: CourseWorkMan },

                        { path: "/activity/discuss/result", component: CourseDiscussResult },



                        { path: "/activity/message/list", component: CourseMessage },

                        { path: "/activity/answer/result", component: ActivityAnswer },

                        // 直播讨论历史
                        { path: "/activity/live/discuss", component: LiveDiscuss },


                        //成员管理
                        //课程管理,目前使用courseAdmin
                        {
                            path: "/members/",
                            component: MembersMenu,
                            children: [
                                { path: "master", component: ClazzManagerList },
                                { path: "pfessor", component: ProfessorList },
                                { path: "student", component: StudentList }
                            ]
                        },

                        // 班级管理
                        { path: '/clazz/menu', component: ClazzMenu }, // 通知
                        { path: '/clazz/notice/list', component: ClazzNoticeList }, // 通知列表
                        { path: '/clazz/notice/detail', component: ClazzNoticeDet }, // 通知详情
                        { path: '/clazz/signin/res', component: ClazzSignin }, // 签到
                        { path: '/clazz/signin/detail', component: ClazzSigninDetail }, // 已签到、未签到
                        { path: '/clazz/integral/list', component: ClazzIntegral }, // 积分
                        { path: '/clazz/post/list', component: ClazzPostRes }, // 帖子列表
                        { path: '/clazz/post/details', component: ClazzPostDet }, // 帖子详情
                        { path: '/clazz/group/list', component: ClazzGroupList }, // 分组
                        { path: '/clazz/group/detail', component: ClazzGroupDetail }, // 分组 -- 查看详情
                        { path: '/clazz/group/result', component: ClazzGroupResult }, // 分组 -- 查看详情
                        { path: '/clazz/group/unmenbers', component: ClazzUnGroupMembers }, //分组 -- 未分组学员
                        { path: '/clazz/group/rank', component: ClazzGroupRank }, //分组 -- 小组排行
                        { path: '/clazz/course/result', component: ClazzCourseRes }, // 课程安排
                        { path: '/clazz/course/add', component: ClazzCourseAdd }, // 发布课程安排
                        { path: '/clazz/course/reviewList', component: ClazzReviewPeoples }, // 视频回顾人数列表
                        { path: '/clazz/interact/res', component: ClazzInteract }, // 互动点名
                        { path: '/clazz/detail', component: ClazzDetail }, //班级详情
                        { path: '/clazz/set', component: ClazzSet }, //班级设置
                        { path: '/clazz/lifesev', component: ClazzLifeService }, //生活服务
                        { path: '/clazz/certificate/list', component: ClazzCertificate }, //颁发证书
                        { path: '/clazz/learncase/list', component: ClazzLearnCase }, // 班级学情
                        // 学员报名
                        { 
                            path: '/clazz/signUP/steps/',
                            component: ClazzSteps
                        }, 
                        //班级管理--日志管理
                        { path: '/clazz/dailyrecord/list', component: RecordList },
                        { path: '/clazz/dailyrecord/edit', component: RecordEdit },
                        { path: '/clazz/dailyrecord/detail', component: RecordDetail },
                        { path: '/clazz/dailyrecord/commit', component: RecordCommit },

                        //资源管理
                        { path: "/resource/list", component: ResourceClazz },
                        { path: "/resource/depth_list", component: ResourceFolderList },
                        { path: "/resource/user", component: ResourceViewUser }, // 资源查看人

                        //资源管理 - 网络课程
                        { path: '/resource/net/online', component: ResourceNet },
                        { path: '/resource/net/user', component: ResourceNetUser },
                        { path: "/resource/net/require", component: ResourceNetRequire },

                        // 课件资源库班级内
                        {
                            path: '/resource/questemp/reposilist',
                            component: RepositoryFile
                        },
                        // 课件资源库班级内文件夹
                        {
                            path: '/resource/questemp/depth_list',
                            component: RepositoryDepthlist
                        },
                        //草稿箱
                        { path: "/questionare/draft", component: Draft },

                        //模板管理
                        {
                            path: "/evaltemp/admin",
                            component: EvalTemplateMenu,
                        },
                        {
                            path: '/evaltemp/result',
                            component: EvalResult
                        },
                        // 问卷模板库班级内
                        {
                            path: '/evaltemp/questemp/list',
                            component: QuestempListOrg
                        },
                        // 总结报告
                        {
                            path: "/report/menu",
                            component: ReportMenu
                        },
                        {
                            path: "/report/stu/sreport",
                            component: ReportStudent
                        },
                        {
                            path: "/report/pro/summary",
                            component: ReportProjectSummary
                        },
                        {
                            path: "/report/traineff/freport",
                            component: ReportTrainEffective
                        },
                        {
                            path: "/report/course/allcreport",
                            component: ReportAllCourse,
                            children: [
                                { path: "/", redirect: "/report/course/creport" },
                                { path: "/report/course/creport", component: ReportCourse }
                            ]
                        },
                        {
                            path: "/report/attendance/areport",
                            component: ReportAttendance
                        },
                        {
                            path: "/report/expert/ereport",
                            component: ReportExpert
                        },
                        {
                            path: "/report/training/treport",
                            component: ReportTraining
                        },

                        /**学员互评作业详情 */
                        { path: "/clazz/mutualDetail", component: mutualActivity },
                        /**学员互评作业详情 */
                        { path: "/clazz/studentMutualDetail", component: studentMutualDetail },
                        /**学员互评作业提交列表 */
                        { path: "/clazz/mutualPeoples", component: mutualPeoples },
                    ]
                },
                //帮助中心
                // {
                //     path: "/help/index",
                //     component: Help,
                // },
                /** *****************************************        机构列表 -- admin -- click -- 项目列表         ********************************************************/
                {
                    path: '/project/prolist?orgId=:orgId&userId=:userId',
                    component: ProjectList
                },
                /** *****************************************        admin - 机构 -- 机构成员        ********************************************************/
                {
                    path: '/project/prolist',
                    component: ProjectList,
                    children: [
                        // { path: "/", redirect: "/project/objnav" },
                        { path: '/project/objnav', component: ProjectObjnav },
                        { path: '/project/classdetail', component: classDetail },
                        { path: '/project/objectfull', component: objectFull },
                        { path: '/project/classfull', component: classFull },
                        { path: '/project/prolist', component: ProjectListList },
                        {
                            path: '/org/user',
                            component: UserList,
                            children: [
                                // { path:"/",redirect:"/orguser/org_list" },
                                { path: '/orguser/org_list', component: OrgAdminAllList },
                                { path: '/orguser/pro_list', component: ProjectAdminAllList },
                                { path: '/orguser/class_list', component: ClazzManagerAllList },
                                { path: '/orguser/professor_list', component: ProfessorAllList },
                                { path: '/orguser/stu_list', component: StudentAllList }
                            ]
                        },
                        { path: '/org/manage', component: OrgManage },
                        { path: '/org/detail', component: OrgDetail },
                        { path: '/app', component: App },
                        // 机构证书认证
                        { path: '/org/certificate', component: SetCertificate },
                        { path: '/org/certificate/update', component: UpdateCertificate },
                        // 模板及资源库
                        { path: '/org/repository/menu', component: RepositoryMenu },
                        { path: '/org/repository/queslist', component: QuestempListOrg },
                        // 机构总结报告
                        { path: '/orgreport/menu', component: OrgReportMenu },
                        // 课程满意度
                        { path: '/orgreport/coursesat', component: OrgReportCourseSat },
                        // 课程评分
                        { path: '/orgreport/coursescore', component: OrgReportCourseScore },
                        // 专家授课情况
                        { path: '/orgreport/expertstate', component: OrgReportExpert },
                        // 项目满意度
                        { path: '/orgreport/itemsat', component: OrgReportItemSat },
                        // 项目评分
                        { path: '/orgreport/itemscore', component: OrgReportItemScore },
                        // 项目统计
                        { path: '/orgreport/itemstat', component: OrgReportItemStat },
                        // 学员留言
                        { path: '/orgreport/leavemsg', component: OrgReportLeaveMsg },
                        // 任务完成情况
                        { path: '/orgreport/taskstate', component: OrgReportTask },

                        { path: '/org/repository/reposilist', component: RepositoryFile },
                        { path: '/org/repository/depth_list', component: RepositoryDepthlist }

                    ]
                },
                /** *****************************************        班级        ********************************************************/
                // 班级菜单
                {
                    path: '/course/all?clazzId=:clazzId',
                    component: clazzMenuP,
                    children: [
                        // 班级首页
                        {
                            path: '/clazz/index',
                            component: ClazzIndex
                        },
                        {
                            path: '/clazz/index/vote',
                            component: ClazzVoteList
                        },
                        {
                            path: '/clazz/index/questionaire',
                            component: ClazzQuestionaireList
                        },
                        {
                            path: '/clazz/index/coursesatisfied', // 课程满意度
                            component: ClazzCourseSatList
                        },
                        {
                            path: '/clazz/index/photolist', // 照片墙列表
                            component: ClazzPhotoList
                        },
                        {
                            path: '/clazz/index/evalist', // 评价列表
                            component: ClazzEvalList
                        },
                        {
                            path: '/clazz/index/introspectlist', // 反思列表
                            component: ClazzIntrospectList
                        },
                        {
                            path: '/clazz/index/homeworklist', // 作业列表
                            component: ClazzHomeworkList
                        },
                        {
                            path: '/clazz/index/allWork', // 作业概况列表
                            component: ClazzAllWorkList
                        },
                        {
                            path: '/clazz/index/discusslist', // 讨论组列表
                            component: ClazzDiscussList
                        },
                        // 课程管理
                        {
                            path: '/course/all',
                            component: CourseAll

                        },
                        { path: '/course/experts', component: CourseExperts },
                        { path: '/course/detail', component: CourseDtail },
                        { path: '/course/task', component: CourseTask },

                        { path: '/activity/vote/result', component: CourseVoteRes },

                        { path: '/activity/questionare/result', component: CourseVoteRes },
                        { path: '/activity/evaluation/result', component: CourseVoteRes },
                        { path: '/activity/introspection/result', component: CourseVoteRes },

                        { path: '/evaluation/static_pie', component: PieStatistics },

                        { path: '/activity/introspection/detail', component: CourseIntroDetail },

                        { path: '/activity/vote/view/', component: CourseVoteView },
                        { path: '/activity/vote/man/', component: CourseVoteMan },

                        { path: '/activity/photo/view', component: CoursePhotoView },

                        { path: '/activity/homework/detail', component: CourseHomeDetail },
                        { path: '/activity/homework/result', component: CourseHomeResult },
                        { path: '/activity/homework/mansum', component: CourseWorkMan },

                        { path: '/activity/discuss/result', component: CourseDiscussResult },

                        { path: '/activity/message/list', component: CourseMessage },

                        { path: '/activity/answer/result', component: ActivityAnswer },

                        // 成员管理
                        // 课程管理,目前使用courseAdmin
                        {
                            path: '/members/',
                            component: MembersMenu,
                            children: [
                                { path: 'master', component: ClazzManagerList },
                                { path: 'pfessor', component: ProfessorList },
                                { path: 'student', component: StudentList }
                            ]
                        },

                        // 班级管理
                        { path: '/clazz/menu', component: ClazzMenu }, // 通知
                        { path: '/clazz/notice/list', component: ClazzNoticeList }, // 通知列表
                        { path: '/clazz/notice/detail', component: ClazzNoticeDet }, // 通知详情
                        { path: '/clazz/signin/res', component: ClazzSignin }, // 签到
                        { path: '/clazz/signin/detail', component: ClazzSigninDetail }, // 已签到、未签到
                        { path: '/clazz/integral/list', component: ClazzIntegral }, // 积分
                        { path: '/clazz/post/list', component: ClazzPostRes }, // 帖子列表
                        { path: '/clazz/post/details', component: ClazzPostDet }, // 帖子详情
                        { path: '/clazz/group/list', component: ClazzGroupList }, // 分组
                        { path: '/clazz/group/detail', component: ClazzGroupDetail }, // 分组 -- 查看详情
                        { path: '/clazz/group/result', component: ClazzGroupResult }, // 分组 -- 查看详情
                        { path: '/clazz/group/unmenbers', component: ClazzUnGroupMembers }, // 分组 -- 未分组学员
                        { path: '/clazz/group/rank', component: ClazzGroupRank }, // 分组 -- 小组排行
                        { path: '/clazz/course/result', component: ClazzCourseRes }, // 课程安排
                        { path: '/clazz/course/add', component: ClazzCourseAdd }, // 发布课程安排
                        { path: '/clazz/interact/res', component: ClazzInteract }, // 互动点名
                        { path: '/clazz/detail', component: ClazzDetail }, // 班级详情
                        { path: '/clazz/set', component: ClazzSet }, // 班级设置
                        { path: '/clazz/lifesev', component: ClazzLifeService }, // 生活服务
                        { path: '/clazz/certificate/list', component: ClazzCertificate }, // 颁发证书
                        { path: '/clazz/learncase/list', component: ClazzLearnCase }, // 班级学情

                        // 班级管理--日志管理
                        { path: '/clazz/dailyrecord/list', component: RecordList },
                        { path: '/clazz/dailyrecord/edit', component: RecordEdit },
                        { path: '/clazz/dailyrecord/detail', component: RecordDetail },
                        { path: '/clazz/dailyrecord/commit', component: RecordCommit },

                        // 资源管理
                        { path: '/resource/list', component: ResourceClazz },
                        { path: '/resource/depth_list', component: ResourceFolderList },
                        { path: '/resource/user', component: ResourceViewUser }, // 资源查看人

                        // 资源管理 - 网络课程
                        { path: '/resource/net/online', component: ResourceNet },
                        { path: '/resource/net/user', component: ResourceNetUser },
                        { path: '/resource/net/require', component: ResourceNetRequire },

                        // 课件资源库班级内
                        {
                            path: '/resource/questemp/reposilist',
                            component: RepositoryFile
                        },
                        // 课件资源库班级内文件夹
                        {
                            path: '/resource/questemp/depth_list',
                            component: RepositoryDepthlist
                        },
                        // 草稿箱
                        { path: '/questionare/draft', component: Draft },

                        // 模板管理
                        {
                            path: '/evaltemp/admin',
                            component: EvalTemplateMenu
                        },
                        {
                            path: '/evaltemp/result',
                            component: EvalResult
                        },
                        // 问卷模板库班级内
                        {
                            path: '/evaltemp/questemp/list',
                            component: QuestempListOrg
                        },
                        // 总结报告
                        {
                            path: '/report/menu',
                            component: ReportMenu
                        },
                        {
                            path: '/report/stu/sreport',
                            component: ReportStudent
                        },
                        {
                            path: '/report/pro/summary',
                            component: ReportProjectSummary
                        },
                        {
                            path: '/report/traineff/freport',
                            component: ReportTrainEffective
                        },
                        {
                            path: '/report/course/allcreport',
                            component: ReportAllCourse,
                            children: [
                                { path: '/', redirect: '/report/course/creport' },
                                { path: '/report/course/creport', component: ReportCourse }
                            ]
                        },
                        {
                            path: '/report/attendance/areport',
                            component: ReportAttendance
                        },
                        {
                            path: '/report/expert/ereport',
                            component: ReportExpert
                        },
                        {
                            path: '/report/training/treport',
                            component: ReportTraining
                        }

                    ]
                }
                // 帮助中心
                // {
                //     path: "/help/index",
                //     component: Help,
                // },
            ]
        },
        // 大屏幕
        { path: '/activity/vote/fullScreen/', component: CoursePaperFUll ,meta:{
            requireLogin:true 
        }},
        { path: '/activity/photo/fullScreen/', component: CoursePhotoFull ,meta:{
            requireLogin:true 
        }},
        { path: '/clazz/interact/full/', component: ClazzInteractFull,meta:{
            requireLogin:true 
        } }, // 互动点名大屏幕
        { path: '/resourse/previewCourse', component: PreviewCourse ,meta:{
            requireLogin:true 
        }}, // 网络课程预览


        /*********声网直播相关*************/
        {
            path: '/agora/login',
            component: LiveLogin,
        },

        {
            path: '/agora/liveShow',
            component: liveShow,
        },

        {
            path: '/agora/liveShow2',
            component: liveShow2,
        },

        {
            path: "/live/show",
            component: live,
            meta: {
                title: "视频直播"
            }
        },
        /*********声网直播相关*************/
        { path: '/activity/homework/homeworkview/', component: Homeworkview ,meta:{
            requireLogin:true 
        }}, // 作业大屏幕
        { path: '/activity/homework/homeworkdetail', component: Homeworkdetail ,meta:{
            requireLogin:true 
        }}, // 作业详情大屏幕
        { path: '/activity/live/chatscreen/', component: LiveChatScreen ,meta:{
            requireLogin:true 
        }}, // 直播聊天大屏幕

        /********************* 机构账户中心 *******************/
        { path: '/orgAccount/index', component: orgAccount ,meta:{
            requireLogin:true 
        }}, 
        { path: '/orgAccount/dealFunc', component: orgDealFunc ,meta:{
            requireLogin:true 
        }}, 
        


    ]

})