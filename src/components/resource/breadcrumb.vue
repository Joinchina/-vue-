<style scoped lang="less">
    @import "../../assets/less/btn-search.less";
    #wbreadcrumb {
        height: 52px;
        padding-top: 11px;

        .add-clazz,
        .btn-export,
        .btn-full {
            margin-top: -26px;
        }
    }
    
</style>
<template>
	<div id="wbreadcrumb" class="clearfix">
        <el-breadcrumb separator="/">
            <template v-if="!!crumbFolder">
                <el-breadcrumb-item :to="{ path: '/resource/list', query:{ clazzId: clazzId}}">资源管理</el-breadcrumb-item>
                <el-breadcrumb-item>{{crumbName}}</el-breadcrumb-item>
            </template>

             <template v-if="!!crumbFolderCommon">
                <el-breadcrumb-item :to="{ path: '/adminres/resource'}">通用资源</el-breadcrumb-item>
                <el-breadcrumb-item>{{crumbName}}</el-breadcrumb-item>
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
        props: ['clazzId', 'crumbFolder', 'crumbFolderCommon', 'crumbName'],
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
