<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index">
                        <template slot="title"><i :class="item.icon"></i>{{ item.title }}</template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">{{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index">
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                items: [
                    {
                        icon: 'el-icon-setting',
                        index: '/organization/list',
                        title: '机构列表'
                    },
                    {
                        icon: 'el-icon-menu',
                        index: '/clazz/list',
                        title: '项目列表'
//                        subs: [
//                            {
//                                index: 'basetable',
//                                title: '基础表格'
//                            },
//                            {
//                                index: 'getgrid',
//                                title: '可复用网格组件'
//                            }
//                        ]
                    },
                    {
                        icon: 'el-icon-date',
                        index: '/user',
                        title: '用户管理'
//                        subs: [
//                            {
//                                index: 'baseform',
//                                title: '基本表单'
//                            }
//                        ]
                    },
                    {
                        icon: 'el-icon-star-on',
                        index: '/evaluation',
                        title: '评价反思'
                    },
                    {
                        icon: 'el-icon-upload2',
                        index: '/version/list',
                        title: '版本管理'
                    }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        }
    }
</script>

<style lang="less" scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #2E363F;
        > ul {
            height:100%;
        }
    }

</style>
