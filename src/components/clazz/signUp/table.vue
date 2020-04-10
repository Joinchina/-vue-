<template>
    <div class="tableBox">
        <span class="qrCodeBtn" @click="dialogSuccess=true"><i></i>二维码</span>
        <el-dropdown class="editDropDown" trigger="click" @command="editHandler">
            <span class="editButton el-dropdown-link">编辑<i class="el-icon-caret-bottom el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="basicInfo">编辑报名信息</el-dropdown-item>
                <el-dropdown-item command="singUpFields">编辑报名字段</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <div class="basicInfoBox">
            <h3 class="signupTitle">{{setInfo.title}}</h3>
            <p class="endTime"><i class="el-icon-time"></i>报名截止时间：{{setInfo.endTime}}</p>
            <p :class="{endTime:true,introText:true,notClip:showMore}"><i class="el-icon-document"></i>{{setInfo.description}}</p>
            <span round :class="{'showMore':showMore,'packUp':!showMore}" @click="showToogle" v-if="textPShow">{{showMore?"展示更多":"收起"}}<span class="answer-more"></span></span>
        </div>
        <div class="fieldInfoBox">
            <div class="serchItems">
                <el-input placeholder="请输入关键字" v-model="searchParameter.value" class="input-with-select" @keydown.enter.native="clickSearch($event,searchParameter.value)">
                    <el-select v-model="searchParameter.key" slot="prepend" placeholder="请选择">
                        <el-option
                            v-for="(item,index) in canSearchFildes"
                            :key="index"
                            :label="item.name"
                            :value="item.code">
                        </el-option>
                    </el-select>
                    <el-button slot="append" icon="el-icon-search" @click="clickSearch"></el-button>
                </el-input> 
                <el-select
                    v-model="searchParameter.signUpStatus"
                    @change="searchPages"
                    placeholder="全部状态">
                    <el-option
                        v-for="(item,index) in signUpStatusOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <div class="searchBtn">
                    <span class="general refuseBtn" @click.stop="refuseStudent">拒绝</span>
                    <el-dropdown @command="importantHandler">
                        <span class="accessBtn el-dropdown-link">通过并导入<i class="el-icon-caret-bottom el-icon--right"></i></span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="batch">通过并导入</el-dropdown-item>
                            <el-dropdown-item command="all">一键全部导入</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <span class="general exportBtn" @click.stop="exportStudent">导出</span>
                </div>
            </div>

            <el-table
                :data="tableData"
                ref="tableRef"
                v-loading="loadingTable"
                style="width: 100%;text-align: center;"
                @selection-change="handleSelectionChange">
                <el-table-column
                type="selection"
                label="全选"
                prop="index"
                fixed="left"
                :selectable="selectable"
                width="55">
                </el-table-column>
                <el-table-column
                label="状态"
                width="150">
                <template slot-scope="scope">
                    <span :class="{failed:scope.row.signUpStatus=='FAILED'}">{{scope.row.signUpStatusName}}</span>
                </template>
                </el-table-column>
                <el-table-column label="审核" width="300" fixed="left">
                    <span>dqwd </span>
                    <template slot-scope="scope">
                        
                        <el-button size="small" v-if="scope.row.signUpStatus=='REVIEWING'" @click.stop="importOne(scope.row)">通过并导入</el-button>
                        <el-button size="small" v-if="scope.row.signUpStatus=='REFUSED'" @click.stop="recoverStatus(scope.row)">恢复</el-button>
                        <el-button size="small" v-if="scope.row.signUpStatus=='FAILED'" @click.stop="importOne(scope.row)">重新导入</el-button>
                        <el-button size="small" @click.stop="editStudentHandle(scope)" v-if="scope.row.signUpStatus=='FAILED'||scope.row.signUpStatus=='REVIEWING'">编辑</el-button>
                        <el-button size="small" v-if="scope.row.signUpStatus=='REVIEWING'" @click="refuseSingle(scope.row)">拒绝</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                v-for="(item,index) in tableHeadFields"
                :key='index'
                :prop="item.code"
                :label="item.name"
                :show-overflow-tooltip="true"
                width="150">
                </el-table-column>
                <el-table-column
                prop="reason"
                label="备注"
                :show-overflow-tooltip="true"
                width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.reason|filterReason}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="dataCountInfo">
                <span>共{{totalCounts}}条 每页{{searchParameter.size}}条</span>
            </div>
            <div class="tabpage">
                <el-pagination
                    layout="prev,pager,next"
                    :page-size="20"
                    :total="totalCounts"
                    @current-change="handleCurrentChange">
                </el-pagination>
            </div>
        </div>
        
        <!-- 编辑基本信息弹窗 -->
        <editBasic :dialogBasicInfo.sync="dialogBasicInfo" :setInfo="setInfo" @updateInfo="hasSetInfo"></editBasic>

        <!-- 编辑字段信息弹窗 -->
        <editField :dialogField.sync="dialogField" :setInfo="setInfo" @updateInfo="hasSetInfo" @updateInfofiled="tableFields" :totalCounts="totalCounts"></editField>

        <!-- 二维码弹窗 -->
        <qrPop :dialogSuccess.sync="dialogSuccess" :setInfo="setInfo"></qrPop>

        <!-- 拒绝弹窗 -->
        <refusePop :dialogRefuse.sync="dialogRefuse" :tableSelect="tableSelect" @updateInfo="searchPages" :refuseOne="refuseOne" :refuseFlag="refuseFlag"></refusePop>

        <!-- 编辑学员弹窗 -->
        <editStudent :dialogStudentInfo.sync="dialogStudentInfo" :setInfo="setInfo" :needEditStuInfo="needEditStuInfo" @updateInfo="searchPages"></editStudent>
    </div>
</template>

<script>
    import httpFetch from '@/model/clazz/signUp'
    import editBasic from './editBasic'
    import editField from './editField'
    import qrPop from './qrPop'
    import refusePop from './refusePop'
    import editStudent from './editStudent'
    export default {
        data(){
            return {
                signUpStatusOptions:[
                    {label:'全部状态',value:''},
                    {label:'待审核',value:'REVIEWING'},
                    {label:'已拒绝',value:'REFUSED'},
                    {label:'导入失败',value:'FAILED'},
                    {label:'已导入',value:'SUCCESSED'},
                ],
                tableData:[],
                totalCounts:0,
                canSearchFildes:[],
                tableHeadFields:[],
                searchParameter:{
                    value:'',
                    key:'',
                    signUpStatus:"",
                    number: 1,
                    size: 20
                },
                dialogBasicInfo:false,
                dialogField:false,
                dialogSuccess:false,
                dialogRefuse:false,
                dialogStudentInfo: false,
                loadingTable:false,
                refuseFlag:false,
                setInfo: {},
                needEditStuInfo:{},
                refuseOne:null,
                tableSelect:[],      //表格选中
                showMore: true,
                textPShow: false
                
            }
        },
        created(){
            this.tableFields();
            this.getSearchAble();
            this.hasSetInfo();
        },
        methods:{
            // 获取班级报名设置的字段---表头
            tableFields(){
                httpFetch.selectedFields({clazzId: this.$route.query.clazzId},res=>{
                    if(res.status==200){
                        this.tableHeadFields = res.data;
                        this.searchPages(true);
                    }else{
                        this.$message.error(res.message);
                    }
                })
            },
            showToogle(){
                this.showMore=!this.showMore;
            },
            // 获取可搜索的字段
            getSearchAble(){
                httpFetch.searchableFields({clazzId: this.$route.query.clazzId},res=>{
                    if(res.status==200){
                        res.data.unshift({code:"name",name:"姓名"},{code:"phone",name:"手机号"},{code:"sex",name:"性别"});
                        this.canSearchFildes = res.data;
                    }else{
                        this.$message.error(res.message);
                    }
                })
            },
            clickSearch(){
                if(this.searchParameter.key==""){
                    this.$message({
                        showClose: true,
                        message: '请先选择查询字段',
                        type: 'warning'
                    });
                    return
                }
                this.searchPages();
            },
            //搜索列表
            searchPages(){
                let data = this.searchParameter;
                this.loadingTable=true
                data.clazzId=this.$route.query.clazzId;
                httpFetch.pageSearch(data,res=>{
                    this.loadingTable=false;
                    if(res.status==200){
                        this.totalCounts=res.data.totalElements
                        this.tableData = res.data.content;
                    }else{
                        this.$message.error(res.message);
                    }
                })
            },
            //enter事件
            enterHandle(e,n){
                console.log(e);
                console.log(n)
                console.log(this.searchParameter)
            },
            handleCurrentChange(num){
                this.searchParameter.number=num;
                this.searchPages();
            },
            editHandler(command){
                if(command=="basicInfo"){
                    this.dialogBasicInfo=true;
                }else{
                    this.dialogField=true;
                }
            },
            editStudentHandle(slot){
                console.log(slot);
                this.needEditStuInfo= slot.row;
                this.dialogStudentInfo=true;
            },
            //班级已设置信息
            hasSetInfo(){
                let data ={
                    clazzId: this.$route.query.clazzId,
                    includeFields:true,
                }
                httpFetch.viewInfo(data,res=>{
                    if(res.status==200){
                        this.setInfo= res.data;
                        setTimeout(()=>{
                            let textP = document.querySelector('.introText');
                            this.textPShow=textP.scrollHeight-textP.clientHeight>10;
                        },700)
                    }else{
                        this.$message.error(res.message);
                    }
                })
            },
            //表头选中
            handleSelectionChange(val){
                this.tableSelect=val;
            },
            //判断表头是否能选中
            selectable(row, index){
                return row.signUpStatus=="REVIEWING";
            },
            //拒绝选中的学员
            refuseStudent(){
                if(this.tableSelect.length==0){
                    this.$message.error("请先选择学员信息");
                    return
                }
                this.refuseFlag=false;
                this.dialogRefuse=true;
            },
            //通过并导入
            importantHandler(command){
                let data ={
                    clazzId:this.$route.query.clazzId,
                };
                if(command=="batch"){
                    //批量导入
                    if(this.tableSelect.length==0){
                        this.$message.error("请先选择学员信息");
                        return
                    }
                    this.loadingTable = true;
                    data.ids=[];
                    this.tableSelect.forEach(item=>{
                        data.ids.push(item.identification);
                    })
                    httpFetch.batchImport(data,res=>{
                        this.loadingTable=false;
                        if(res.status==200){
                            this.searchPages();
                            this.$message.success('成功导入'+res.data.successCount+'条数据，失败'+res.data.failedCount+'条');
                            
                        }else{
                            this.$message.error(res.message);
                        }
                    })
                }else if(command=="all"){
                    //全部导入
                    this.loadingTable = true;
                    httpFetch.allImport(data,res=>{
                        this.loadingTable=false;
                        if(res.status==200){
                            this.searchPages();
                            this.$message.success('成功导入'+res.data.successCount+'条数据，失败'+res.data.failedCount+'条');
                        }else{
                            this.$message.error(res.message);
                        }
                    })
                }
            },
            //导出报名学员名单
            exportStudent(){
                if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
                httpFetch.exportSignUp({clazzId:this.$route.query.clazzId});
            },
            /**
             * 恢复报名状态
             */
            recoverStatus(row){
                httpFetch.recoverSignUp({clazzId:row.clazzId,identification:row.identification},res=>{
                    if(res.status==200){
                        this.searchPages();
                    }else{
                        this.$message.error(res.message);
                    }
                });
            },
            /**
             * 拒绝单个学员
             */
            refuseSingle(row){
                this.refuseOne=row;
                this.refuseFlag = true;
                this.dialogRefuse=true;
            },
            /**
             * 导入单个学员
             */
            importOne(row){
                console.log(row);
                httpFetch.importSingle({clazzId:row.clazzId,identification:row.identification},res=>{
                    if(res.status==200){
                        this.searchPages();
                    }else{
                        this.$message.error(res.message);
                    }
                });
            },
        },
        filters:{
            /**
             * 拒绝原因过滤
             */
            filterReason:(value)=>{
                if(typeof value =="string"&&value.indexOf('^')>-1){
                    let arr = value.split("^");
                    if(Boolean(arr[1])){
                        return arr[1]
                    }else{
                       return arr[0];
                    }
                }else{
                    return value;
                }
                console.log(value);
            }
        },
        components:{
            editBasic,
            editField,
            qrPop,
            refusePop,
            editStudent,
        },
    }
</script>

<style lang="less" scoped>
    .editButton{
        background: rgba(51,191,169,0.06);
        border: 1px solid #84CAC3;
        border-radius: 3px;
        color: #009791;
        display: block;
        width: 110px;
        height: 36px;
        font-size: 16px;
        line-height: 36px;
        text-align: center; 
        transition: all .2s linear;
        cursor: pointer;
        i{
            float: right;
            height: 100%;
            width: 30px;
            border-left: 1px solid #C6E4E0;
            font-size: 16px;
            line-height: 32px;
        }
    }
    .editButton:hover{
        background: rgba(51,191,169,0.24);
        color: #009791;
    }
    .qrCodeBtn{
        margin-top: -48px;
        margin-left: 10px;
        display: block;
        float: right;
        background: rgb(240,243,247);
        color: rgb(64,153,247);
        width: 110px;
        height: 36px;
        font-size: 16px;
        line-height: 36px;
        text-align: center; 
        transition: all .2s linear;
        border: 1px solid #99C0E4;
        border-radius: 3px;
        cursor: pointer;
        i{
            display: inline-block;
            width: 18px;
            height: 18px;
            background: url(../../../../src/assets/img/clazz/qrCode.png) center center no-repeat;
            background-size: 100% 100%;
            vertical-align: text-bottom;
            margin-right: 6px;
        }
    }
    .qrCodeBtn:hover{
        background: rgb(229,241,254);
    }
    .basicInfoBox{
        padding: 20px;
        background: #FFFFFF;
        margin-bottom: 20px;
        position: relative;
        .signupTitle{
            font-size: 20px;
            color: #333333;
            border-left: 4px solid #35A69D;
            height: 20px;
            font-weight: 600;
            text-indent: 10px;
            line-height: 20px;
            margin-bottom: 20px;
        }
        .endTime{
            font-size: 14px;
            color: #666666;
            line-height: 20px;
            margin-bottom: 10px;
            width: 92%;
            i{
                font-size: 16px;
                margin-right: 6px;
                vertical-align: text-top;
            }
        }
        .answer-more{
            background: url("../../../assets/img/icon/icon-more-t.png") no-repeat;
            width: 13px;
            height: 13px;
            display: inline-block;
            vertical-align: middle;
            transition: all .3s linear;
        }
        // .notClip{
        //     display: -webkit-box;
        //     -webkit-line-clamp: 2;
        //     /* autoprefixer: off */
        //     -webkit-box-orient: vertical;
        //     /* autoprefixer: on */
        //     overflow: hidden;
        // }
        .notClip{
            position: relative; line-height: 20px; max-height: 40px;overflow: hidden;
        }
        .notClip:after{
            content: "..."; position: absolute; bottom: 0; right: 0px; padding-left: 50px;
            background: -webkit-linear-gradient(left, transparent, #fff 80%);
            background: -o-linear-gradient(right, transparent, #fff 70%);
            background: -moz-linear-gradient(right, transparent, #fff 65%);
            background: linear-gradient(to right, transparent, #fff 70%);
        }
        .showMore,.packUp{
            cursor: pointer;
            position: absolute;
            right: 20px;
            bottom: 30px;
            color: #399EFE;
        }
        .packUp{
            // background: url(../../../assets/img/clazz/packUp.png) center center no-repeat;
            // background-size: 100% 100%;
            .answer-more{
                transform: rotate(180deg);
            }
            
        }
    }
    .fieldInfoBox{
        padding: 20px;
        background: #FFFFFF;
        margin-bottom: 20px;
        .serchItems{
            margin-bottom: 20px;
        }
        .searchBtn{
            float: right;

            .refuseBtn{
                background: #F79C61;
                transition: background .2s linear;
                margin-right:6px;
            }
            .refuseBtn:hover{
                background: #FD7E23;
            }
            .exportBtn{
                background: #399EFE;
                transition: background .2s linear;
                position: relative;
            }
            .exportBtn::after{
                position: absolute;
                right: -6px;
                top: -8px;
                width: 27px;
                height: 15px;
                content: "";
                background: url("../../../assets/img/expert/vipLogo.png") center center no-repeat;
                background-size: 27px 14px;
            }
            .exportBtn:hover{
                background:  #368BE2;
            }
            .general{
                width: 80px;
                height: 36px;
                text-align: center;
                line-height: 36px;
                display: inline-block;
                font-size: 16px;
                color: #FFFFFF;
                border-radius: 4px;
                cursor: pointer;
                margin-left: 6px;
            }
            .accessBtn{
                background: #35A69D;
                border-radius: 3px;
                color: #ffffff;
                display: inline-block;
                width: 140px;
                height: 36px;
                font-size: 16px;
                line-height: 36px;
                text-align: center; 
                transition: background .2s linear;
                cursor: pointer;
                i{
                    float: right;
                    height: 100%;
                    width: 30px;
                    border-left: 1px solid #68BCB5;
                    font-size: 16px;
                    line-height: 32px;
                }
            }
            .accessBtn:hover{
                background:  #009791;
            }
        }
    }
    .dataCountInfo{
        overflow: hidden;
        span{
            font-size: 14px;
            color: #666666;
            float: right;
            margin: 20px 0;
        }
    }
    .failed{
        color: #D0021B;
    }
</style>
<style lang="less">
    .tableBox{
        .editDropDown{
            float: right;
            margin-top: -48px;
            margin-right: 120px;
        }
        .el-table{
            .cell{
                text-align:center;
            }
            thead th{
                background: rgb(238,241,246)
            }
        }
        .el-pager{
            .active{
                background: #35A69D;
            }
        }
        .el-table__body-wrapper.is-scrolling-left~.el-table__fixed,.el-table__fixed{
            box-shadow: 0 0 10px rgba(0,0,0,.12);
        }
        .el-input-group__prepend div.el-select .el-input__inner{
            background-color:#fff;
            border-top: 1px solid rgb(220, 223, 230);
            border-bottom: 1px solid rgb(220, 223, 230);
            border-color:rgb(220, 223, 230) !important;
            color: #333;
            border-left: 0 none;
            border-right: 0 none;
        }
    }
    .fieldInfoBox{
        .el-select{
            width: 120px;
        }
        .input-with-select{
            float: left;
            width: 30%;
            margin-right: 20px;
            .el-select{
                width: 100px;
            }
        }
        .el-select input::-webkit-input-placeholder {
            color: #666;
            font-size: 14px;
            text-align: left;
        }
        .el-input-group__append{
            padding: 0 18px;
            button.el-button{
                color:#333;
                font-size: 16px;

            }
        }
    }

    .el-popper[x-placement^=bottom] .popper__arrow{
        display:none;
    }
    .el-dropdown-menu{
        padding: 0 0;
        .el-dropdown-menu__item{
            line-height: 40px;
        }
    }
</style>