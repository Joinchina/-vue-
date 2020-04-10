import API from '@/global/resource'
import http from '@/global/request'

export default {
	// 机构-课程满意度报告
	RepOrgCourseSat(data, callback) {
		http.get(API.urls.RepOrgCourseSat, data, 'h2', callback)
	},
	// 项目-课程满意度报告
	RepItemCourseSat(data, callback) {
		http.get(API.urls.RepItemCourseSat, data, 'h2', callback)
	},

	// 机构-课程评分
	RepOrgCourseGrade(data, callback) {
		http.get(API.urls.RepOrgCourseGrade, data, 'h2', callback)
	},

	// 项目-课程评分
	RepItemCourseGrade(data, callback) {
		http.get(API.urls.RepItemCourseGrade, data, 'h2', callback)
	},

	// 机构-专家授课情况
	RepOrgProfessor(data, callback) {
		http.get(API.urls.RepOrgProfessor, data, 'h2', callback)
	},

	// 项目-专家授课情况
	RepItemProfessor(data, callback) {
		http.get(API.urls.RepItemProfessor, data, 'h2', callback)
	},

	// 机构-项目满意度
	RepOrgItemSat(data, callback) {
		http.get(API.urls.RepOrgItemSat, data, 'h2', callback)
	},

	// 项目-项目满意度
	RepItemItemSat(data, callback) {
		http.get(API.urls.RepItemItemSat, data, 'h2', callback)
	},

	// 机构-项目评分
	RepOrgItemGrade(data, callback) {
		http.get(API.urls.RepOrgItemGrade, data, 'h2', callback)
	},

	// 项目-项目评分 
	RepItemItemGrade(data, callback) {
		http.get(API.urls.RepItemItemGrade, data, 'h2', callback)
	},

	// 机构-项目统计
	RepOrgItemStat(data, callback) {
		http.get(API.urls.RepOrgItemStat, data, 'h2', callback)
	},

	// 项目-项目统计
	RepItemItemStat(data, callback) {
		http.get(API.urls.RepItemItemStat, data, 'h2', callback)
	},

	// 机构-学生留言
	RepOrgMsg(data, callback) {
		http.get(API.urls.RepOrgMsg, data, 'h2', callback)
	},

	// 项目-学员留言
	RepItemMsg(data, callback) {
		http.get(API.urls.RepItemMsg, data, 'h2', callback)
	},

	// 机构-任务完成情况
	RepOrgTask(data, callback) {
		http.get(API.urls.RepOrgTask, data, 'h2', callback)
	},

	// 项目-任务完成情况
	RepItemTask(data, callback) {
		http.get(API.urls.RepItemTask, data, 'h2', callback)
	}

}