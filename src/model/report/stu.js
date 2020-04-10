import API from '@/global/resource'
import http from '@/global/request'

export default{
	// 班级学员报告
	reportClazzStudentStatistics(data, callback){
		http.get(API.urls.reportClazzStudentStatistics, data, 'h2', callback)
	},

	//班级内学员概括
	reportClazzStudentActivityStatistics(data,callback){
		http.get(API.urls.clazzStudentActivityStatistics, data, 'h2', callback)
	},

	//学员成果报告
	studentStudyResult(data,callback,loading){
		http.get(API.urls.studentStudyResult, data, 'h2', callback, loading)

	},
	//班级学员报告 - 学员列表
	reportClazzStudentDetail(data,callback){
		http.get(API.urls.reportClazzStudentDetail, data, 'h2', callback)
	},
	//班级学员报告 - 学员参与明细
	reportClazzStudentAttendDetail(data,callback){
		http.get(API.urls.reportClazzStudentAttendDetail, data, 'h2', callback)

	}
}