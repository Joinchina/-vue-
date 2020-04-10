<style lang="less">
    @import "../../assets/less/btn-search.less";
    #wbreadcrumb {
        height: 52px;
        padding-top: 11px;
        .add-clazz,
        .btn-export,
        .btn-full {
            margin-top: -26px;
        }
        // 面包屑

        .el-breadcrumb__item__inner, .el-breadcrumb__item__inner a {
            font-size: 16px;
        }
        .el-breadcrumb__separator {
            font-size: 16px;
        }
    }
</style>
<template>
	<div id="wbreadcrumb" class="clearfix">
        <el-breadcrumb separator="/">
            <template v-if="!!btnMessage">
                <el-breadcrumb-item :to="{ path: '/course/all', query:{ clazzId: clazzId}}">课程管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/course/detail', query:{ clazzId: clazzId,courseId:courseId}}">课程详情</el-breadcrumb-item>
                <el-breadcrumb-item>留言板</el-breadcrumb-item>
            </template>
            <template v-else-if="!!breadPhoto">
                <el-breadcrumb-item :to="{ path: '/course/all', query:{ clazzId: clazzId}}">课程管理</el-breadcrumb-item>
                <el-breadcrumb-item v-if="crumb === 'det'" :to="{ path: '/course/detail', query:{ clazzId: clazzId,courseId:courseId}}">课程详情</el-breadcrumb-item>
                <el-breadcrumb-item v-if="crumb === 'task'" :to="{ path: '/course/task', query:{ clazzId: clazzId}}">项目任务</el-breadcrumb-item>
                <el-breadcrumb-item>照片墙</el-breadcrumb-item>
            </template>
            <template v-else-if="!!leveDiscuss">
                <el-breadcrumb-item :to="{ path: '/course/all', query:{ clazzId: clazzId}}">课程管理</el-breadcrumb-item>
                <el-breadcrumb-item v-if="crumb === 'det'" :to="{ path: '/course/detail', query:{ clazzId: clazzId,courseId:courseId}}">课程详情</el-breadcrumb-item>
                <el-breadcrumb-item v-if="crumb === 'task'" :to="{ path: '/course/task', query:{ clazzId: clazzId}}">项目任务</el-breadcrumb-item>
                <el-breadcrumb-item>讨论组</el-breadcrumb-item>
            </template>
            <template v-else-if="!!breadWorkUser">
                <el-breadcrumb-item :to="{ path: '/course/all', query:{ clazzId: clazzId}}">课程管理</el-breadcrumb-item>
                <el-breadcrumb-item v-if="crumb === 'det'" :to="{ path: '/course/detail', query:{ clazzId: clazzId,courseId:courseId}}">课程详情</el-breadcrumb-item>
                <el-breadcrumb-item v-if="crumb === 'task'" :to="{ path: '/course/task', query:{ clazzId: clazzId}}">项目任务</el-breadcrumb-item>
                <el-breadcrumb-item v-if="crumb2 && crumb2 ==='work'" :to="{ path: '/activity/homework/result', query:{ clazzId: clazzId,courseId:courseId,activityId:activityId, crumb: crumb, crumb2: 'work' }}">作业</el-breadcrumb-item>
                <el-breadcrumb-item>提交名单</el-breadcrumb-item>
            </template>
            <template v-else-if="!!leveHomeDetail">
                <el-breadcrumb-item :to="{ path: '/course/all', query:{ clazzId: clazzId}}">课程管理</el-breadcrumb-item>
                <el-breadcrumb-item v-if="crumb === 'det'" :to="{ path: '/course/detail', query:{ clazzId: clazzId,courseId:courseId}}">课程详情</el-breadcrumb-item>
                <el-breadcrumb-item v-if="crumb === 'task'" :to="{ path: '/course/task', query:{ clazzId: clazzId}}">项目任务</el-breadcrumb-item>
                <el-breadcrumb-item>作业</el-breadcrumb-item>
            </template>
            <template v-else-if="!!leveHomeDetailD">
                <el-breadcrumb-item :to="{ path: '/course/all', query:{ clazzId: clazzId}}">课程管理</el-breadcrumb-item>
                <el-breadcrumb-item v-if="crumb === 'det'" :to="{ path: '/course/detail', query:{ clazzId: clazzId,courseId:courseId}}">课程详情</el-breadcrumb-item>
                 <el-breadcrumb-item v-if="crumb === 'task'" :to="{ path: '/course/task', query:{ clazzId: clazzId}}">项目任务</el-breadcrumb-item>
                <el-breadcrumb-item  v-if="crumb2 && crumb2 ==='work'" :to="{ path: '/activity/homework/result', query:{ clazzId: clazzId,courseId:courseId,activityId:activityId,crumb: crumb, crumb2: 'work'}}">作业</el-breadcrumb-item>
                <el-breadcrumb-item  v-if="crumb3 && crumb3 ==='man'" :to="{ path: '/activity/homework/mansum', query:{ clazzId: clazzId,courseId:courseId,activityId:activityId,crumb: crumb, crumb2: crumb2, nowIndex: 0}}">提交名单</el-breadcrumb-item>
                <el-breadcrumb-item>学员作业</el-breadcrumb-item>
            </template>
          <template v-else-if="!!leveIntegral">
            <el-breadcrumb-item :to="{ path: '/clazz/menu', query:{ clazzId: clazzId}}">班级管理</el-breadcrumb-item>
            <el-breadcrumb-item>积分管理</el-breadcrumb-item>
          </template>
          <template v-else-if="!!leveSignIn">
            <el-breadcrumb-item :to="{ path: '/clazz/menu', query:{ clazzId: clazzId}}">班级管理</el-breadcrumb-item>
            <el-breadcrumb-item>签到管理</el-breadcrumb-item>
          </template>
          <template v-else-if="!!leveSignNum">
            <el-breadcrumb-item :to="{ path: '/clazz/menu', query:{ clazzId: clazzId}}">班级管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/clazz/signin/res', query:{ clazzId: clazzId}}">签到管理</el-breadcrumb-item>
            <el-breadcrumb-item>签到人数</el-breadcrumb-item>
          </template>
          <template v-else-if="!!leveGropList">
            <el-breadcrumb-item :to="{ path: '/clazz/menu', query:{ clazzId: clazzId}}">班级管理</el-breadcrumb-item>
            <el-breadcrumb-item>分组管理</el-breadcrumb-item>
          </template>
          <template v-else-if="!!leveGropList">
            <el-breadcrumb-item :to="{ path: '/clazz/menu', query:{ clazzId: clazzId}}">班级管理</el-breadcrumb-item>
            <el-breadcrumb-item>分组管理聊天</el-breadcrumb-item>
          </template>
          <template v-else-if="!!leveGroprank">
            <el-breadcrumb-item :to="{ path: '/clazz/menu', query:{ clazzId: clazzId}}">班级管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path:'/clazz/group/list',query:{clazzId:clazzId }}">分组管理</el-breadcrumb-item>
            <el-breadcrumb-item>小组排行</el-breadcrumb-item>
          </template>
          <template v-else-if="!!leveUnGropList">
            <el-breadcrumb-item :to="{ path: '/clazz/menu', query:{ clazzId: clazzId}}">班级管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path:'/clazz/group/list',query:{clazzId:clazzId }}">分组管理</el-breadcrumb-item>
            <el-breadcrumb-item>未分组学员</el-breadcrumb-item>
          </template>
          <template v-else-if="!!leveGropDetail">
            <el-breadcrumb-item :to="{ path: '/clazz/menu', query:{ clazzId: clazzId}}">班级管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path:'/clazz/group/list',query:{clazzId:clazzId }}">分组管理</el-breadcrumb-item>
            <el-breadcrumb-item>查看详情</el-breadcrumb-item>
          </template>
          <template v-else-if="!!leveDiscussChat">
            <el-breadcrumb-item :to="{ path:'/clazz/group/list',query:{clazzId:clazzId }}">分组管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path:'/clazz/group/detail',query:{clazzId:clazzId,groupId:groupId}}">小组详情</el-breadcrumb-item>
            <el-breadcrumb-item>消息记录</el-breadcrumb-item>
          </template>
            <template v-else>
                <el-breadcrumb-item :to="{ path: '/course/all', query:{ clazzId: clazzId }}">课程管理</el-breadcrumb-item>
                <el-breadcrumb-item>课程详情</el-breadcrumb-item>
            </template>
        </el-breadcrumb>
        <!-- 功能按钮 -->
        <button class="add-clazz" type="button"
            v-if="!!btnAct"
            @click="addAct = true">
            <i class="icon-circle-add"></i>
            添加活动
        </button>

        <button class="btn-full" type="button" v-if="!!btnFull" @click="">
            <i class="icon-full-white"></i>
            大屏幕
        </button>

        <button class="btn-export" type="button" v-if="!!btnExport" @click="">
            <i class="icon-export-white"></i>
            导出
        </button>

        <button class="btn-export" type="button" v-if="!!btnStudent" @click="">
            <i class="icon-export-white"></i>
            导出学员名单
        </button>
        <!-- 添加活动 -->

        <!--留言版-->
        <button class="btn-export btn-green" type="button" v-if="!!btnMessage" @click="messageExport">
            <i class="icon-export-white"></i>
            导出留言
        </button>
        <!--留言板-->
        <add-act
        :dialogAddAct.sync="addAct"
        :courseId="courseId"
        :taskName = "taskName"
        ></add-act>
    </div>
</template>
<script>
	import addAct from 'components/course/add_activity'
    import { getToken } from '@/filters/userVerify'
    import API from '@/global/resource'
    export default {
        data () {
            return {
                addAct: false

            }
        },
        props: ['clazzId','courseId', 'groupId','btnAct','btnExport', 'btnFull', 'btnStudent',"btnMessage","activityId","taskName", "leveDiscuss",'leveHomeDetail','breadPhoto','breadCrumb','leveHomeDetailD','leveIntegral','leveSignIn','leveSignNum','leveGropList','leveUnGropList','leveGropDetail','breadWorkUser','leveDiscussChat','leveGroprank'],
        computed: {
            crumb () {
                return this.$route.query.crumb;
            },
            crumb2 () {
                return this.$route.query.crumb2;
            },
            crumb3 () {
                return this.$route.query.crumb3;
            }
        },
        created() {
        },
        methods: {
            messageExport(){
                if(!this.$store.getters.getOrgVipInfo.vip){
                    this.$store.state.vipFuncPopFalg = true;
                    return;
				}
                let data = {
                    activityId:this.activityId
                }
                window.open(API.urls.courseMessageExportExcel+"?activityId="+this.activityId+"&token="+getToken());
            }
        },
        components: {
            addAct
        }

    }
</script>
