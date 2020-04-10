import API from '@/global/resource'
import http from '@/global/request'

export default {
		
	// 照片墙活动下照片列表
	getPhotoList(data, callback) {
		http.get(API.urls.photoList, data, 'h2', callback)
	},
	// 删除照片墙活动
	delPhotoWall(data, callback) {
		http.post(API.urls.photoWallDel, data, 'h2', callback)
	},
	// 导出照片墙压缩包
	exportPhoto(data, callback) {
		http.get(API.urls.photoExport, data, 'h2', callback)
	},
	// 删除照片墙下照片
	delPhotoPic(data, callback) {
		http.post(API.urls.photoPicDel, data, 'h2', callback)
	},
	// 获取照片墙活动详情
	getPhotoOne(data, callback) {
		http.get(API.urls.photoOne, data, 'h2', callback)
	},
	// 新建照片墙活动
	createPhoto(data, callback) {
		http.post(API.urls.photoCreate, data, 'h2', callback)
	},

	// 编辑照片墙活动
	updatePhoto(data, callback) {
		http.post(API.urls.photoUpdate, data, 'h2', callback)
	},

	// 获取照片墙活动照片数量
	getPhotoCount(data, callback) {
		http.get(API.urls.photoCount, data, 'h2', callback)
	},

	// 班级首页--照片墙列表
	getClazzPhotoList(data, callback) {
		http.get(API.urls.clazzPhotoList, data, 'h2', callback)
	},

	
	
}