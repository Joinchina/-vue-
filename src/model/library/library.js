import API from '@/global/resource'
import http from '@/global/request'
export default {
    //删除文件夹或者资源
    librarydelete(data, callback) {
        http.post(API.urls.librarydelete, data, 'h2', callback)
    },
    //资源库资源详情
    librarydetail(data, callback) {
        http.get(API.urls.librarydetail, data, 'h2', callback)
    },
    //资源库分页查询
    librarypage(data, callback) {
        http.get(API.urls.librarypage, data, 'h2', callback)
    },
    //资源库引用资源
    libraryreference(data, callback) {
        http.post(API.urls.libraryreference, data, 'h2', callback)
    },
    //新建文件夹或者上传资源
    librarysave(data, callback) {
        http.post(API.urls.librarysave, data, 'file', callback, 'file', [])
    },
    //编辑文件夹或者资源
    libraryupdate(data, callback) {
        http.post(API.urls.libraryupdate, data, 'file', callback, 'file', [])
    },
    //视频上传阿里云
    getlibraryvideo(data, callback) {
        http.get(API.urls.getlibraryvideo, data, 'h2', callback)
    },
    //视频上传阿里云
    getLibraryAliyunZip(data, callback) {
        http.get(API.urls.getLibraryAliyunZip, data, 'h2', callback)
    },
    //班级内文件夹的转移
    resourceMove(data, callback) {
        http.post(API.urls.resourceMove, data, 'h2', callback)
    },
    //查询班级下的文件夹
    resourceFolderlist(data, callback) {
        http.get(API.urls.resourceFolderlist, data, 'h2', callback)
    },
}