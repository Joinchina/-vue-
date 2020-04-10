<style  lang="less">
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
            <template v-if="!!crumbNotice">
                <el-breadcrumb-item :to="{ path: '/clazz/menu', query:{ clazzId: clazzId}}">班级管理</el-breadcrumb-item>
                <el-breadcrumb-item>通知管理</el-breadcrumb-item>
            </template>
            <template v-else-if="!!crumbNoticeDet">
                <el-breadcrumb-item :to="{ path: '/clazz/menu', query:{ clazzId: clazzId}}">班级管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/clazz/notice/list', query:{ clazzId: clazzId}}">通知管理</el-breadcrumb-item>
                <el-breadcrumb-item>查看内容</el-breadcrumb-item>
            </template>
            
            <template v-else-if="!!crumbCoursePlanAdd">
                <el-breadcrumb-item :to="{ path: '/clazz/menu', query:{ clazzId: clazzId}}">班级管理</el-breadcrumb-item>
                <el-breadcrumb-item>发布课程安排</el-breadcrumb-item>
            </template>
            
            <template v-else-if="!!crumbCoursePlanRes">
                <el-breadcrumb-item :to="{ path: '/clazz/menu', query:{ clazzId: clazzId}}">班级管理</el-breadcrumb-item>
                <el-breadcrumb-item>课程安排</el-breadcrumb-item>
            </template>
            
            <template v-else-if="!!crumbInteractRes">
                <el-breadcrumb-item :to="{ path: '/clazz/menu', query:{ clazzId: clazzId}}">班级管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/clazz/interact/full', query:{ clazzId: clazzId}}">互动点名</el-breadcrumb-item>
                <el-breadcrumb-item>历史记录</el-breadcrumb-item>
            </template>

            <template v-else-if="!!crumbDetail">
                <el-breadcrumb-item :to="{ path: '/clazz/menu', query:{ clazzId: clazzId}}">班级管理</el-breadcrumb-item>
                <el-breadcrumb-item>班级详情</el-breadcrumb-item>
            </template>

            <template v-else-if="!!crumbLifeSev">
                <el-breadcrumb-item :to="{ path: '/clazz/menu', query:{ clazzId: clazzId}}">班级管理</el-breadcrumb-item>
                <el-breadcrumb-item>生活服务</el-breadcrumb-item>
            </template>

            <template v-else-if="!!crumbClazzSet">
                <el-breadcrumb-item :to="{ path: '/clazz/menu', query:{ clazzId: clazzId}}">班级管理</el-breadcrumb-item>
                <el-breadcrumb-item>班级设置</el-breadcrumb-item>
            </template>

            <template v-else-if="!!crumbPostList">
                <el-breadcrumb-item :to="{ path: '/clazz/menu', query:{ clazzId: clazzId}}">班级管理</el-breadcrumb-item>
                <el-breadcrumb-item>帖子列表</el-breadcrumb-item>
            </template>

            <template v-else-if="!!crumbPostDetails">
                <el-breadcrumb-item :to="{ path: '/clazz/menu', query:{ clazzId: clazzId}}">班级管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/clazz/post/list', query: { clazzId: clazzId }}">帖子列表</el-breadcrumb-item>
                <el-breadcrumb-item>帖子详情</el-breadcrumb-item>
            </template>

            <template v-else-if="!!crumbCertList">
                <el-breadcrumb-item :to="{ path: '/clazz/menu', query:{ clazzId: clazzId}}">班级管理</el-breadcrumb-item>
                <el-breadcrumb-item>颁发证书</el-breadcrumb-item>
            </template>

            <template v-else-if="!!crumbLearnCaseList">
                <el-breadcrumb-item :to="{ path: '/clazz/menu', query:{ clazzId: clazzId}}">班级管理</el-breadcrumb-item>
                <el-breadcrumb-item>班级学情</el-breadcrumb-item>
            </template>

        </el-breadcrumb>
        
    </div>
</template>
<script>
	
    export default {
        data () {
            return {
                addAct: false

            }
        },
        props: ['clazzId', 'crumbNotice', 'crumbNoticeDet', 'crumbCoursePlanAdd', 'crumbCoursePlanRes', 'crumbInteractRes', 'crumbDetail', 'crumbLifeSev', 'crumbClazzSet', 'crumbPostList','crumbPostDetails', 'crumbCertList','crumbLearnCaseList'],
        computed: {
            crumb () {
                return this.$route.query.crumb;
            },
            
        },
        created() {

        },
        methods: {
            
        },
        components: {
           
        }

    }
</script>
