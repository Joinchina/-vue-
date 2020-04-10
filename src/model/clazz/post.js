import API from '@/global/resource'
import http from '@/global/request'

export default {
	// 帖子parentID 获取评论及回复
	topicSubComment(data, callback) {
		http.get(API.urls.topicSubComment, data, 'h2', callback)
	}, 
	
	// 查看帖子评论
	topicComment(data, callback) {
		http.get(API.urls.topicComment, data, 'h2', callback)
	},

	// 删除帖子
	topicDel(data, callback) {
		http.post(API.urls.topicDel, data, 'h2', callback)
	},

	// 删除贴子评论
	topicDelComment(data, callback) {
		http.post(API.urls.topicDelComment, data, 'h2', callback)
	},

	// 删除帖子图片
	topicDelPic(data, callback) {
		http.post(API.urls.topicDelPic, data, 'h2', callback)
	},

	// 查看帖子详情
	topicDetails(data, callback) {
		http.get(API.urls.topicDetails, data, 'h2', callback)
	},

	// 帖子列表
	topicList(data, callback) {
		http.get(API.urls.topicList, data, 'h2', callback)
	},

	// 帖子图片列表
	topicPicList(data, callback) {
		http.get(API.urls.topicPicList, data, 'h2', callback)
	},

	// 帖子置顶
	topicTop(data, callback) {
		http.post(API.urls.topicTop, data, 'h2', callback)
	},
	//获取帖子视频
	gettopicVideo(data, callback) {
		http.get(API.urls.topicVideo, data, 'h2', callback)
	},
	// 删除帖子视频
	deletePicvideo(data, callback) {
		http.post(API.urls.topicDeletevideo, data, 'h2', callback)
	},
}