<template>
    <div :class="{root:true,vipOrg:vipAccount}">
        <div class="accountHead">
            <vHead></vHead>
            <p class="orgBaseInfo">
                <img v-if="accountData.logo" :src="accountData.logo" alt="">
                <img v-else src="../../assets/img/common/avatar0.png" alt="">
                <span>{{accountData.name}}</span>
                <img v-if="vipAccount" data-v-e54f4304="" src="/static/img/vipLogo.png" alt="" class="vip-logo">
            </p>
        </div>
        <div class="bottomBox">
            <div class="vipInfoBox firstBox">
                <p class="title">
                    <span><em></em>机构合作方案<em></em></span>
                </p>
                <div class="infos">
                    <div class="item">
                        <p class="detail">{{vipAccount ? "VIP版" : "免费版"}}</p>
                        <span>合作类型</span>
                    </div>
                    <div class="item">
                        <p class="detail">{{accountData.startDate}}</p>
                        <span>合作开始日期</span>
                    </div>
                    <div class="item" v-if="vipAccount">
                        <p class="detail">{{accountData.endDate}}
                            <span class="vipAttention" v-if="vipDataRange<60">剩余{{vipDataRange}}天哦</span>
                        </p>
                        <span>合作结束时间</span>
                    </div>
                    <div class="item">
                        <span class="vipBtn" @click="vipApplyOrContract">{{vipAccount?"申请续约":"申请VIP版"}}</span>
                    </div>
                </div>
            </div>

            <div class="vipInfoBox">
                <p class="title">
                    <span><em></em>功能剩余<em></em></span>
                </p>
                <el-table
                    :data="tableData"
                    border
                    style="width: 70%;margin: 0 auto;">
                    <el-table-column
                    prop="date"
                    label="功能"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="value"
                    label="剩余或限制条件">
                        <template slot-scope="scope">
                            <span :class="{attention: (scope.row.type == 'stuNum' && Number(scope.row.value)<51) || (scope.row.type == 'liveTime' && getCha(accountData.liveTime,accountData.useLiveTime)<7200) || (scope.row.type == 'storage' && getCha(accountData.storageSpace,accountData.useStorageSpace)<524288000)}">{{scope.row.value}}</span>
                            <router-link v-if="['liveTime','stuAttachment','storage','onlineCompulsory'].includes(scope.row.type)|| (scope.row.type=='stuNum'&&accountData.studentCount!=-1) || (scope.row.type=='courseElective'&&!vipAccount) || (scope.row.type=='monitorSMS'&&!vipAccount) || (scope.row.type=='onlineElective'&&!accountData.onlineSelectCourse) || (scope.row.type=='export'&&!vipAccount) || (scope.row.type=='expert'&&!vipAccount)" :to="{ path: '/orgAccount/dealFunc', query: { orgId: accountData.id, type : scope.row.type }}" target="_blank" tag="a">
                                <span :class="{ opraBtn : true , applyBtn : scope.row.icon=='apply'}">
                                    {{scope.row.btnText}}
                                </span>
                            </router-link>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div class="vipInfoBox">
                <p class="title">
                    <span><em></em>其他常见问题<em></em></span>
                </p>
                <ul class="questionList">
                    <li>
                        <p class="question">
                            <span>Q：</span>
                            <em>VIP版与免费版有什么区别？</em>
                        </p>
                        <p class="answer">
                            <span>答：</span>
                            <a href="javascript:;" @click="toDealFunc" target="_blank" rel="noopener noreferrer">请点击查看具体的功能区别</a>
                        </p>
                    </li>
                </ul>
            </div>
        </div>
        
        <!-- vip申请/续约 -->
        <vipApply :vipApplyDialog.sync="vipApplyVisible" :orgName="accountData.name" :orgId="accountData.id" :vipAccount="vipAccount"></vipApply>
    </div>
</template>

<script>
    import vHead from 'components/header/header';
    import vipApply from "components/orgAccount/vipApply"
    import httpRequest from '@/model/orgAccount/index'

    export default {
        data() {
            return {
                fields : ['学员数量','选修课','直播时长','学员上传附件','任务督促短信','网络必修课','网络选修课','存储空间','报告导出功能','专家库信息查看及联系',],
                tableData : [],
                vipAccount : false,                  // 机构vip
                vipApplyVisible : false,             // vip申请开通或续约弹层
                accountData : {},                    // 机构信息
                addText : "增加",
                applyText : "申请开通",
                vipDataRange: 0,

            }
        },
        created(){
            this.getAccountInfo();
        },
        methods:{

            vipApplyOrContract(){
                this.vipApplyVisible = true;
            },

            // 获取机构账户信息
            getAccountInfo(){
                let data = {
                    orgId: localStorage.orgId?JSON.parse(localStorage.orgId).identification: this.$route.query.orgId ? this.$route.query.orgId : "",
                    clazzId: this.$route.query.clazzId
                }
                httpRequest.getAccountInfo(data,(res)=>{
                    console.log(res);
                    if(res.status==200){
                        this.vipAccount = res.data.vip;
                        this.accountData = res.data;
                        this.vipDataRange = Math.ceil(this.getCha(new Date(this.accountData.endDate).getTime(),new Date(this.accountData.startDate).getTime())/1000/60/60/24);
                        //this.tableData[0].value = ( this.accountData.studentCount ? this.accountData.studentCount : 0 ) - ( this.accountData.useStudentCount ? this.accountData.useStudentCount : 0 );
                        for( let item of this.fields){
                            let obj = {};
                            switch (item) {
                                case "学员数量":
                                    obj.value = this.accountData.studentCount == -1 ? "无限制" :this.getCha(this.accountData.studentCount,this.accountData.useStudentCount);
                                    obj.btnText = this.addText+'名额';
                                    obj.icon = "add";
                                    obj.type = "stuNum";
                                    break;
                                case "选修课":
                                    obj.value = this.vipAccount ? "有" : "无";
                                    obj.btnText = this.applyText;
                                    obj.icon = "apply";
                                    obj.type = "courseElective";
                                    break;
                                case "直播时长":
                                    obj.value = this.formatSeconds(this.getCha(this.accountData.liveTime,this.accountData.useLiveTime));
                                    obj.btnText = '增加时长';
                                    obj.icon = "add";
                                    obj.type = "liveTime";
                                    break;
                                case "学员上传附件":
                                    obj.value = `文件：${ this.bytesToSize(this.accountData.studentDocSize) }/文件，视频：${ this.bytesToSize(this.accountData.studentVideoSize) }/文件`;
                                    obj.btnText = this.addText+'限制';
                                    obj.icon = "add";
                                    obj.type = "stuAttachment";
                                    break;
                                case "任务督促短信":
                                    obj.value = this.vipAccount ? "无限制" : "无";
                                    obj.btnText = this.applyText;
                                    obj.icon = "apply";
                                    obj.type = "monitorSMS";
                                    break;
                                case "网络必修课":
                                    obj.value = `${ this.accountData.onlineCourseCount }门/班`;
                                    obj.btnText = this.addText;
                                    obj.icon = "add";
                                    obj.type = "onlineCompulsory";
                                    break;
                                case "网络选修课":
                                    obj.value = this.accountData.onlineSelectCourse ? "无限制" : "无";
                                    obj.btnText = this.applyText;
                                    obj.icon = "apply";
                                    obj.type = "onlineElective";
                                    break;
                                case "存储空间":
                                    obj.value = `${this.bytesToSize(this.getCha(this.accountData.storageSpace,this.accountData.useStorageSpace))}`;
                                    obj.btnText = this.addText;
                                    obj.icon = "add";
                                    obj.type = "storage";
                                    break;
                                case "报告导出功能":
                                    obj.value = this.vipAccount ? "无限制" : "无";
                                    obj.btnText = this.applyText;
                                    obj.icon = "apply";
                                    obj.type = "export";
                                    break;
                                case "专家库信息查看及联系":
                                    obj.value = this.vipAccount ? "无限制" : "无";
                                    obj.btnText = this.applyText;
                                    obj.icon = "apply";
                                    obj.type = "expert";
                                    break;
                                default:
                                    break;
                            }
                            obj.date = item;
                            this.tableData.push(obj)
                            
                        }
                    }
                })
            },
            
            // 格式化秒
            formatSeconds(value) {
                let secondTime = parseInt( value ); // 秒
                let minuteTime = 0; // 分
                let hourTime = 0; // 小时
                if(secondTime == NaN || secondTime == 0) return 0;
                if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
                    //获取分钟，除以60取整数，得到整数分钟
                    minuteTime = parseInt( secondTime / 60 );
                    //获取秒数，秒数取佘，得到整数秒数
                    secondTime = parseInt( secondTime % 60 );
                    //如果分钟大于60，将分钟转换成小时
                    if(minuteTime > 60) {
                        //获取小时，获取分钟除以60，得到整数小时
                        hourTime = parseInt( minuteTime / 60 );
                        //获取小时后取佘的分，获取分钟除以60取佘的分
                        minuteTime = parseInt( minuteTime % 60 );
                    }
                }
                let result = secondTime != 0 ? (secondTime + "秒") : "";
    
                if( minuteTime > 0 ) {
                    result = minuteTime + "分" + result;
                }
                if( hourTime > 0 ) {
                    result = hourTime + "小时" + result;
                }
                return result;
            },

            // 格式化字节
            bytesToSize(bytes) {
                if (bytes === 0 || !bytes) return '0 B';
                let baseUnit = 1024,
                    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                    index = Math.floor(Math.log(bytes) / Math.log(baseUnit));
            
                return (bytes / Math.pow(baseUnit, index)).toFixed(2) + ' ' + sizes[index];
            },

            // 单一功能点跳转
            toDealFunc(type){
                let originUrl = "https://10.98.24.67:10003";
                if( window.location.href.indexOf("mgr.shixunbao.cn")>-1 ){
                    originUrl = "https://m.shixunbao.cn";
                }
                window.open(`${originUrl}/difference?orgId=${this.accountData.id}&isVip=${Number(this.vipAccount)}`);
            },

            getCha(param1,param2){
                let num1 = param1 ? Number(param1) : 0;
                let num2 = param2 ? Number(param2) : 0;
                if(num1 > num2){
                    return num1 - num2
                }else{
                    return 0
                }
             }
        },
        components:{
            vHead,
            vipApply,
        }
    }
</script>

<style lang="less" scoped> 
    @import "../../assets/reset-element-ui/item.css";
    @import "../../assets/reset-element-ui/form.css";
    @import "../../assets/less/btn-search.less";
    @import "../../assets/reset-element-ui/password.css";
    @import "../../assets/less/icon.less";
    .passwordEdit.orgDropDown{
        width: 250px;
        padding-right:10px; 
        .el-dropdown-menu__item{
        color: #333 !important;
        &.vipInfo{
            background: url("../../assets/img/expert/vipLogo.png") center right no-repeat;
            background-size: 36px 18px;
        }
        .rightArrow{
            float: right;
            font-size: 16px;
            margin-right: -20px;
            margin-top: 10px;
            font-weight: bold;
            color:#333;
        }
        .toOpen{
            font-size: 14px;
            color: #4A90E2;
            float: right;
        }
        }
        
        .orgImg{
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 6px;
        }
        .orgText{
            font-size: 16px;
            color: #333333;
            vertical-align: middle;
        }
    }
    .accountHead{
        height: 200px;
        background-image: url('../../assets/img/common/accountHead.png');
        background-repeat: no-repeat;
        background-position: center top;
        background-size:cover;
        .orgBaseInfo{
            text-align: center;
            margin-top: 30px;
            img{
                width: 50px;
                height: 50px;
                border-radius: 50%;
                vertical-align: middle;
            }
            span{
                font-size: 24px;
                color: #eee;
                margin-left: 8px;
            }
        }
    }
    .vipOrg{
        .orgBaseInfo{
            span{
                color: #E6BC6C;
            }
            .vip-logo{
                width: 36px;
                height: 18px;
                margin-left: 10px;
                border-radius: 0;
                vertical-align: baseline;
            }
        }
        .vipInfoBox .infos .item .detail{
            position: relative;
            color: #612D00;
            .vipAttention{
                position: absolute;
                top: -20px;
                right: 40px;
                background: #FF5200;
                border-radius: 10px 6px 6px 0;
                font-size: 12px;
                color: #FFFFFF;
                padding: 2px 6px;
            }
        }
        .firstBox{
            background-image: linear-gradient(90deg, #F1DCB7 0%, #E0AE4D 100%);
        }
    }
    .bottomBox{
        width: 1000px;
        margin: 0 auto;
        margin-top: -50px;
    }
    .title{
        text-align: center;
        font-size: 20px;
        color: #333333;
        font-weight: bold;
        padding: 20px 0 20px;
        em{
            display: inline-block;
            width: 50px;
            height: 1px;
            background: -webkit-linear-gradient(left, transparent, #A6A6A6); /* Safari 5.1 - 6.0 */
            background: -o-linear-gradient(left, transparent, #A6A6A6); /* Opera 11.1 - 12.0 */
            background: -moz-linear-gradient(left, transparent, #A6A6A6); /* Firefox 3.6 - 15 */
            background: linear-gradient(left,transparent,#A6A6A6);
            vertical-align: super;
            margin: 0 10px;
            &:last-child{
                background: -webkit-linear-gradient(right, transparent, #A6A6A6); /* Safari 5.1 - 6.0 */
                background: -o-linear-gradient(right, transparent, #A6A6A6); /* Opera 11.1 - 12.0 */
                background: -moz-linear-gradient(right, transparent, #A6A6A6); /* Firefox 3.6 - 15 */
                background: linear-gradient(right,transparent,#A6A6A6);
            }
        }
    }
    .vipInfoBox{
        border-radius: 10px;
        background: #fff;
        margin-bottom: 20px;
        padding-bottom: 20px;
        .infos{
            display: flex;
            justify-content: middle;
            .item{
                flex: 1;
                text-align: center;
                vertical-align: middle;
                .detail{
                    font-size: 20px;
                    color: #009791;
                    padding-bottom: 10px;
                }
                span{
                    font-size: 16px;
                    color: #666666;
                }
                .vipBtn{
                    width: 120px;
                    padding: 6px 0;
                    display: inline-block;
                    text-align: center;
                    color: #fff;
                    font-size: 16px;
                    background-image: linear-gradient(90deg, #4AC9AA 0%, #1CB6C8 100%);
                    border-radius: 30px;
                    cursor: pointer;
                    user-select: none;
                }
            }
            
        } 
        .questionList{
            font-size: 16px;
            width: 90%;
            margin: 0 auto;
            .question{
                span{
                    color: #FD7E23;
                }
                em{
                    color: #151515;
                }
                margin-bottom: 20px;
            }
            .answer{
                span{
                    color: #333333;;
                }
                a{
                    color: #1077D7;
                    text-decoration: underline;
                }
            }
        }
        .opraBtn{
            font-size: 14px;
            color: #009791;
            float: right;
            margin-right: 30px;
            width: 76px;
            padding-left: 18px;
            background: url('../../assets/img/acount/add.png') left center no-repeat;
            background-size: 13px 13px;
            cursor: pointer;
            user-select: none;
        }
        .applyBtn{
            background: url('../../assets/img/acount/applyOpen.png') left center no-repeat;
            background-size: 13px 13px;
        }
    }
    .attention{
        color: #FD7E23;
    }
</style>

<style lang="less">
    .vipInfoBox{
        .el-table thead.has-gutter th,.el-table__row td:nth-child(1){
            background: #f7f8fb;
            color: #202D3D;
        }
    }
</style>

