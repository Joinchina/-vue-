import API from '@/global/resource'
import http from '@/global/request'

export default {
    //删除栏目
    helpColumndelete(data, callback) {
        http.post(API.urls.helpColumndelete, data, 'h2', callback)
    },

    //获取栏目列表
    helpColumnlist(data, callback) {
        http.get(API.urls.helpColumnlist, data, 'h2', callback)
    },

    //创建栏目
    helpColumnsave(data, callback) {
        http.post(API.urls.helpColumnsave, data, 'h2', callback)
    },
    //阿里云视频上传
    helpaddvideo(data, callback) {
        http.get(API.urls.helpaddvideo, data, 'h2', callback)
    },
    //阿里云图片上传
    helpaddimg(data, callback) {
        http.get(API.urls.helpaddimg, data, 'h2', callback)
    },
    //保存修改文章
    postarticle(data, callback) {
        http.post(API.urls.postarticle, data, 'file', callback, 'file', [])
    },
    //通过栏目id获取栏目下的文章
    gethelpArticle(data, callback) {
        http.get(API.urls.gethelpArticle, data, 'h2', callback)
    },
    //通过文章id获取文章
    getArticle(data, callback) {
        http.get(API.urls.getArticle, data, 'h2', callback)
    },
    //通过栏目id删除文章
    Deletearticle(data, callback) {
        http.post(API.urls.Deletearticle, data, 'h2', callback)
    },
    //文章拍讯
    sorthelparticle(data, callback) {
        http.post(API.urls.sorthelparticle, data, 'h2', callback)
    },
}