import API from '@/global/resource'
import http from '@/global/request'

export default {
	// 课程报告内容
	getCourseData(data, callback) {
		http.get(API.urls.reportCourse, data, 'h2', callback)
	},
	// 班级下课程列表：不包含项目任务
	getCourseList(data, callback) {
		http.get(API.urls.courseListByClazzNotask, data, 'h2', callback)
	}

}