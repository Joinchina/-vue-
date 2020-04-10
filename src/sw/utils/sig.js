export function sendPtoP(type) {
    let data = {};
    switch (type) {
        //学员被下线
        case 'over-connect':
            data = {
                "command": "OVER_CONNECT",
                "fromRole": "Broadcaster"
            };
            break;

            //主播踢人
        case 'kick_out':
            data = {
                "command": "KICK_OUT",
                "fromRole": "Broadcaster"
            }
            break;

            //开启全体禁言
        case 'true_off_all_mic':
            data = {
                "command": "TURN_OFF_ALL_MIC",
                "fromRole": "Broadcaster"
            }
            break;

            //解除全体禁言
        case 'turn_on_all_mic':
            data = {
                "command": "TURN_ON_ALL_MIC",
                "fromRole": "Broadcaster"
            }
            break;

            //开启单个学员禁言
        case 'turn_off_single_mic':
            data = {
                "command": "TURN_OFF_SINGLE_MIC",
                "fromRole": "Broadcaster"
            }
            break;

            //解除单个学员禁言
        case 'turn_on_single_mic':
            data = {
                "command": "TURN_ON_SINGLE_MIC",
                "fromRole": "Broadcaster"
            }
            break;

            //关闭视频
        case 'close_vedio':
            data = {
                "command": "CLOSE_VEDIO",
                "fromRole": "Broadcaster"
            }
            break;

            //打开音频
        case 'open_audio':
            data = {
                "command": "OPEN_AUDIO",
                "fromRole": "Broadcaster"
            }
            break;

            //关闭音频
        case 'close_audio':
            data = {
                "command": "CLOSE_AUDIO",
                "fromRole": "Broadcaster"
            }
            break;

            //打开视频
        case 'open_vedio':
            data = {
                "command": "OPEN_VEDIO",
                "fromRole": "Broadcaster"
            }
            break;

        default:
    }
    return JSON.stringify(data);
}

//发送聊天命令
export function sendChat(type, msg, role, avatar, time, msgType, userId,name) {
    var data = {};
    switch (type) {
        case 'singleChat':
            data = {
                "fromRole": role,
                "command": "CHAT",
                "chatMessage": {
                    "chatType": "USER",
                    "chatMessageType": "CHAT",
                    "contentType": "TXT",
                    "content": msg,
                    "role": role,
                    "avatar": avatar,
                    "time": time
                }
            }
            break;
        case 'chat':
            data = {
                "fromRole": role,
                "command": "CHAT",
                "chatMessage": {
                    "chatType": "ROOM",
                    "chatMessageType": "CHAT",
                    "contentType": "TXT",
                    "content": msg,
                    "role": role,
                    "avatar": avatar,
                    "time": time
                }

            }
            break;
        case 'notice':
            data = {
                "fromRole": role,
                "command": "CHAT",
                "chatMessage": {
                    "chatType": "ROOM",
                    "chatMessageType": "NOTICE",
                    "contentType": "TXT",
                    "content": msg,
                    "role": role
                }

            }
            break;
        case 'system':
            data = {
                "fromRole": role,
                "command": "CHAT",
                "chatMessage": {
                    "chatType": "ROOM",
                    "chatMessageType": "SYSTEM",
                    "contentType": "TXT",
                    "content": msg,
                    "role": role,
                    "userId": userId,
                    "msgType": msgType,
                    "name":name
                }

            }
            break;
    }
    console.log(data)
    return JSON.stringify(data);
}

// 发送活动状态
export function actStatus(command, type, actId, courseId) {
    var data = {};
    switch (command) {
        case 'PUBLISH_TASK':
            data = {
                "command": command,
                "fromRole": "Broadcaster",
                "ext": {
                    "type": type,
                    "taskId": actId,
                    "courseId": courseId
                }
            }
            break;
        case 'OVER_TASK':
            data = {
                "command": command,
                "fromRole": "Broadcaster",
                "ext": {
                    "type": type,
                    "taskId": actId,
                    "courseId": courseId
                }
            }
            break;
    }

    // console.log("发送活动信道信息", JSON.stringify(data));
    return JSON.stringify(data);
}
// 开启签到状态
export function startsign(command, type, actId,tix) {
    var data = {};
    switch (command) {
        case 'PUBLISH_TASK':
            data = {
                "command": command,
                "fromRole": "Broadcaster",
                "ext": {
                    "type": type,
                    "taskId": actId,
                    "tixing":tix,
                }
            }
            break;
        case 'OVER_TASK':
            data = {
                "command": command,
                "fromRole": "Broadcaster",
                "ext": {
                    "type": type,
                    "taskId": actId
                }
            }
            break;
    }
    // console.log("发送活动信道信息", JSON.stringify(data));
    return JSON.stringify(data);
}
//主播结束答题卡
export function passendanswerdata(command, type, questionId, options, result, allpeople, rightlv) {
    var data = {};
    switch (command) {
        //主播发布答题器
        case 'OVER_TASK':
            data = {
                "command": command,
                "fromRole": "Broadcaster",
                "ext": {
                    "type": type,
                    "questionId": questionId,
                    "allpeople": allpeople,
                    "options": options,
                    "result": result,
                    "correct": rightlv,
                }
            }
            break;
    }
    // console.log("发送活动信道信息", JSON.stringify(data));
    return JSON.stringify(data);
}
// 开启答题卡状态
export function publishanswer(command, type, questionId, options, result, allpeople) {
    var data = {};
    switch (command) {
        //主播发布答题器
        case 'PUBLISH_TASK':
            data = {
                "command": command,
                "fromRole": "Broadcaster",
                "ext": {
                    "type": type,
                    "questionId": questionId,
                    "options": options,
                    "result": result,
                }
            }
            break;

            //主播关闭答题器
        case 'PUBLISH_CLOSE':
            data = {
                "command": command,
                "fromRole": "Broadcaster",
                "ext": {
                    "type": type,
                    "questionId": questionId,
                }
            }
            break;
    }
    // console.log("发送活动信道信息", JSON.stringify(data));
    return JSON.stringify(data);
}
//uid截取
export function splitUid(account) {
    let str = "";
    if (account) {
        str = account.split("_")[1];
        return str;
    }
}

//删除array
export function sliceArray(array, account) {
    console.log("account");
    console.log(account);
    console.log(array);
    let ins = 0;
    if (array.length > 0) {
        array.forEach((item, index) => {
            if (item == account) {
                array.splice(index, 1);
            }
        })
        console.log('删除后');
        console.log(array);
        return array;
    } else {
        return [];
    }

}

//设置频道属性集合
export function setChannle(key, newObj, strs) {
    var obj = {
        "black": "non_access_user_list", //直播间黑名单
        "noSpeak": "non_speak_user_list", //被禁言的用户id集合
        "apply": "apply_user_list", //申请连线的用户集合
        "connected": "connected_user_list", //已连线的用户集合
        "online": "online_user_list", //在线的用户集合
        "canspeak": "can_speak", //频道内能否说话 _0_ 不可以说话全体禁言 _1_表示可说话
        "canapply": "can_apply", //学员能否申请连线 _0_ 不可以 _1_ 可以 主播上线1 下线0
        "disaudio": "connect_disaudio_list", //禁音频用户列表
        "disvideo": "connect_disvideo_list" //禁视频用户列表
    }
    let channelStrs = strs;
    if (channelStrs.trim() == "" || channelStrs.trim() == "_" || channelStrs.trim() == "__") {
        channelStrs = ''
    } else {
        if (!(/^_/.test(channelStrs))) {
            channelStrs = '_' + channelStrs
        }
        if (!(/_$/.test(channelStrs))) {
            channelStrs = channelStrs + '_'
        }
    }
    newObj.addChannelAttr(obj[key], channelStrs);

}

//成员列表当前的索引
export function indexMembers(array, account) {
    let curIndex = 0;
    array.forEach((item, index) => {
        if (item.identification == account) {
            curIndex = index;
        }
    })
    return curIndex;
}
//当前时间
export function curDate(fmt) {
    let date = new Date();
    var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "H+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
/**
 *  巡课状态
 * @param {*} command TOURCLASS_OPEN TOURCLASS_OVER
 * @param {*} courseId 
 * @param {*} userIds 学员id 集合
 * @param {*} name 发起巡课者的name
 * @param {*} uid 发起巡课者的name
 */
export function tourClassStatus(command, courseId, userIds, name, uid,currentTime) {
    var data = {};
    switch (command) {
        case 'TOURCLASS_OPEN':
            data = {
                "command": command,
                "fromRole": "Broadcaster",
                "ext": {
                    "courseId": courseId,
                    "userIds": userIds,
                    "user": {
                        "uname": name,
                        "uid": uid
                    },
                    "tourClassTime" : currentTime,
                    "deadLine" : 15,
                },
                
            }
            break;
        case 'TOURCLASS_OVER':
            data = {
                "command": command,
                "fromRole": "Broadcaster",
                "ext": {
                    "courseId": courseId,
                    "userIds": userIds,
                    "tourClassTime" : currentTime,
                },
                
            }
            break;
    }
    console.log("发送巡课信息=====", JSON.stringify(data));
    return JSON.stringify(data);
}