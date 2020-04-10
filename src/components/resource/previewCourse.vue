<template>
      
    <div>
        <c-head></c-head> 
        <template>
            <div class="courseNmae"><p>{{courseNmae}}</p></div>
        </template>
        <div class="previewWrapper"
            v-loading="loading"
	        :element-loading-text="$globalParam.loadText"
	        :element-loading-spinner="$globalParam.loadSpinner"
	        :element-loading-background="$globalParam.loadText">
            <el-row class="tac">
                <el-col :span="24">
                    <h5>{{msg}}</h5>
                    <el-menu 
                        default-active="2"
                        class="el-menu-vertical-demo"
                        active-text-color="#FF8D00"
                        :unique-opened="uniqueOpened"
                        :router="false"
                        @select="menuItemSelect"
                        @open="handleOpen">
                        <template v-for="(item,index) in navArray">
                            <el-submenu :index="item.courseId" :key="index" v-if="item.directory">
                                <template slot="title">
                                    <el-tooltip :open-delay="500" :enterable="false" class="item" effect="light" :content="item.name" placement="bottom">
                                        <span>{{item.name}}</span>
                                    </el-tooltip>
                                </template>
                                <el-menu-item v-for="(item2,index2) in item.children" :key="index2" :index="item2.courseId">
                                    <el-tooltip :open-delay="500" :enterable="false" class="item" effect="light" :content="item.name" placement="bottom"><span>{{item2.name}}</span></el-tooltip>
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item :index="item.courseId" v-else :key="index">
                                <el-tooltip :open-delay="500" :enterable="false" class="item" effect="light" :content="item.name" placement="bottom">
                                    <span>{{item.name}}</span>
                                </el-tooltip>
                            </el-menu-item>
                        </template>
                    </el-menu>
                </el-col>
            </el-row>

            <div class="showBox">
                <el-breadcrumb separator-class="el-icon-arrow-right" v-if="hasClass">
                    <el-breadcrumb-item><span class="step1">{{breadcrumbone}}</span></el-breadcrumb-item>
                    <el-breadcrumb-item v-if="haveTwoStep"><span class="step2">{{breadcrumbtwo}}</span></el-breadcrumb-item>
                </el-breadcrumb>

                <div class="viewBox">
                    <video v-show="vedioShow" :src="courseVedioUrl" controls="controls"  width="90%" height="auto" class="vedioTag" id="videoSource">
                    您的浏览器暂不支持vedio媒体播放，请升级浏览器
                    </video>
                    <iframe v-show="htmlShow" :src="courseiframeUrl" id="showIframe" frameborder="0" width="100%" height="100%"></iframe>
                </div>

            </div>
        </div>

    </div>
</template>

<script>
    import cHead from "../header/header";
    import Model from '@/model/resource/net';
    export default{
        data () {
            return {
               msg:"目录",
               uniqueOpened:true, //是否只打开一个下拉菜单
               breadcrumbone:"",
               breadcrumbtwo:"",
               clazzId:"",  //班级id
               staticText:"当前位置：",
               onlineCourseId :"",  //网络课程id
               courseNmae:"",
               vedioShow:false,
               htmlShow: true,
               courseVedioUrl:'',    //vedio课程显示的地址
               courseiframeUrl:'',      //iframe课程显示的地址
               courseAllData:{},   //后台获取的全部课程数据
               loading:false,
               depositText:"",    //预存一级面包屑导航
               hasClass: false,   //控制面包屑，有数据显示，无数据隐藏
               navArray:[],     //左侧nav菜单
               haveTwoStep:false
               
            }
        },
        created () {
            this.getQuery();
            this.onlineCourseDetail();
        },

        methods:{
            handleOpen(key, keyPath) {
                this.courseAllData.resourceItemList.forEach((item,index)=>{
                    if(item.itemId==key){
                        this.depositText=item.itemName
                    }
                })
            },
            getQuery(){
                //获取路由参数
                this.clazzId=this.$route.query.clazzId;
                this.onlineCourseId=this.$route.query.courseId;
            },
            menuItemSelect(index){
                let clickId = index;
                this.courseAllData.resourceItemList.forEach((item,index)=>{
                    if(item.itemId==clickId){
                        if(item.parentItemId=="00000000-0000-0000-0000-000000000000"){
                            this.breadcrumbone = this.staticText+item.itemName;
                            this.breadcrumbtwo = "";
                            this.haveTwoStep=false;
                        }else{
                            this.breadcrumbtwo = item.itemName
                            this.breadcrumbone = this.staticText+this.depositText;
                            this.haveTwoStep=true;
                        }
                        this.hasClass=true;
                        if(item.resourceType=="URL"){
                            document.getElementById("videoSource").pause();
                            this.vedioShow=false;
                            this.htmlShow=true;
                            this.courseiframeUrl = item.resourceUrl;
                            this.courseVedioUrl = "";
                        }else if(item.resourceType=="VIDEO"){
                            this.vedioShow=true;
                            this.htmlShow=false;
                            this.courseVedioUrl = item.resourceUrl;
                            this.courseiframeUrl = "";
                        }
                        
                    }
                })
            },
            onlineCourseDetail(){
                let coursedata ={
                    clazzId: this.clazzId,
                    onlineCourseId: this.onlineCourseId
                };
                this.loading = true;
                Model.onlineCourseDetail(coursedata,(result)=>{
                    this.loading = false;
                    if(result.status==200){
                        let cursorData = result.data;
                        this.courseNmae = cursorData.name;
                        this.courseAllData = cursorData;
                        if(cursorData.resourceItemList.length>0){
                            this.dealDate(cursorData.resourceItemList);
                        }else{
                            this.msg="目录为空";
                        }
                        
                    }else{
                        this.$message.error(result.message);
                        
                    }
                })
            },

            dealDate(dataArray){
                let resultArr = [];
                dataArray.forEach((item,index) => {
                    if(item.directory){
                        resultArr.push({name:item.itemName,directory:true,courseId:item.itemId,children:[]});
                    }else if(item.parentItemId=="00000000-0000-0000-0000-000000000000"){
                        resultArr.push({name:item.itemName,directory:false,courseId:item.itemId});
                    }else{
                        resultArr.forEach((item2,index2)=>{
                            if(item.parentItemId==item2.courseId){
                                item2.children.push({name:item.itemName,courseId:item.itemId,})
                                return true
                            }
                        })
                    }
                });
                this.navArray=resultArr;
            }
        },
        components:{
            cHead
        }
    }
</script>


<style lang="less" scoped>
    .courseNmae{
        font-size: 20px;
        color: #333333;
        height: 60px;
        line-height: 60px;
        background: #fff;
        font-weight: bold;
        p{
            max-width:1250px;
            margin: 0 auto;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
    .viewBox{
        width: 100%;
        height: 100%;
    }
    .previewWrapper{
        display: flex;
        max-width: 1250px;
        margin: 20px auto;
        justify-content: space-between;
        .el-row{
            flex-grow:1;
            box-shadow: 0 0 12px 0 rgba(0,0,0,0.06);
            background: #ffffff;
           h5{
                max-width: 240px;
                font-size: 20px;
                color: #333333;
                height: 60px;
                line-height: 60px;
                text-indent: 20px;
                border-bottom:2px solid  rgba(120,144,156,0.16);
            }
        }
        .showBox{
            flex-grow:2;
            max-width: 980px;
            min-height: 670px;
            background: #ffffff;
            box-shadow: 0 0 12px 0 rgba(0,0,0,0.06);
            .el-breadcrumb{
                height: 50px;
                line-height: 50px;
                padding: 0 10px;  
                border-bottom: 1px solid rgba(120,144,156,0.16);     
            }
            .step1{
                font-size: 14px;
                color: #9B9B9B;
            }
            .step2{
                color: #333333 !important;        
            }
            .vedioTag{
                margin: 30px auto;
            }
        }
    }
    
    .el-row{
        max-width: 240px;
    }
    .littleTitle{
        background: #ffffff;
        height: 50px;
        line-height: 50px;
        span{
            display: inline-block;
            width: 45%;
            font-size: 14px;
            color: #333333;
            text-indent: 20px;
        }
        span:last-child{
            text-indent: 0;
            text-align: right;
            font-size: 10px;
            color: #999999;
        }
    }
    .el-menu{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        .el-submenu{
            font-size: 16px;
            color: #333333;
            font-weight: bold;
            // .el-menu-item.is-active{
            //     background: #FFF4E8 !important;
            //     border-left: 6px solid #FF8D00;
            // }
            .el-submenu__title span{
                display: inline-block;
                max-width: 190px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
        .el-submenu .el-menu-item{
            font-weight: normal;
            border-left: 6px solid transparent;
        }
        .el-menu-item.is-active{
            background: #FFF4E8 !important;
            border-left: 6px solid #FF8D00;
        }
        .el-menu-item{
            font-weight: bold;
            font-size: 14px;
            font-weight: bold;
            color: #333333;
            width: 100%;
            padding: 0 20px !important;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
            

        
    }
</style>
