import API from '@/global/resource'
import http from '@/global/request'
export default {
  /**
   * 分组
   **/
  // 自定义分组
  groupCustom (data, callback) {
    http.post(API.urls.groupCustom, data, 'h2', callback)
  },
  // 解散小组
  groupDelete (data, callback) {
    http.post(API.urls.groupDelete, data, 'h2', callback)
  },
  // 班级下是否已存在分组
  groupExists (data, callback) {
    http.post(API.urls.groupExists, data, 'h2', callback)
  },
  // 查看分组聊天
  groupChatMessage(data, callback,) {
    http.get(API.urls.groupChatMessage,  data, 'h2', callback)
  },
  // 查看分组详情
  groupFindById(data, callback,) {
    http.get(API.urls.groupFindById,  data, 'h2', callback)
  },
  // 指定分组组长
  groupLeaderAssign(data, callback) {
    http.post(API.urls.groupLeaderAssign,  data, 'h2', callback)
  },
  // 班级小组列表
  groupList(data, callback) {
    http.get(API.urls.groupList,  data, 'h2', callback)
  },
  // 查看分组详情
  groupFindById(data, callback) {
    http.get(API.urls.groupFindById,  data, 'h2', callback)
  },
  // 随机分组
  groupRandomCreate(data, callback) {
    http.post(API.urls.groupRandomCreate,  data, 'h2', callback)
  },
  // 未分组学员列表
  groupUngroupedNo(data, callback) {
    http.get(API.urls.groupUngroupedNo,  data, 'h2', callback)
  },
  // 未分组学员列表（分页）
  groupUngrouped(data, callback) {
    http.get(API.urls.groupUngrouped,  data, 'h2', callback)
  },
  // 编辑分组详情
  groupUpdate(data, callback) {
    http.post(API.urls.groupUpdate, data, 'file', callback, 'file')
  },
  // 小组成员添加
  groupUserAdd(data, callback) {
    http.post(API.urls.groupUserAdd,  data, 'h2', callback)
  },
  // 小组成员移出
  groupUserDelete(data, callback) {
    http.post(API.urls.groupUserDelete,  data, 'h2', callback)
  },
  // 小组成员列表
  groupUserList(data, callback) {
    http.get(API.urls.groupUserList,  data, 'h2', callback)
  },
  // 小组成员调组
  groupUserMove(data, callback) {
    http.post(API.urls.groupUserMove,  data, 'h2', callback)
  },
  // 小组积分排名列表
  getRanklist(data, callback) {
    http.get(API.urls.getRanklist,  data, 'h2', callback)
  },

  // 导入分组
  groupImport(data, callback) {
    http.post(API.urls.groupImport, data, 'file', callback, 'file')
  }
}
