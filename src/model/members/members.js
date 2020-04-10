import API from '@/global/resource'
import http from '@/global/request'
export default {
  //获取班主任列表
  getClazzManagerList (data,callback) {
    http.get(API.urls.getClazzManagerList,data,'h2', callback)
  },
  //分配班主任
  clazzManagerAllotList (data,callback) {
    http.get(API.urls.clazzManagerAllotList,data,'h2', callback)
  },
  //分配专家
  clazzAllotProfessor (data,callback) {
    http.get(API.urls.clazzAllotProfessor,data,'h2', callback)
  },
  //新增班主任
  createSaveClazzManager (data,callback) {
    http.post(API.urls.createSaveClazzManager,data,'h2', callback)
  },
  //新增专家有头像
  createSaveProfessor(data,callback) {
    http.post(API.urls.createSaveProfessor,data,'file', callback, 'file')
  },
  //新增学员
  createSaveStudent(data,callback) {
    http.post(API.urls.createSaveStudent,data,'h2', callback)
  },
  //获取专家列表
  getClazzProfessorList (data,callback) {
    http.get(API.urls.getClazzProfessorList,data,'h2', callback)
  },
  //分配专家
  professorAllotList (data,callback) {
    http.get(API.urls.professorAllotList,data,'h2', callback)
  },
  //分配班主任 - 保存
  allotClazzManager (data,callback) {
     http.post(API.urls.allotClazzManager,data,'h2', callback)
  },
  //分配专家 -- 保存
  allotProfessor (data,callback) {
    http.post(API.urls.allotProfessor,data,'h2', callback)
  },
  //获取学员列表
  getClazzStudentList (data,callback) {
    http.get(API.urls.getClazzStudentList,data,'h2', callback)
  },
  //删除专家、班主任
  removeProfessCLazz(data,callback){
    http.post(API.urls.removeProfessCLazz,data,'h2', callback)
  },
  //学员-- 查看个人报告
  getUserStatistics (data,callback) {
    http.get(API.urls.getUserStatistics,data,'h2', callback)
  },
  //学员 -- 导出学员
  exportExcelStudent (data,callback) {
    http.get(API.urls.exportExcelStudent,data,'h2', callback)
  },
  //学员 -- 导出个人报告 excel
  exportExcelUserStatistic (data,callback) {
    http.get(API.urls.exportExcelUserStatistic,data,'h2', callback)
  },
  //学员 -- 导出个人报告 zip
  exportZipUserStatistics (data,callback) {
    http.get(API.urls.exportZipUserStatistics,data,'h2', callback)
  },
  //个人报告 -- 导出个人报告 zip
  exportWordUserStatistics (data,callback) {
    http.get(API.urls.exportWordUserStatistics,data,'h2', callback)
  },
  //导入学员
  importStudents(data, callback){
    http.post(API.urls.importStudents, data, 'file', callback, 'file')
  },

  //获取学员删除类型的所有值
  studentDeletedReasonList(data,callback){
    http.get(API.urls.studentDeletedReasonList,data,'h2', callback)
  },

  //导出删除学员Excel
  studentDeleted(data, callback){
    http.get(API.urls.studentDeleted, data, 'h2', callback)
  },

  // 导入专家
  importProfessor(data, callback) {
    http.post(API.urls.importProfessor, data, 'file', callback, 'file')
  },

  // 导出专家导入失败反馈
  exportProfessorFail(data, callback) {
    http.get(API.urls.exportProfessorFail, data, 'h2', callback)
  }

}
