import API from '@/global/resource'
import http from '@/global/request'

export default {
    // 全部课程进入评价反思结果页面
    getCourseEvalIntroRes (data, callback) {
        http.get(API.urls.courseEvalIntroRes, data, 'h2', callback)
    },
    // 活动结果页
	getCourseActPaperRes (data, callback) {
		http.get(API.urls.courseActPaperRes, data, 'h2', callback)
	},
    // 结束投票
    closeVote (data, callback) {
        http.post(API.urls.closeVote, data, 'h2', callback)
    },
    // 投票问卷评价反思，项目任务，课程详情统计数据
    getCourseActPaperStat (data, callback) {
        http.get(API.urls.courseActPaperStat, data, 'h2', callback)
    },

    questionnaireCreate(data,callback){
         http.jsonPost(API.urls.questionnaireCreate, data, callback)
    },

    questionnaireEdit(data,callback){
         http.get(API.urls.questionnaireEdit, data, 'h2', callback)
    },


    // // 导出Excel
    // exportResExcel(data, callback) {
    //     http.get(API.urls.exportResExcel, data, 'h2', callback)
    // },
    // // 导出PDF
    // exportResPDF(data, callback) {
    //     http.get(API.urls.exportResPDF, data, 'h2', callback)
    // },



    draftAct(data,callback){
        http.get(API.urls.draftAct, data, 'h2', callback)
    },
    draftActEditor(data,callback){
        http.get(API.urls.draftActEditor, data, 'h2', callback)
    },
    draftDelete(data,callback){
        http.post(API.urls.draftDelete, data, 'h2', callback)
    },
     //问答接口预留 -- 不要删掉
    // answerCreate(data,callback){
    //   http.post(API.urls.answerCreate, data, 'file', callback, 'file')
    // },
    // getQuestionDetail(data,callback){
    //   http.get(API.urls.getQuestionDetail, data, 'h2', callback)
    // }
    courseMessagelist(data,callback){
      http.get(API.urls.courseMessagelist, data, 'h2', callback)
    },
    courseActMessagelist(data,callback){
      http.get(API.urls.courseActMessagelist, data, 'h2', callback)
    },
    courseMessageDelete(data,callback){
      http.post(API.urls.courseMessageDelete, data, 'h2', callback)
    },
    stundentList(data,callback){
      http.get(API.urls.stundentList, data, 'h2', callback)
    },
    courseDiscussSave(data,callback,fileArray){
    http.post(API.urls.courseDiscussSave, data, 'file', callback,'file',fileArray)
  },
    courseDiscussDetails(data,callback){
      http.get(API.urls.courseDiscussDetails,data, 'h2', callback)
    },
    coursePageChat(data,callback){
      http.get(API.urls.coursePageChat,data, 'h2', callback)
    },
    //饼图导出数据
    getEvaluationDetail(data,callback){
      http.get(API.urls.getEvaluationDetail,data, 'h2', callback)
    },
  //饼图导出数据
    exportEvaluationPDF(data,callback){
      http.post(API.urls.exportEvaluationPDF,data,'file', callback,'file')
    },
    courseMessageExportExcel(data,callback){
      http.get(API.urls.courseMessageExportExcel, data, 'h2', callback)
    },


    // 直播版本（作业、问卷、投票）修改活动状态：立即开始start、立即结束end
    updateStatus(data, callback) {
        http.post(API.urls.activityUpdateStatus, data, 'h2', callback)
    },

}
