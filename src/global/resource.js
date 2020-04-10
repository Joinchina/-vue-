import { host } from "@/global/util";
let api = "";
let apid = "";
let socketApi = "";
let aliyuncs = "https://opensxb.oss-cn-beijing.aliyuncs.com/resource/template";
if (process.env.NODE_ENV === "development") {
    apid = 'https://10.98.24.67:8000/face2face/';
    api = '/api';
    socketApi = "10.98.24.67";
} else if (host().indexOf("shixunbao.cn") > -1) {

    apid = "https://res.shixunbao.cn/";

    socketApi = window.location.host;
    if (socketApi.indexOf(":") > -1) {
        socketApi = socketApi.substring(0, socketApi.indexOf(":"));
    }
} else {

    apid = "https://10.98.24.67:8000/face2face/";
    socketApi = window.location.host;
    if (socketApi.indexOf(":") > -1) {
        socketApi = socketApi.substring(0, socketApi.indexOf(":"));
    }

}
let WEB_CONFIG = {
    intServiceReqTimeout: 300000,
    queryType: "GET",
    url: "", //a 标签需要带上域名时修改本参数，默认为空
    version: "1.0", //版本号
    client: "web", //设备
    accessflag: new Date().getTime(), //随机标签
    coreHost: "http://core", // 设置二级域名接口
    urls: {
        login: api + '/login',
        loginPhone: api + '/loginPhone',
        getSms: api + '/sms/',
        createPro: api + '/project/save', //创建项目
        getProInfor: api + '/project/id', // 项目详情
        getProList: api + '/project/list', // 项目列表
        getAdminProList: api + '/project/allProject', // admin下项目列表
        delPro: api + '/project/delete', // 删除项目
        editPro: api + '/project/update',
        createOrg: api + '/organization/save', // 创建机构
        createOrgVip: api + '/organization/saveNew', // 创建机构(收费版及之后版本使用)
        getOrgList: api + "/organization/list", //机构列表
        getDetail: api + "/organization/id", //机构详情
        getVipOrgDetail: api + "/organization/idNew", //通过机构ID查询机构(收费版及之后版本使用)
        orgUpdate: api + "/organization/update", // 编辑机构
        orgUpdateVip: api + "/organization/updateNew", // 编辑机构(收费版及之后版本使用)
        getOrgType: api + "/organization/getOrgtype", //获取机构类型
        getProvince: api + "/organization/getOrgCity", //获取省
        exportorg: api + "export/organization/data/statistics/export", //导出机构列表
        getBootDiagram: api + "/organization/getBootDiagram", //查看APP启动屏
        saveBootDiagram: api + "/organization/saveBootDiagram", //APP启动屏开关
        uploadApp: api + "/organization/uploadPicture", // 上传APP启动屏图片
        clazzRemoteStatus: api + '/clazz/updateRemoteStudyStatus', // 班级设置
        getClazzList: api + '/clazz/list',
        getClassInfor: api + '/clazz/id', // 获取班级信息
        createClass: api + '/clazz/save', //创建班级
        editClass: api + '/clazz/update', // 编辑班级
        delClass: api + '/clazz/delete', //删除班级
        getobjectclassfull: api + '/clazz/satisfied', //班级下的项目满意度
        getclassdetail: api + '/clazz/statisticsList', //班级明细
        getorgId: api + '/organization/statistics', //机构统计
        getclazzstatis: api + '/course/organization/courseStatistics', //机构课程满意度
        exportclazzstatis: api + 'export/course/organization/exportCourseStatistics', //导出机构课程满意度
        exportorgstatis: api + 'export/clazz/exportSatisfied', //导出机构下项目满意度
        exportClazzStatistics: api + 'export/clazz/exportClazzStatistics', //导出机构下班级统计
        getOrgAdminList: api + '/orgUser/orgAdminList', // 机构成员-机构管理员列表
        getProAdminList: api + '/orgUser/projectAdminList', // 机构成员-项目管理员列表
        getClaList: api + '/orgUser/clazzManagerList', // 机构成员-班主任列表
        getProfessorList: api + '/orgUser/professorList', //  机构成员-专家列表
        getStudentList: api + '/orgUser/studentList', // 机构成员-学员列表
        joinProject: api + '/orgUser/joinProject', // 项目管理员选项目
        joinClass: api + '/orgUser/joinClazz', // 班主任，专家选班级
        proSelect: api + '/project/select', // 项目管理员-选项目-项目列表
        classSelect: api + '/clazz/select', // 班主任，专家-选班-班级列表
        getUser: api + '/user/id', // 获取当前用户信息
        orgAddUser: api + '/orgUser/save', // 机构下 新增用户
        orgEditUser: api + '/user/update', //机构下 编辑用户
        updatePassword: api + '/user/updatePassword', // 密码重置
        deleteUser: api + '/user/delete', // 删除账号
        getClazzManagerList: api + '/clazzuser/clazzManagerList', // 班级 -- 班主任列表
        createSaveClazzManager: api + '/clazzuser/saveClazzManager', // 班级 -- 新增班主任
        createSaveProfessor: api + '/clazzuser/saveProfessor', //班级 -- 新增专家
        createSaveStudent: api + '/clazzuser/saveStudent', //班级 -- 新增学员
        removeProfessCLazz: api + '/clazzuser/removeUser', //班级-- 删除专家、班主任
        clazzManagerAllotList: api + '/clazzuser/clazzManagerAllotList', // 分配班主任--列表
        getClazzProfessorList: api + '/clazzuser/professorList', // 班级 -- 专家列表
        professorAllotList: api + '/clazzuser/professorAllotList', // 分配专家
        allotClazzManager: api + '/clazzuser/allotClazzManager', // 分配班主任 -- 保存
        allotProfessor: api + '/clazzuser/allotProfessor', // 分配专家 -- 保存
        getClazzStudentList: api + '/clazzuser/studentList', // 班级 -- 学生列表
        getUserStatistics: api + '/clazzuser/getUserStatistics', // 学员 -- 查看个人报告
        exportExcelStudent: api + 'export/clazzuser/exportExcelStudent', //学员 -- 导出学员
        exportsimple: api + 'export/clazzuser/exportSimpleExcelStudent', //学员 -- 导出学员简表
        exportExcelUserStatistic: api + 'export/clazzuser/exportExcelUserStatistics', //学员 -- 导出个人报告-excel
        exportZipUserStatistics: api + 'export/clazzuser/exportZipUserStatistics', //学员 -- 导出个人报告-zip
        exportWordUserStatistics: api + 'export/clazzuser/exportWordUserStatistics', //学员 -- 个人报告 -- 导出个人报告
        importStudents: api + '/clazzuser/importStudents', //学员 -- 导入学员

        studentDeleted: api + 'export/clazzuser/export/studentDeleted/excel', //导出删除学员excel
        studentDeletedReasonList: api + '/user/student/delete/reason/list', // 获取学员删除原因类型的所有值
        tmplateDowload: apid + '/resource/template/student.xls', //打开下载模板
        templateProfessor: apid + '/resource/template/professor.xlsx', //导入专家下载模板
        importProfessor: api + '/clazzuser/importProfessor', // 班级内导入专家
        exportProfessor: api + 'export/clazzuser/exportExcelProfessor', // 班级导出专家
        exportProfessorFail: api + 'export/clazzuser/exportProfessorAddFalseExcel', //导出专家导入失败反馈
        //签到
        signList: api + '/sign/list', //签到列表
        signSave: api + '/sign/save', //新建签到
        signFindId: api + '/sign/id', //签到详情，签到成功
        signCodeDownLoad: api + 'export/sign/signCodeDownLoad', //下载二维码
        exportSignExcel: api + 'export/sign/exportSignExcel', //导出EXCEL:导出报表
        exportSigndetail: api + 'export/sign/exportSigndetail', //导出EXCEL:签到明细信息
        exportUserList: api + 'export/sign/exportUserList', //导出EXCEL:学员名单
        signUserList: api + '/sign/signUserList', //已签到学员列表
        unSignUserList: api + '/sign/unSignUserList', //未签到学员列表
        addSignTag: api + '/sign/addSignTag', //添加请假迟到早退
        delSignTag: api + '/sign/delSignTag', //取消迟到早退
        signDelete: api + '/sign/delete', //删除签到
        agentSign: api + '/sign/agentSign', //代签
        largeScreen: api + '/sign/largeScreen', //签到大屏幕
        importSign: api + '/sign/importSign', //批量导入签到
        updateEndTime: api + '/sign/updateEndTime', //签到修改结束时间
        signInupdateTime: api + '/sign/updateTime', //4.2.7未开始的签到修改：签到日期、开始时间、结束时间
        exportSignAddFalseExcel: api + '/sign/exportSignAddFalseExcel', //后台导出签到失败excel
        signTempate: apid + '/resource/template/%E7%AD%BE%E5%88%B0%E6%A8%A1%E6%9D%BF.xlsx', //下载模板
        signQrcodeExport: api + 'export/sign/qrcode/picture/zip/export/', //zip打包批量导出班级下所有签到二维码照片
        signlargeScreen: api + '/sign/largeScreen/',
        //分组
        groupCustom: api + '/group/custom/create', //自定义分组
        groupDelete: api + '/group/delete', //解散小组
        groupExists: api + '/group/exists/check', //班级下是否已存在分组
        groupFindById: api + '/group/findById', //查看分组详情
        groupChatMessage: api + '/group/groupChatMessage', //查看分组聊天内容
        exportWordChatMessage: api + 'export/discuss/exportWordChatMessage', //小组内容导出
        groupLeaderAssign: api + '/group/leader/assign', //指定分组组长
        groupList: api + '/group/list', //班级小组列表
        groupRandomCreate: api + '/group/random/create', //随机分组
        groupUngrouped: api + '/group/ungrouped/users', // 未分组学员列表(分页)
        groupUngroupedNo: api + '/group/ungrouped/userList', // 未分组学员列表
        groupUpdate: api + '/group/update', //编辑分组详情
        groupUserAdd: api + '/group/user/add', //小组成员添加
        groupUserDelete: api + '/group/user/delete', //小组成员移出
        groupUserList: api + '/group/user/list', //小组成员列表
        groupUserMove: api + '/group/user/move', //小组成员调组
        groupexportGroupList: api + 'export/group/exportGroupList', //小组成员导出
        getRank: api + 'export/group/exportGroupRank', //小组排名导出
        getRanklist: api + '/group/groupRankList', //小组积分排名列表
        // 班级首页模块
        clazzSatisfaction: api + '/clazzhomepage/clazz/satisfaction',
        clazzLearnSatistics: api + '/clazzhomepage/student/learn/statistics',
        clazzNormalDistribution: api + '/clazzhomepage/clazzNormalDistribution',
        clazzResourceViewTopStatistics: api + '/clazzhomepage/clazzResourceViewTopStatistics',
        clazzAvgIntegralStartAndEndDate: api + '/clazzhomepage/clazzAvgIntegralStartAndEndDate',
        clazzAvgStatistics: api + '/clazzhomepage/clazzAvgStatistics',
        clazzStatistics: api + '/clazzhomepage/clazzStatistics', //班级统计-班级概况
        clazzSignStat: api + '/clazzhomepage/clazzSignStatistics', //班级签到
        clazzDailyStat: api + '/clazzhomepage/clazzDailyStatistics/v2', // 班级评估（班级综合评估、学员积分获得分布图）
        clazzWorkStat: api + '/clazzhomepage/clazzHomeWorkStatistics', //作业概况
        clazzReportdownload: api + 'export/clazzhomepage/data/word/download', //下载班级统计数据至word文档
        clazzCourseSatisfaction: api + '/clazzhomepage/course/satisfaction', // 课程满意度
        clazzCourseSatExp: api + 'export/clazzhomepage/course/satisfaction/export', //导出-班级下所有课程的满意度
        clazzLoginRemindTimes: api + '/clazzuser/get/remain/loginRemindTimes', //获取短信的提醒次数
        clazzLoginAPP: api + '/clazzuser/remind/user/logingAPP', //发送短信提醒未登录学员登录APP
        userOrgList: api + '/user/orgAdminList', // Admin外层-机构管理员列表
        userProList: api + '/user/projectAdminList', //Admin外层-项目管理员列表
        userClassList: api + '/user/clazzManagerList', //Admin外层-班主任列表
        userProfessorList: api + '/user/professorList', //Admin外层-专家列表
        userStuList: api + '/user/studentList', //Admin外层-学生列表
        systemDate: api + '/course/systemDate', //系统当前日期
        myCourseList: api + '/course/myCourseList', // 专家登录-我的课程
        getCourseList: api + '/course/courseList', //全部课程集合
        itemTaskList: api + '/course/itemTaskList', //项目任务列表
        introspectionList: api + '/activity/introspectionActivityListInClazz', //反思活动列表
        exportIntrospectionActivityListInClazz: api + 'export/activity/exportIntrospectionActivityListInClazz', //反思活动列表导出
        discussActivityListInClazz: api + '/activity/discussActivityListInClazz', //讨论组活动列表
        exportDiscussActivityListInClazz: api + 'export/activity/exportDiscussActivityListInClazz', //讨论组活动列表导出
        getorgmessage: api + '/activity/findMultiFirstQuestionAnswer', //机构项目反思留言
        questionnaireActivityListInClazz: api + '/activity/questionnaireActivityListInClazz', //问卷列表
        voteActivityListInClazz: api + '/activity/voteActivityListInClazz', //投票列表
        courseActRes: api + '/questionpaper/result', //项目任务或课程详情下：评价，反思，投票，问卷结果页
        questionnaireCreate: api + '/questionpaper/saveQuestionPaper', //创建问卷
        questionnaireEdit: api + '/questionpaper/questionsCount', //编辑问卷
        getEvaluationDetail: api + '/questionpaper/getEvaluationDetail',
        exportEvaluationPDF: api + '/export/questionpaper/exportEvaluationPDF',
        exportEvaluationWordTable: api + 'export/questionpaper/exportEvaluationWordTable',
        draftAct: api + '/questionpaper/listDraftQuestionnaire', //草稿箱
        draftActEditor: api + '/questionpaper/questionsCount', //编辑草稿箱
        draftDelete: api + "/questionpaper/delete", //删除草稿箱
        //问答接口预留 -- 不要删掉
        // answerCreate:api+"/question/saveQuestion",//创建问答
        // getQuestionDetail:api+"/question/getQuestionDetail",//问答详情
        courseMessagelist: api + "/messageboard/courseMessagelist", //课程留言列表
        courseActMessagelist: api + "/messageboard/messageList", //活动留言列表
        courseMessageDelete: api + "/messageboard/delete", //留言删除
        courseMessageExportExcel: api + "export/messageboard/exportExcel", //留言导出
        courseDetails: api + '/course/courseDetails', // 课程详情列表（活动列表）
        courseDelete: api + '/course/delete', // 删除课程
        courseFindOne: api + '/course/findOne', // 查看单个课程详情
        courseCreate: api + '/course/save', //创建课程
        courseSubjectList: api + '/course/subject/type/list', //获取课程主题类型的编码和名称
        courseUpdate: api + '/course/update', // 编辑课程
        courseProfessor: api + '/course/professor/select', //创建课程-选择主讲人
        courseTimeSet: api + '/questionpaper/updateTime', //课程 --项目任务 -- 时间设置
        courseGetActivityDetail: api + '/questionpaper/getActivityDetail', //课程 --项目任务 -- 时间设置 -- 编辑
        courseExportTemplate: apid + '/resource/template/course.xlsx', //导入课程下载模板
        courseImport: api + '/course/importCourse', // 班级内导入课程
        courseImportFail: api + 'export/course/exportCourseAddFalseExcel', // 课程导入失败反馈
        courseDelAct: api + '/course/deleteActivity', //删除课程下活动
        courseMainProfessor: api + '/course/getMainTeacherName', //获取当前课程下主讲人信息
        courseEvalIntroRes: api + '/questionpaper/courseEvaluationOrIntrospection', //全部课程下评价、反思结果页
        courseActPaperRes: api + '/questionpaper/result', //项目任务或课程详情下：评价，反思，投票，问卷结果页
        courseActPaperStat: api + '/questionpaper/questionPaperStatistics', //试卷的统计数据(评价，反思，投票，问卷)
        closeVote: api + '/questionpaper/close', // 结束投票
        exportResExcel: api + 'export/questionpaper/exportResultExcel', //导出EXCEL:评价,反思,投票,问卷
        exportResPDF: api + '/questionpaper/exportResultPDF', //导出PDF:评价,反思,投票,问卷
        clazzEvalList: api + '/activity/evaluationActivityListInClazz', //班级-评价活动列表
        exportEvalClazz: api + 'export/activity/exportEvaluationActivityListInClazz', //班级-导出评价活动列表
        stundentList: api + '/clazzuser/student/list', //讨论组 -  创建 - 选择学员
        courseDiscussSave: api + '/discuss/save', //讨论组 - 创建 - 发布
        courseDiscussDetails: api + '/discuss/details', //讨论组 - 创建 - 详情
        coursePageChat: api + '/discuss/page/chatMessage', //讨论组 - 创建 - 聊天内容
        courseListByClazz: api + '/course/courseListByClazzId', // 班级下课程列表
        quesCount: api + '/questionpaper/questionsCount', //题目总数
        quesSubUser: api + '/questionpaper/submitUser', // 提交人列表
        exportSubUserExcel: api + 'export/questionpaper/exportSubmitUserExcel', //导出提交人名单
        qrcodeDownLoad: api + 'export/questionpaper/qrcodeDownLoad', // 下载二维码
        introspectionDetail: api + '/questionpaper/getIntrospectionDetail', // 查看反思详情
        quesPaperDel: api + '/questionpaper/delete', // 问卷投票问卷草稿删除
        photoList: api + '/photowall/getPictureList', // 照片墙活动下照片列表
        photoExport: api + 'export/photowall/exportZip', // 导出照片墙压缩包
        photoWallDel: api + '/photowall/deletePhotoWall', // 删除照片墙活动
        photoPicDel: api + '/photowall/deletePicture', // 删除照片墙下照片
        photoCount: api + '/photowall/getPhotoWallCount', //获取照片墙活动照片数量
        photoOne: api + '/photowall/id', //获取照片墙活动详情
        photoCreate: api + '/photowall/publishPhotoWall', // 新建照片墙活动
        photoUpdate: api + '/photowall/updatePhotoWall', // 编辑照片墙活动
        clazzPhotoList: api + '/activity/photoWallActivityListInClazz', // 班级首页下-照片墙列表
        msgBoardExport: api + '/messageboard/exportExcel', // 导出留言板信息
        msgBoardCount: api + '/messageboard/getMessageBoardCount', //  留言板活动下留言统计
        discussEdit: api + '/discuss/edit', //讨论组-时间设置
        discussCount: api + '/discuss/statistics', //讨论组-统计数据
        discussSync: api + '/discuss/updateGroupUsers', //讨论组-同步群组成员
        workExportUser: api + 'export/homework/exportUserExcel', // 导出EXCEL：作业人员名单
        workExportAllStu: api + 'export/homework/exportWordHomeWork', //导出作业：所有学员生成一个word文档
        //workExportEachStu: api + '/homework/exportZipHomeWork',    //导出作业：每学员生成word文档的zip包
        workCommitUser: api + '/homework/getCommitUser', //作业已提交人员
        workUnCommitUser: api + '/homework/getUnCommitUser', //作业未提交人员
        getWorkApply: api + '/homework/V330/zip/download', //作业申请中
        workAttchdownLoadSingle: api + 'export/homework/downLoadSingle', //作业附件单个下载
        workAttchMentList: api + '/homework/attachmentList', //作业附件下载列表
        workDetail: api + '/homework/details', // 作业详情
        workscreen: api + '/homework/homeworkInfo', //作业大屏幕
        studentHomework: api + '/homework/studentHomework', // 学员提交作业详情
        markScore: api + '/homework/markScore', //作业-打分
        commentHomework: api + '/homework/comment', //学员作业的评论
        checkedPublishComment: api + '/homework/checkedPublishComment', //作业-是否可以发表评论
        publishComment: api + '/homework/publishComment', //学员作业的提交评论
        clazzHomeWorkList: api + '/activity/homeworkActivityListInClazz', //班级-作业活动列表
        clazzAllHomeWorkList: api + '/activity/allHomeworkTypeActivityListInClazz', //班级-作业概况列表
        exportWorkClazz: api + '/activity/exportHomeworkActivityListInClazz', //班级-作业活动列表
        exportAllWorkClazz: api + '/export/exportAllHomeworkTypeListInClazz', //班级-作业概况列表
        homeworkPage: api + '/homework/homeworkPage', //学员提交的作业
        workCreate: api + '/homework/save', // 新建作业
        workEdit: api + '/homework/edit', // 编辑作业
        worktimeEnd: api + '/homework/updateEndTime', // 设置作业结束时间
        workTotal: api + '/homework/statistics', //作业-统计信息
        homeworkbigtetail: api + '/homework/homeworkDetail', //大屏幕作业详情
        homeworkcommitpeople: api + '/homework/getCommitUser', //大屏幕作业已提交人员
        homeworknocommitpeople: api + '/homework/getUnCommitUser', //大屏幕作业未提交人员
        homeworkpeoplelist: api + '/homework/submit/page', //大屏幕作业提交人列表
        homeworkstudentcommit: api + '/homework/studentHomework', //学员提交的作业详情
        // 课程管理
        resRelateCourse: api + '/course/saveCourseResource', //关联课程资源
        resDelCourse: api + '/course/deleteCourseResource', //删除课程关联资源
        resListCourse: api + '/course/courseResourceList', // 课程资源列表
        courseElectiveItemUpdate: api + '/course/courseElectiveItemUpdate', //编辑子选修课
        findCourseElective: api + '/course/findCourseElectiveById', //获取选修课主体信息
        courseElectiveUpdate: api + '/course/courseElectiveUpdate', //编辑选修课主题
        courseElectiveItemSave: api + '/course/courseElectiveItemSave', // 添加选修课科目
        //积分
        IntegralList: api + '/userIntegral/detaillist', //积分列表 
        
        IntegraDicFindAll: api + '/dictionary/findAll', //获取加分原因和分值
        IntegraSave: api + '/save', //加分
        IntegrafindByUserId: api + '/userIntegral/findByUserId', //查看
        IntegraExportExcel: api + 'export/userIntegral/exportAllUsers', //导出
        integraItemsDetail: api + '/userIntegral/findByUserIdAndType', //积分管理-详细查看
        exportItemsDetail: api + 'export/userIntegral/exportByUserIdAndType', //积分管理-导出用户积分详情
        // 通知管理
        noticeDel: api + '/notice/delete', // 通知管理-删除
        noticeDet: api + '/notice/details', // 通知管理-查看详情
        noticeExport: api + 'export/notice/exportExcel', // 通知管理-导出Excel
        noticeList: api + '/notice/list', // 通知管理-分页数据列表
        noticeAdd: api + '/notice/save', // 通知管理-发布通知
        // 课程安排
        scheduleFind: api + '/schedule/findOne', // 课程安排-查看
        scheduleAdd: api + '/schedule/save', // 课程安排-发布
        // 互动点名
        rollCallExport: api + 'export/rollcallRecord/exportExcel', // 互动点名-导出excel
        rollCallList: api + '/rollcallRecord/list', // 互动点名-历史数据
        rollCallSave: api + '/rollcallRecord/save', // 互动点名-评价学员
        rollCallAllStudentList: api + '/clazzuser/usedAppAndAllStudentList',
        //日志管理
        getUserlogPageByClazzId: api + '/userlog/getUserlogPageByClazzId', //日志学员列表
        getUserlogDetails: api + '/userlog/details', //日志-学员列表详情
        getUserlogUpdate: api + '/userlog/task/rule/update', //日志-编辑
        getUserlogRule: api + '/userlog/task/rule', //日志-任务要求
        getUserlogFindProgressByClazzId: api + '/userlog/findUserLogProgressByClazzId', //日志-已完成未完成
        getUserExportUserList: api + 'export/userlog/exportUserList', //导出 -- 学员提交名单
        getUserExportWordUser: api + 'export/userlog/exportWordUserLog', //导出 -- 整体导出生成一个word
        getUserDownloadUserLogZip: api + '/userlog/downloadUserLogZip', //导出 -- 分学员生成word文档的zip包
        // 生活服务
        lifeDetails: api + '/livingGuide/details', // 生活服务-查看
        lifeSave: api + '/livingGuide/save', // 生活服务-保存
        // 帖子管理
        topicSubComment: api + '/topic/SubComment', // 帖子parentId获取评论及回复
        topicComment: api + '/topic/comment', // 查看帖子评论
        topicDel: api + '/topic/delete', // 删除帖子
        topicDelComment: api + '/topic/deleteComment', // 删除帖子评论
        topicDelPic: api + '/topic/deletePic', //删除帖子图片
        topicExpList: api + 'export/topic/exportTopicList', // 导出Excel：帖子列表
        topicDetails: api + '/topic/id', // 查看帖子详情
        topicList: api + '/topic/list', // 帖子列表
        topicPicList: api + '/topic/piclist', // 帖子图片列表
        topicTop: api + '/topic/top', // 帖子置顶
        topicExpPic: api + 'export/topic/exportZip', // 下载帖子图片
        topicVideo:api+'/topic/videoTopicList',//获取帖子视频
        topicDeletevideo:api+'/topic/deleteVideo',//删除帖子视频
        // 资源模块
        resClazzList: api + '/resource/clazzList', // 班级资源：资源列表
        resCommonList: api + '/resource/commonList', // 通用资源：文件夹列表 admin
        resDetails: api + '/resource/id', // 编辑：通过ID获取文件夹或资源详情
        resDelete: api + '/resource/delete', // 通过id 删除文件夹或资源
        resSave: api + '/resource/save', // 新建文件夹或上传资源
        resUpdate: api + '/resource/update', // 编辑文件夹或资源
        resExp: api + 'export/resource/exportResourceList', //导出资源列表（班级）
        resRelateClazz: api + '/resource/clazzResourceList', //班级资源，选择资源列表
        resViewUser: api + '/resource/viewUserList', //班级资源，资源查看人数列表
        resExpViewUser:api + 'export/resource/exportExcelViewUserList', // 导出资源查看人列表
        experttemplate:api+'/export/questionpaper/template/word',//通用管理导出模板

        //通用题目模块
        comFindByAndTypeAndLevel: api + '/commonquestion/findByAndTypeAndLevel', //后台查询指定题目
        comSave: api + '/commonquestion/save',
        getdefaulttemplate:api+'/questionpapertemplate/find/system/default/template',//获取系统默认的模板
        getdetemplatedetail:api+'/questionpapertemplate/findById',//获取模板详情
        updatetemplatequestion:api+'/questionpapertemplate/update/activity/paper/question',//修改模板题目
        updatetemplatedetail:api+'/questionpapertemplate/update/system/default/template',//修改系统默认的评价反思模板
        //评价反思模板
        paperFindByClazzIdAndTypeAndLevel: api + '/questionpapertemplate/findByClazzIdAndTypeAndLevel', //查看指定模板
        paperUploadClazzTemplate: api + '/questionpapertemplate/uploadClazzTemplate', //模板库评价反思模板上传
        paperUploadCourseTemplate: api + '/questionpapertemplate/update/activity/paper/question', //课程评价反思模板上传
        paperCourseEvaluation: aliyuncs + "/%E8%AF%BE%E7%A8%8B%E8%AF%84%E4%BB%B7%E6%A8%A1%E7%89%88.txt",
        // 证书模块
        getOrgCert: api + '/certficate/organization', // 通过机构ID查询机构证书模板
        orgCertSave: api + '/certficate/save', // 保存机构证书模板
        orgCertUpdate: api + '/certficate/update', // 编辑机构证书模板
        orgCertDownload: apid + 'resource/template/templet.zip', //证书模板
        certTempSample: apid + 'resource/template/certificate.jpg', //下载证书样例
        clazzCertDownTemp: api + 'clazzCertificate/downloadTemplet', // 下载导入学员模板Excel
        clazzCertDelAll: api + '/clazzCertificate/deleteByClazzId', // 班级下证书全部删除
        clazzCertDelOne: api + '/clazzCertificate/deleteById', // 证书单个删除
        clazzCertExpFail: api + 'export/clazzCertificate/exportCertificateAddFalseExcel', //导出学员证书失败
        clazzCertImportUser: api + '/clazzCertificate/importUserCertificate', //批量导入学员证书信息
        clazzCertList: api + '/clazzCertificate/list', //颁发证书列表
        clazzCertSearch: api + '/clazzCertificate/search', // 证书搜索
        clazzCertUpdate: api + '/clazzCertificate/update', //  证书编辑
        clazzCertExpAll: api + 'export/clazzCertificate/exportCertificateZip', // 导出班级证书
        // 学情模块
        clazzLearnListExp: api + 'export/userLearnStatistics/exportUserLearnList', // 导出班级学员统计列表
        clazzLearnList: api + '/userLearnStatistics/findByClazzId', // 学情统计列表
        clazzLearnOne: api + '/userLearnStatistics/findByUserId', // 学情统计 个人
        clazzLearnRuleGet: api + '/clazzLearnStatisticsRule/rule/get', // 获取学情统计规则
        clazzLearnRulePost: api + '/clazzLearnStatisticsRule/rule/update', // 更新学情统计规则
        //admin数据
        getweekAdd: api + '/admin/statistics/latest/weekReport', //得到周增加数据
        getyearAdd: api + '/admin/statistics/latest/yearReport', //得到最新年度增长数据报表，包括总和增长数量和各类机构的增长数量.
        getweekAdddetail: api + '/admin/statistics/list/weekly/increaseReport', //查询每周新增数据报表.
        exportAddweek: api + 'export/admin/statistics/export/weekly/increaseReport', //导出每周数据 
        getbeforeData: api + '/admin/statistics/page/training/before/clazz', //根据班级名、机构名分页查询训前班级
        getafterData: api + '/admin/statistics/page/training/after/clazz', //根据班级名、机构名分页查询训后班级
        getdownData: api + 'export/admin/statistics/export/training/after/clazz', //导出讯后数据
        getstatbeforeDate: api + '/admin/statistics/count/training/before/clazz', //统计训前班级数据，包括总班级数、总学员数、总班主任数、总专家数 
        getafterdetailData: api + '/admin/statistics/general/training/clazz/', //查看讯后班级详情
        getdownbeforeData: api + 'export/admin/statistics/export/training/daily/report', // 导出训前训中数据包括班级数量、学员数量、班主任数、专家数.
        getstatbeforeData: api + 'export/admin/statistics/export/training/before/clazz', //导出训前数据
        getpageData: api + '/admin/statistics/page/training/daily/report', //分页查询训中讯后数据
        getcenterData: api + '/admin/statistics/page/training/in/clazz', //得到训中数据
        getstatcenterData: api + '/admin/statistics/count/training/in/clazz', //统计训中班级数据，包括总班级数、总学员数、总班主任数、总专家数
        getdowncenterData: api + 'export/admin/statistics/export/training/in/clazz', //导出训中详细数据
        getdownother: api + "export/admin/statistics/export/training/other/clazz", //导出其他数据
        getotherdata: api + "/admin/statistics/page/training/other/clazz", //分页查询其他数据 
        // 总结报告
        reportSign: api + '/sign/signAttendanceData', // 总体考勤情况，签到详细数据
        reportSignDet: api + '/sign/signAttendanceSignedUserDetail', // 签到人员明细
        reportCourse: api + '/course/courseReport', //课程报告内容
        courseListByClazzNotask: api + '/course/commonCourseListByClazzId', // 班级下课程列表：不包含项目任务
        reportCourseExp: api + 'export/course/exportCourseReport', // 导出课程报告
        reportClazzStudentStatistics: api + '/clazz/clazzStudentStatistics', //班级学员报告
        clazzStudentActivityStatistics: api + '/clazz/clazzStudentActivityStatistics', //班级学员报告
        studentStudyResult: api + '/clazz/studentStudyResult', //学员成果报告
        reportStudyResult: api + 'export/clazz/exportStudentStudyResult', //导出学员成果报告
        reportAttendanceExp: api + 'export/sign/exportSignAttendanceReport', // 导出考勤报告
        reportClazzStudentDetail: api + '/clazz/clazzStudentDetail', //班级学员报告(报告列表)
        reportClazzStudentAttendDetail: api + '/clazz/clazzStudentAttendDetail', //班级学员报告(学员参与明细列表)
        reportProfessor: api + '/professor/report', // 专家报告
        reportTrainData: api + '/clazz/clazzTrainResultSatisfied', // 培训效果报告
        reportTrainExp: api + 'export/clazz/exportClazzTrainResultReport', // 导出培训报告
        exportClazzStudentStatisticsReport: api + 'export/clazz/exportClazzStudentStatisticsReport', //导出总结报告word学员报告
        reportEvaluateT: aliyuncs + '/%E9%A1%B9%E7%9B%AE%E7%BB%A9%E6%95%88%E8%87%AA%E8%AF%84%E6%8A%A5%E5%91%8A%EF%BC%88%E6%A8%A1%E6%9D%BF%EF%BC%89.doc',
        reportEvaluate: aliyuncs + '/%E9%A1%B9%E7%9B%AE%E7%BB%A9%E6%95%88%E8%87%AA%E8%AF%84%E6%8A%A5%E5%91%8A-%E6%A0%B7%E4%BE%8B.doc',
        reportTrainT: aliyuncs + '/%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%E9%A1%B9%E7%9B%AE%E7%AE%A1%E7%90%86%E6%89%8B%E5%86%8C%EF%BC%88%E6%A8%A1%E6%9D%BF%EF%BC%89.doc',
        reportTrain: aliyuncs + '/%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%E9%A1%B9%E7%9B%AE%E7%AE%A1%E7%90%86%E6%89%8B%E5%86%8C-%E6%A0%B7%E4%BE%8B.doc',
        reportEvaluateTpdf: aliyuncs + '/%E9%A1%B9%E7%9B%AE%E7%BB%A9%E6%95%88%E8%87%AA%E8%AF%84%E6%8A%A5%E5%91%8A%EF%BC%88%E6%A8%A1%E6%9D%BF%EF%BC%89.pdf',
        reportEvaluatePdf: aliyuncs + '/%E9%A1%B9%E7%9B%AE%E7%BB%A9%E6%95%88%E8%87%AA%E8%AF%84%E6%8A%A5%E5%91%8A-%E6%A0%B7%E4%BE%8B.pdf',
        reportTrainTpdf: aliyuncs + '/%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%E9%A1%B9%E7%9B%AE%E7%AE%A1%E7%90%86%E6%89%8B%E5%86%8C%EF%BC%88%E6%A8%A1%E6%9D%BF%EF%BC%89.pdf',
        reportTrainPdf: aliyuncs + '/%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%E9%A1%B9%E7%9B%AE%E7%AE%A1%E7%90%86%E6%89%8B%E5%86%8C-%E6%A0%B7%E4%BE%8B.pdf',
        reportProfessorExp: api + 'export/professor/exportReport', // 导出专家报告
        // 申请试用
        reserveUseList: api + '/ReserveUse/findPage', // 申请试用名单
        reserveUseExp: api + 'export/ReserveUse/exportReserveUseList', // 导出 申请试用
        // 网络课程
        onlineAdd: api + '/onlinecourse/addRequiredCourse', // 添加必修课
        onlineAllRequire: api + '/onlinecourse/clazzAllRequiredCourseList', // 全部网络课程必修课已选的（已发布、未发布） 
        onlineAllRequireExp: api + 'export/onlinecourse/exportAllRequiredCourseExcel', // 整体导出已选课程信息
        onlineRequireInfo: api + '/onlinecourse/clazzRequiredCourseInfo', // 班级已选必修课程信息（包括：已选几门，已选课程总学时，按钮是否为“更新”的标识）
        onlineUser: api + '/onlinecourse/courseViewRecordDetails', // 网课学员列表
        onlineUserExp: api + 'export/onlinecourse/exportCourseViewRecordExcel', // 网课学员列表导出
        onlineunPublish: api + '/onlinecourse/unPublishOnlineCourseList', //查看班级未发布的课程
        onlineSetGet: api + '/onlinecourse/findTaskRuleByClazzId', // 查看班级网课规则设置
        onlinePublish: api + '/onlinecourse/publishRequiredCourse', // 发布必修课
        onlineSetPost: api + '/onlinecourse/publishTaskRule', // 发布课程规则
        onlineRemove: api + '/onlinecourse/removeRequiredCourse', // 移除必修课程
        onlineStageAndSubject: api + '/onlinecourse/searchSchoolStageAndSubject', //获取学段学科数据
        onlineSearch: api + '/onlinecourse/searchRequiredCourse', // 课程库搜索必修课程
        onlineCourseDetail: api + '/onlinecourse/course/detail', // 必修课程详细信息
        // APP 版本发布
        appVersionDel: api + '/appversion/delete', // 删除版本记录
        appVersionPage: api + '/appversion/page', // 分页查询版本记录
        appVersionSave: api + '/appversion/save', // 新增版本记录
        // admin 积分管理
        usertaskDel: api + '/usertask/delete', // 删除一条积分任务
        usertaskFindOne: api + '/usertask/findById', // 查询单条积分任务详情
        usertaskList: api + '/usertask/page', // 分页查询积分任务
        usertaskReasonList: api + '/usertask/reason/list', // 获取手动加分原因
        usertaskReasonSave: api + '/usertask/reason/save', // 编辑更新手动加分原因
        usertaskSave: api + '/usertask/save', // 新增一条积分任务
        usertaskUpdate: api + '/usertask/update', // 编辑更新积分任务
        usertaskAvailable: api + '/usertask/update/available', // 启用或禁用一条任务
        // 系统维护通知
        systemMaintainDet: api + '/systemnotification/details', // 系统维护-查看
        systemMaintainPub: api + '/systemnotification/publish', // 系统维护-发布
        systemMaintainShut: api + '/systemnotification/shut', // 系统维护-关闭
        //帮助中心
        helpColumndelete: api + '/helpColumn/delete', //删除栏目
        helpColumnlist: api + '/helpColumn/list', //获取栏目列表
        helpColumnsave: api + '/helpColumn/save', //创建栏目
        helpaddvideo: api + '/aliyun/getHelpVideoUploadToken', //阿里云视频上传
        helpaddimg: api + '/aliyun/getHelpPictureUploadToken', //阿里云图片上传
        postarticle: api + '/helpArticle/saveOrUpdate', //保存文章
        gethelpArticle: api + '/helpArticle/list', //通过栏目id获取栏目下的文章
        getArticle: api + '/helpArticle/id', //通过文章id获取文章
        Deletearticle: api + '/helpArticle/deleteById', //通过栏目id删除文章
        sorthelparticle: api + '/helpArticle/sortHelpArticle', //文章排序

        // 问卷模板库
        questempUsedTimes: api + '/questionpaper/addTemplateUsedTimes', // 更新模板被使用的次数
        questempAddtoOrg: api + '/questionpaper/addToOrgTemplate', // 班级问卷添加至机构模板库
        questempDel: api + '/questionpaper/deleteTemplate', // 删除问卷模板
        questemplist: api + '/questionpaper/findOrgTemplates/list', // 获取机构问卷模板集合列表
        questempOrgPage: api + '/questionpaper/findOrgTemplates/page', // 获取机构问卷模板分页列表
        questempAdminPage: api + '/questionpaper/findSysTemplates/page', // 获取admin问卷模板分页列表
        questempFindOne: api + '/questionpaper/findTemplateById', // 查看模板详情
        questempCreate: api + '/questionpaper/saveTemplate', // 创建问卷模板
        questempUpdate: api + '/questionpaper/updateTemplate', // 编辑问卷模板

        //微信
        //wechatPage:api + '/wechat/page', //分页获得微信关注用户列表
        wechatQrcode: api + '/wechat/qrcode', //获得绑定微信公众号二维码
        wechatUser: api + '/wechat/wechatBindUser', //绑定微信用户列表
        bindWechat: api + '/wechat/bindWechat', //绑定微信
        checkWechatBind: api + '/wechat/checkWechatBind', //校验绑定微信
        wechatWebsocket: socketApi + '/wechat/websocket', //微信二维码扫码

        //机构资源库
        librarydelete: api + '/library/resource/delete', //删除文件夹或者资源
        librarydetail: api + '/library/resource/detail', //资源库资源详情
        librarypage: api + '/library/resource/page', //资源库分页查询
        libraryreference: api + '/library/resource/reference', //资源库引用资源
        librarysave: api + '/library/resource/save', //新建文件夹或者上传资源
        libraryupdate: api + '/library/resource/update', //编辑文件夹或者资源
        getlibraryvideo: api + '/aliyun/getResourceVideoUploadToken', //阿里云视频上传获取路径
        getLibraryAliyunZip: api + '/aliyun/getResourceZipUploadToken', //阿里云压缩包上传获取路径
        resourceMove: api + '/resource/move', //班级内文件夹的转移        
        resourceFolderlist: api + '/resource/clazz/folder/list', //将机构中的文件添加至班级内


        // 机构总结报告
        RepOrgExpItemCrade: api + 'export/organizationReport/exportOrgClazzGrade', // 导出-机构-项目评分
        RepOrgExpItemSat: api + 'export/organizationReport/exportOrgClazzSatisfaction', // 导出-机构-项目满意度
        RepOrgExpItemStat: api + 'export/organizationReport/exportOrgClazzStatistics', // 导出-机构-项目统计报告
        RepOrgExpCourseGrade: api + 'export/organizationReport/exportOrgCourseGrade', // 导出-机构-课程评分报告
        RepOrgExpCourseSat: api + 'export/organizationReport/exportOrgCourseSatisfaction', // 导出-机构-课程满意度报告
        RepOrgExpMsg: api + 'export/organizationReport/exportOrgIntrospectionMessage', // 导出-机构-学员留言
        RepOrgExpTask: api + 'export/organizationReport/exportOrgTaskComplete', // 导出-机构-任务完成情况
        RepOrgExpProfessor: api + 'export/organizationReport/exportProfessorStatistics', // 导出-机构-专家授课情况报告

        RepItemExpItemGrade: api + 'export/organizationReport/exportProClazzGrade', // 导出-项目-项目评分
        RepItemExpItemSat: api + 'export/organizationReport/exportProClazzSatisfaction', // 导出-项目-项目满意度
        RepItemExpItemStat: api + 'export/organizationReport/exportProClazzStatistics', // 导出-项目-项目统计报告
        RepItemExpCourseGrade: api + 'export/organizationReport/exportProCourseGrade', // 导出-项目-课程评分报告
        RepItemExpCourseSat: api + 'export/organizationReport/exportProCourseSatisfaction', // 导出-项目-课程满意度报告
        RepItemExpMsg: api + 'export/organizationReport/exportProIntrospectionMessage', // 导出-项目-学员留言
        RepItemExpProfessor: api + 'export/organizationReport/exportProProfessorStatistics', // 导出-项目-专家授课情况报告
        RepItemExpTask: api + 'export/organizationReport/exportProTaskComplete', // 导出-项目-任务完成情况

        RepOrgItemGrade: api + '/organizationReport/getOrgClazzGrade', // 机构-项目评分
        RepOrgItemSat: api + '/organizationReport/getOrgClazzSatisfaction', // 机构-项目满意度
        RepOrgItemStat: api + '/organizationReport/getOrgClazzStatistics', // 机构-项目统计报告
        RepOrgCourseGrade: api + '/organizationReport/getOrgCourseGrade', // 机构-课程评分报告
        RepOrgCourseSat: api + '/organizationReport/getOrgCourseSatisfaction', //机构-课程满意度报告
        RepOrgMsg: api + '/organizationReport/getOrgIntrospectionMessage', // 机构-学员留言
        RepOrgProfessor: api + '/organizationReport/getOrgProfessorStatistics', // 机构-专家授课情况报告
        RepOrgTask: api + '/organizationReport/getOrgTaskComplete', // 机构-任务完成情况

        RepItemItemGrade: api + '/organizationReport/getProClazzGrade', // 项目-项目评分
        RepItemItemSat: api + '/organizationReport/getProClazzSatisfaction', //项目-项目满意度
        RepItemItemStat: api + '/organizationReport/getProClazzStatistics', // 项目-项目统计报告
        RepItemCourseGrade: api + '/organizationReport/getProCourseGrade', // 项目-课程评分报告
        RepItemCourseSat: api + '/organizationReport/getProCourseSatisfaction', // 项目-课程满意度报告
        RepItemMsg: api + '/organizationReport/getProIntrospectionMessage', // 项目-学员留言
        RepItemProfessor: api + '/organizationReport/getProProfessorStatistics', // 项目-专家授课情况
        RepItemTask: api + '/organizationReport/getProTaskComplete', // 项目-任务完成情况

        // 导出机构统计word文档
        orgExpStat: api + 'export/organization/exportOrganizationStatisticsReport', // 3.5.3 导出机构统计word文档

        // 356 阿里云
        AliyunEditImg: api + '/aliyun/getHtmlEditorUploadToken', // 356 获取富文本编辑器上传图片token
        groupImport: api + '/group/importGroup', // 班级内导入分组
        templateGroup: apid + '/resource/template/group.xlsx', //导入分组模板
        exportGroupFail: api + 'export/group/exportGroupAddFalseExcel', //导出分组导入失败反馈
        exportEvalWordDetail: api + 'export/questionpaper/exportEvaluationWordDetail', // 导出评价WOED，评价统计，分学员

        // 360 接口
        courseElectiveSave: api + '/course/courseElectiveSave', // 创建选修课
        courseListv360: api + '/course/courseListV360', //课程管理-全部课程集合(支持搜索)
        courseElectiveDel: api + '/course/courseElectiveDelete', // 删除选修课
        courseElectiveExp: api + 'export/course/exportCourseElective/courseUserInfo', // 导出选修课
        coursedefault: api + '/course/defaultCourse', //获取班级的项目活动


        //直播接口
        // liveMemberList: api + '/clazzuser/member/list', //获取班级学员列表
        liveMemberList:api + '/liveroom/member/list',//获取班级增量接口
        liveRoomAuth: api + '/liveroom/auth', //获取直播课程的直播间授权token信息
        // liveRoomChat: api + '/liveroom/chat/record/page',//分页获取直播间的聊天记录
        liveRoomChat: api + '/liveroom/chat/record/latest',
        liveRoomChatSave: api + '/liveroom/chat/record/save', //上传保存聊天记录
        liveRoomEnd: api + '/liveroom/end', //结束直播
        liveRoomOnlineList: api + '/liveroom/online/user/list', //获取直播间在线用户id集合
        liveRoomStart: api + '/liveroom/start', //开始直播
        livestartsignin: api + '/livecourse/course/sign/open', //直播间开启签到
        liveendsignin: api + '/livecourse/sign/close', //直播间结束签到
        liveforsignin: api + '/livecourse/sign/inprogress', //直播间正在进行签到
        liveLoginOsType: api + '/liveroom/user/login/ostype', //只能一端进行登录
        liveroomPlayUrl: api + '/liveroom/push/play/url',//获取直播间推流地址

        // 直播课相关
        activityUpdateStatus: api + '/activity/updateStatus', //直播版本（作业、问卷、投票）修改活动状态：立即开始start、立即结束end
        liveroomChatRecord: api + '/liveroom/chat/record/page', // 直播讨论区聊天的历史消息
        liveroomExpChat: api + 'export/liveroom/exportWordChatMessage', // 导出讨论组消息记录
        livecourseActList: api + '/livecourse/course/activityList', // 直播课程活动列表
        livecourseActStatus: api + '/livecourse/updateStatus', // 直播间活动（作业、问卷、投票 、评价、反思）：开启start、关闭end
        livecourseStatistics: api + '/livecourse/liveCourseStatistics', // 课堂表现
        livecourseExpExcel: api + 'export/livecourse/exportLiveCourseStatisticsExcel', // 导出课堂表现

        livepublishanswer: api + '/livecourse/saveAnswerQuestion', //直播间创建答题器
        liveforanswer: api + '/livecourse/inprogressAnswerQuestion', //直播间正在进行的答题器
        liveanswerend: api + '/livecourse/findAnswerQuestionById', //直播间获取答案的统计结果
        livecloseanswer: api + '/livecourse/closeAnswerQuestion', //直播间关闭答题

        liveRoomKickout: api + '/liveroom/to/student/kickout', // 学员被踢出直播间
        liveRoomShutup: api + '/liveroom/to/student/nonmessage', // 学员被禁言
        liveRoomSendFlower: api + '/liveroom/to/student/sendFlower', // 学员送花奖励

        liveroomStatus: api+ '/liveroom/status',    //直播间状态
        liveroomPlayUrl:api + '/liveroom/push/play/url', //获取直播间推流播流地址
        // 巡课相关
        liveRoomTourStart: api + '/liveroom/lookover/start', // 开启巡课
        liveRoomTourEnd: api + '/liveroom/lookover/end', // 结束巡课
        liveRoomLookStuList: api + '/liveroom/lookover/student/list', //获取巡课学员

        //用户相关
        userListByPhone: api + '/user/userListByPhone',//通过用户的手机号获取相关联账号列表
        //重置密码
        updateOwnPassWord:api + '/user/updateOwnPassword',//v4.2.0用户修改自己账号密码

        //报名相关接口
        searchableFields: api + '/signup/get/searchable/fields',//获取可用于搜索的字段信息
        selectedFields: api + '/signup/get/selected/fields',    //获取选择的所有报名字段信息
        pageSearch: api + '/signupuser/page/search',    //分页查询已报名学员信息
        qRCode: api + '/signup/publish/QRCode',    //下发报名二维码 
        setFields: api + '/signup/set/fields',    //设置报名字段信息 
        setInfo: api + '/signup/set/info',    //设置报名信息 
        viewInfo: api + '/signup/view/info', //获取班级报名设置信息
        getQrCode: api+'export/signup/qrcode/download/', //下载二维码
        signUpEditUser: api+'/signupuser/user/update', //编辑学员信息(不导入)
        signUpEditUserImport: api+'/signupuser/user/update/import', //编辑学员信息并导入
        batchRefuse: api+'/signupuser/batch/refuse', //拒绝选中的多个学员
        batchImport: api+'/signupuser/batch/import', //导入选中的多个学员
        allImport: api+'/signupuser/all/import', //一键全部导入
        exportSignUp: api+'export/signupuser/export/excel', //导出报名学员名单 
        recoverSignUp: api+'/signupuser/user/recover', //恢复学员的报名状态
        refuseSingle: api+'/signupuser/single/refuse', //拒绝单个学员  
        importSingle: api+'/signupuser/single/import', //导入单个学员
        recordingView: api+'/livecourse/recording/view', //V4.2.3直播录制回放视频，统计回放视频查看次数
        //商务联系表
        buschat:api+'/businessRelationUser/page',//获取商务联系的分页信息
        exportbuschat:api+'export/businessRelationUser/exportExcel',//获取商务联系的分页信息
        saveBusiness:api+'/businessRelationUser/save',//保存商务联系
        recordingUser:api+'/livecourse/get/recording/user',//获取录制回放视频的查看学员列表
        exportRecordingUser:api+'export/livecourse/export/recording/user',//导出录制回放视频的查看学员列表
        exportIntegralAll:api+'export/userIntegral/exportByUserId',//积分管理-用户总计分详情列表导出

        //课程领域接口
        addclazzfield:api+'/curriculumfield/save',//新增课程领域
        editclazzfield:api+'/curriculumfield/updateById',//修改课程领域
        deleteclazzfield:api+'/curriculumfield/deleteById',//删除课程领域
        getclazzfield:api+'/curriculumfield/findAllForPage',//获取课程领域
        //专家库
        getexpertlist:api+'/expert/findPageList',//获取专家库列表
        addexpert:api+'/expert/save',//新增专家
        editexpert:api+'/expert/update',//便捷专家
        deleteexpert:api+'/expert/deleteById',//删除专家
        getexpertinfo:api+'/expert/findById',//获取专家信息
        getexperttitle:api+'/dictionary/findAllByType',//获取专家职称
        getstudentinfo:api+'/studySection/getAllStudySectionAndSubject',//获取所有的学段学科
        exportexpert:api+'export/expert/exportList',//导出专家列表
        applylist:api+'/apply/page',//申请宁专家联系表
        applyexport:api+'export/apply/export',//申请专家联系表导出
        applyadd:api+'/apply',//新增申请联系
        getcity:api+'/area/findAllParentAndChrildenByLevel',//省
        getshi:api+'/area/findByParentCode',//市
        posttopimg:api+'/aliyun/getUserAvatarUploadToken',//头像上传

        //学员互评作业
        setMutualTime: api+'/reviewHomework/updateEndTime',//学员互评作业-->时间设置
        mutualWorkTotal: api+'/reviewHomework/statistics',//学员互评作业-->作业-统计信息
        mutualWorkDetail: api+'/reviewHomework/details',//学员互评作业-->活动详情
        mutualworkPage: api+'/reviewHomework/reviewHomeworkPage',//学员互评作业-->学员提交的数据
        mutualOtherDetail: api+'/reviewHomework/studentHomework',//学员互评作业的详情-->
        setReviewScore: api +'/reviewHomework/reviewScore',//学员互评作业打分-->
        ReviewgetFinishedUser: api +'/reviewHomework/getFinishedUser',//学员互评作业-->已完成人员列表
        ReviewgetUnCommitUser: api +'/reviewHomework/getUnCommitUser',//学员互评作业-->未提交人员列表
        ReviewgetUnReviewUser: api +'/reviewHomework/getUnReviewUser',//学员互评作业-->未评阅人员列表
        ReviewgetExportUser: api +'export/reviewHomework/exportUserExcel',//学员互评作业-->导出EXCEL:互评作业学员名单
        ReviewgetActivityList: api +'/activity/reviewHomeworkActivityListInClazz',//学员互评作业-->导出EXCEL:互评作业学员名单
        ReviewExportMutualList: api +'export/activity/exportReviewHomeworkActivityListInClazz',//学员互评作业-->导出EXCEL:班级-互评作业活动列表
        experttutu:api+'/export/questionpaper/exportResultPDF',//导出问卷以及评价
        // ReviewExportMutualList: api +'/activity/exportReviewHomeworkActivityListInClazz',//学员互评作业-->导出EXCEL:班级-互评作业活动列表

        // vip账号
        saveVipApply : api + '/apply4vip/save' , // 申请/续约vip
        vipApplyList : api + '/apply4vip/list' , // vip申请列表
        exportVipApplyList : api + '/export/apply4vip/exportApply4vipList' , // vip申请列表导出
        getAccountInfo : api + '/organizationaccount/id' , // 申请/续约vip
        vipDefaultConfiguration : api + '/limitconfig/getAll' , // VIP初始化配置列表

        getAliyunOrgLogo : api + '/aliyun/getOrganizationLogoToken' , // 机构logo阿里云上传
        

    }
}
export default WEB_CONFIG;