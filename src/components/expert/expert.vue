<template>
    <div class="z-content">
        <header>
            <heard>
                <el-dropdown class="passwordEdit" trigger="click" @command="operaterCommand">
                <span class="el-dropdown-link">
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <slot></slot>
                <el-dropdown-menu slot="dropdown"  class="passwordEdit">
                    <el-dropdown-item command="edit">
                        <i class="icon-edit-word"></i>修改密码
                    </el-dropdown-item>
                    <el-dropdown-item command="exit">
                    <i class="icon-exit"></i>退出
                    </el-dropdown-item>
                </el-dropdown-menu>
                </el-dropdown>
            </heard>
            <div class="heardtop">
                <img src="@/assets/img/expert/logo.png" alt="">
                <div class="search">
                    <input type="text" v-model="searchmodel"
                        @blur="searchdown(searchmodel)"
                        @keydown.enter.native="searchdown($event,searchmodel)"
                        placeholder="专家姓名或课程名称" @keydown.enter="searchdown(searchmodel)">
                    <button @click="searchdown(searchmodel)"><i class="icon-search-white"></i></button>
                </div>
            </div>            
        </header>
        <!-- 筛选组件 -->
        <div class="search_box">
            <searchnav @getdata="getdata" ref="deletenav"></searchnav>
        </div>
        
        <div class="infobox">
            <div class="updown">
                <div class="height" @click="sortdata">
                    <h1>课程满意度：</h1>
                    <p>{{updown}}</p>
                    <img src="../../assets/img/expert/up.png" alt="" v-if="updown=='由高到低'">
                    <img src="../../assets/img/expert/down.png" alt="" v-else>
                </div>
                <!-- 省市联动组件 -->
                <div class="shegnshi">
                    <choosearea @getcitydata="getcitydata" ref="cleardata"></choosearea>
                </div>
            </div>
            <!-- 详情 -->
            <div class="peoplebox" v-loading="loading"
                :element-loading-text='this.$globalParam.loadText'
                :element-loading-spinner='this.$globalParam.loadSpinner'
                :element-loading-background='this.$globalParam.loadBg'
            >
                <div class="nodata" v-if="notabledata" @click="choosedata">
                    <i class="el-icon-refresh"></i>
                    <p>暂无数据请刷新</p>
                </div>
                <ul v-else>
                    <li v-for="(item,index) in tableData" :key="index" @click="expertdetail(item)">
                       <div class="topimg">
                           
                           <img src="../../assets/img/expert/nopeople.png" alt="" class="moimg" v-if="!item.avatar">
                           <img :src="item.avatar" alt="" v-else >
                           <div class="zhiji">
                               <img src="../../assets/img/expert/te.png" alt="" v-if="item.titleName=='教授'">
                               <img src="../../assets/img/expert/ze.png" alt="" v-if="item.titleName=='副教授'">
                               <img src="../../assets/img/expert/yi.png" alt="" v-if="item.titleName=='一级'">
                               <img src="../../assets/img/expert/er.png" alt="" v-if="item.titleName=='二级'">
                               <img src="../../assets/img/expert/san.png" alt="" v-if="item.titleName=='三级'">
                               <img src="../../assets/img/expert/wei.png" alt="" v-if="!item.titleName">
                           </div>
                       </div>
                       <h1>{{item.name}}</h1>
                       <div class="pingfen">
                           <h2>综合满意度：</h2>
                           <div class="star">
                               <el-rate v-model="item.total"
                               :allow-half="true"
                               disabled
                               :show-score="true"
                                text-color="#ff9900"
                                :colors="['#FD7E23','#FD7E23','#FD7E23']"
                               score-template="{value}"                               
                               >
                               {{item.total}}
                            </el-rate>
                           </div>
                        </div>
                            
                                <el-tooltip class="item" effect="dark" :content="item.curriculumFieldVos | arrTstring" placement="top">
                                    <h3>课程领域：
                                        <span>
                                        {{item.curriculumFieldVos | arrTstring}}                                   
                                        </span>
                                    </h3> 
                                </el-tooltip>
                                
                                                   
                        <div class="chatqq" @click.stop="chatexpert(item.id)">
                            <img src="../../assets/img/expert/qq.png" alt="">
                        </div> 
                    </li>                   
                </ul>
            </div>
            <!-- 分页组件 -->
            <pagination @getpagedata="getpagedata" :pagesize="pagesize" :totalElements="totalElements"></pagination>
        </div>
        <!-- 联系专家申请 -->
        <callexpert :chatexpertshow.sync="chatexpertshow" :expertid="expertid" @expertlistsuccess="expertlistsuccess"></callexpert>
        <!-- 提交成功提示 -->
        <success :dialogsuccessVisible.sync="successshow"></success>
    </div>
</template>
<script>
import heard from '@/components/header/header'
import searchnav from './searchnav'
import choosearea from './choosearea'
import pagination from '@/base/modal/pagination'
import callexpert from './callexpert'
import success from './success'
import model from'@/model/expert/expert'
import { getCurRole,exitSys } from "../../filters/userVerify"
import { join } from 'path';
export default {
    data(){
        return {
            searchmodel:'',//搜索框内容
            updown:"由高到低",
            starval:3.7,
            pagesize:20,//每页显示
            totalElements:0,//总数
            pagenumber:1,//当前显示第一页
            chatexpertshow:false,//显示隐藏申请专家联系
            successshow:false,//显示隐藏提交成功
            tableData:[],//专家列表
            expertid:'',
            areaCode:'',        //地域
            curriculumFieldIds:'',   //课程领域aerry
            studySectionIds:'',  //学段aerry
            subjectIds:'',   //学科aerry
            titleIds:'',  //职称aerry
            sord:'desc',//正序
            notabledata:false,//无数据时显示
            loading:true,
            toopnameArr:""
        }
    },
    filters:{
        arrTstring(val){
            if(val==undefined){
                return ''
            }else if(val.length==0){
                return ''
            }else{
                let str=[];
                val.forEach(ele=>{
                    str.push(ele.name)
                });
                str=str.join('·')
                return str
            }
        }
    },
    created(){
        // this.getexpertlise();
    },
    mounted(){
        this.getexpertlise();
    },
    methods:{
        //接收筛选组件返回过来的结果
        getdata(val){
            let lingyu=val[0];
           this.curriculumFieldIds= this.getid(val[0]);
           this.studySectionIds=this.getid(val[1]);
           this.subjectIds=this.getid(val[2])
           this.titleIds=this.getid(val[3])
           this.getexpertlise();
        },
        //对接收过来的数组便利去除id
        getid(val){
            let newArr=[];
            val.forEach(element => {
                newArr.push(element.id);
            });
            let str=newArr.join(',')
            return str
        },
        //接收地区联动返回的结果
        getcitydata(val){
            console.log(val)
            this.areaCode=val[1];
            this.getexpertlise()
        },
        //获取分页点击的页数
        getpagedata(val){
            console.log(val)
            this.loading=true
            this.pagenumber=val;
            this.getexpertlise()
        },
        //控制专家申请显示隐藏
        chatexpert(id){
            if(!this.$store.getters.getOrgVipInfo.vip){
                this.$store.state.vipFuncPopFalg = true;
                return;
            }
            //专家id
            this.expertid=id;
            this.chatexpertshow=true;
        },
        //正序倒叙
        sortdata(){
            if(this.updown=="由高到低"){
                this.updown="由低到高"
                this.sord="asc"
            }else{
                this.updown="由高到低"
                this.sord="desc"
            }
            this.getexpertlise()
        },
        //执行搜索
        searchdown(){
            //存储searchmodel
            this.getexpertlise()
        },
        //刷新清掉选择
        choosedata(){
            this.searchmodel=''
            this.areaCode=''
            this.curriculumFieldIds=''
            this.studySectionIds=''
            this.subjectIds=''
            this.titleIds=''
            this.pagenumber=1;
            //清除掉子组件的数组
            this.$refs.cleardata.deletedata()
            this.$refs.deletenav.deletechoose()
            this.getexpertlise();
        },
        //获取专家信息列表
        getexpertlise(){
            
            let data={
                keywords:this.searchmodel,//专家名称或课程名称
                areaCode:this.areaCode,        //地域
                curriculumFieldIds:this.curriculumFieldIds,   //课程领域
                studySectionIds:this.studySectionIds,  //学段
                subjectIds:this.subjectIds,   //学科
                titleIds: this.titleIds, //职称
                number:this.pagenumber,
                size:this.pagesize,
                sord:this.sord,
                sidx:'total',//排序规则 
            };
            model.getexpertlist(data,(res)=>{
                if(res.status==200){
                                      
                    this.tableData=res.data.content
                    if(res.data.content.length==0){
                        this.notabledata=true
                    }else{
                        this.notabledata=false
                    }
                    this.totalElements=res.data.totalElements
                    this.loading=false
                }
            })
        },
        //申请列表提交成功后控制提示
        expertlistsuccess(){
            this.successshow=true;
            this.chatexpertshow=false;
        },
        //跳转专家详情
        expertdetail(item){
            if(!this.$store.getters.getOrgVipInfo.vip){
                this.$store.state.vipFuncPopFalg = true;
                return;
            }
            let newpage = this.$router.resolve({ 
                path:'/expert/detail',
                query:{
                    id:item.id,
                }      
            })  
            window.open(newpage.href, '_blank');
        },
        operaterCommand(command){
          if(command == "edit"){
                this.$router.push({
                    path:"/project/password?type=clazz"
                })
            }
            if(command == "exit"){
                exitSys();
            }
        }
    },
    components:{
      heard,
      searchnav,
      choosearea,
      pagination,
      callexpert,
      success,  
    }
}
</script>
<style lang="less">
@import "../../assets/less/icon.less";
.z-content{
    width: 100%;
    height: 100%;
    header{
        width: 100%;
        height: 120px;
        background: url("../../assets/img/expert/heardbg.png") no-repeat center top;
        .heardtop{
            width: 1190px;
            overflow: hidden;
            margin: 0 auto;
            img{
                width: 137px;
                float: left;
                margin: 22px 0 0 0;
            }
            .search{
                width: 512px;
                float: right;
                margin: 20px 0 0 0;
                overflow: hidden;
                border: none;
                
                input{
                    width: 470px;
                    height: 40px;
                    background: #FBFDFF;
                    border: 1px solid #C7D2DE;
                    border-top-left-radius: 6px;
                    border-bottom-left-radius: 6px;
                    padding: 20px;
                    font-size: 16px;
                    color: #333333;
                    box-sizing: border-box;
                    border:none;
                    float: left;
                }
                ::placeholder{
                    font-size: 16px;
                    color: #999999;
                    letter-spacing: 0;
                    text-align: left;
                    line-height: 16px;
                }
                button{
                    width: 40px;
                    height: 40px;
                    background:#009791;;
                    border: 1px solid #009791;
                    border-top-right-radius: 6px;
                    border-bottom-right-radius: 6px;
                     box-sizing: border-box;
                     border:none;
                    float: left;
                }
            }
        }
        
    }
    .search_box{
        width: 100%;
        background-color: #ffffff;
        overflow: hidden;
    }
    .infobox{
        width: 100%;
        overflow: hidden;
        background-color: #F7F7F7;
        margin-top: 20px;
        .updown{
            width: 1190px;
            overflow: hidden;
            margin: 0 auto;
            .height{
                overflow: hidden;
                float:left;
                margin-right: 20px;
                h1{
                    float: left;
                    font-size: 16px;
                    color: #333333;
                    letter-spacing: 0;
                    line-height: 60px;
                }
                p{
                    float: left;
                    font-size: 16px;
                    color: #009791;
                    line-height: 60px;
                }
                img{
                    width: 10px;
                    margin: 20px 0 0 8px;
                    float: left;
                }
            }
            .shegnshi{
                overflow: hidden;
                margin: 8px 0 0 0px;
            }
            
        }
        .peoplebox{
            width: 1230px;
            overflow: hidden;
            margin: 0 auto;
            min-height:200px;
            .nodata{
                width: 100%;
                margin-top: 40px;
                cursor: pointer;               
                i{
                    width: 20px;
                    margin: 0 auto;
                    display: block;
                    font-size:24px;
                    color:#009791;
                }
                p{
                    width: 100%;
                    text-align: center;
                    line-height: 40px;
                    font-size:20px;
                    color: #666666;  
                }
            }
            ul{
                overflow: hidden;
                margin-bottom: 20px;
                li{
                    float: left;
                    width: 220px;
                    height: 300px;
                    overflow: hidden;
                    border-radius: 4px;
                    background-color: #ffffff;
                    cursor: pointer;
                    position: relative;
                    margin: 10px 0 10px 20px;
                    transition:all 0.2s;
                    .topimg{
                        width: 100%;
                        height: 180px;
                        overflow: hidden;
                        background: #D8D8D8;
                        position: relative;
                        .moimg{
                            width: 75px;
                            height: 109px;
                            margin-top: 33px;
                        }
                        img{
                            max-width: 100%;
                            display: block;
                            margin: 0 auto;
                        }
                        .zhiji{
                            width: 45px;
                            overflow: hidden;
                            position: absolute;
                            top: 0;
                            right: 14px;
                            img{
                                max-width: 100%;
                            }
                        }
                    }
                    h1{
                        font-size: 16px;
                        color: #333333;
                        text-align: center;
                        line-height: 45px;
                        
                    }
                    .pingfen{
                        width: 100%;
                        overflow: hidden;
                        h2{
                            font-size: 14px;
                            color: #333333;
                            margin-left: 20px;
                            float: left;
                        }
                        .star{
                            overflow: hidden;
                            .el-rate__icon{
                                font-size:12px;
                                margin-right: 4px;
                            }
                            .el-rate__text{
                                font-size:12px;
                                color: rgb(247, 186, 42);
                            }
                        }
                    }
                    h3{
                        font-size: 14px;
                        color: #666666;
                        text-align: center;
                        margin: 10px 0 20px 0;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space:nowrap
                    }
                    .chatqq{
                        width: 59px;
                        height: 59px;
                        position: absolute;
                        top: 151px;
                        right: 0px;
                        img{
                            width: 84%;
                             transition:all 0.2s;
                        
                        }
                        img:hover{
                            transition:all 0.2s;
                            transform: scale(1.1);
                        }
                    }
                }
                li:hover{
                    box-shadow: 1px 17px 15px -11px #CCCCCC;
                    transition:all 0.2s;
                    transform: translateY(-5px) 
                }
            }
        }
    }
    
}
.el-dropdown-menu{
    background: rgba(0,0,0,0.5)!important;
    border: none;
} 
</style>

