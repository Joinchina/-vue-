<template>
    <div class="z-pro-menu" >

        <ul class="z-menu-list">

            <template v-if="role == 'ORGADMIN'">
                <li v-for="(list,index) in orgItems"  @click="menu(orgItems,index)" :class="index==0?{'icon-active-f':list.active}:{'icon-active':list.active}">
                    <router-link :to ="{ path:list.paths,query:{orgId: orgId}}" :class="list.class">{{list.name}}</router-link>
                </li>
            </template>

             <template v-if="orgId && role ==='ADMIN'">
                <li v-for="(list,index) in items"  @click="menu(items,index)" >
                    <router-link :to ="{ path:list.paths,query:{orgId: orgId}}" :class="list.class">{{list.name}}</router-link>
                </li>

            </template>
            <template v-if="role === 'ADMIN' && !orgId">
                <!-- <li v-for="(item,index) in adminItems"  @click="menu(adminItems,index)" :class="{'icon-active-f':item.active}"> -->
                <li v-for="(item,index) in adminItems"  @click="menu(adminItems,index)" >
                    <router-link :to ="{ path:item.paths }" :class="item.class">{{item.name}}</router-link>
                </li>
            </template>
        </ul>

    </div>

</template>
<script>
// import bus from '@/global/bus'
import { getCurRole } from '@/filters/userVerify'
import { mapGetters, mapActions } from 'vuex'

export default {
    computed:{
      // showOrg(){
      //    return this.$store.getters.showOrgObj;
      // }
      ...mapGetters(['showOrgObj'])
    },
    watch:{

      showOrgObj(cur,old){
          this.orgId = cur.identification;
          this.menuRole(this.orgId);
          this.role = cur.role;
      },
    },
    data(){
            return {
                role: getCurRole(),
                orgId:"",
                orgItems:[
                    {"name":"项目管理员","class":"icon-pro","paths":"/orguser/pro_list","active":true},
                    {"name":"班主任","class":"icon-man","paths":"/orguser/class_list","active":false},
                    {"name":"专家","class":"icon-professor","paths":"/orguser/professor_list","active":false},
                    {"name":"学员","class":"icon-student","paths": '/orguser/stu_list',"active":false}
                ],
                items:[
                    {"name":"机构管理员","class":"icon-org","paths":"/orguser/org_list","active":true},
                    {"name":"项目管理员","class":"icon-pro","paths":"/orguser/pro_list","active":false},
                    {"name":"班主任","class":"icon-man","paths":"/orguser/class_list","active":false},
                    {"name":"专家","class":"icon-professor","paths":"/orguser/professor_list","active":false},
                    {"name":"学员","class":"icon-student","paths": '/orguser/stu_list',"active":false}
                ],

                adminItems: [
                    {"name":"机构管理员","class":"icon-org","paths":"/adminuser/org_list","active":true},
                    {"name":"项目管理员","class":"icon-pro","paths":"/adminuser/pro_list","active":false},
                    {"name":"班主任","class":"icon-man","paths":"/adminuser/class_list","active":false},
                    {"name":"专家","class":"icon-professor","paths":"/adminuser/professor_list","active":false},
                    {"name":"学员","class":"icon-student","paths": '/adminuser/stu_list',"active":false}
                ]
            }
    },
    created(){
        this.orgId = this.$route.query.orgId;
        this.menuRole();
        // bus.$on('orgListEvent', ( message => {
        //   this.orgId = message.identification;
        //   this.menuRole(this.orgId);
        //   this.role = message.role;
        // }))

    },

    methods:{
        menuRole (orgId) {

            let organizationId = this.orgId || orgId;
            // console.log('org',  organizationId);

            if(this.role =='ORGADMIN' && organizationId) {
                this.refreshActive(this.orgItems);
            }
            if(this.role == "ADMIN" && organizationId) {
                this.refreshActive(this.items);
            }
            if(this.role == "ADMIN" && !organizationId){
                this.refreshActive(this.adminItems);
            }

          },
        menu(items,index){
            items.forEach(function (item,index) {
                item.active = false;
            })
            items[index]["active"] = true;

        },
        refreshActive(items){
            if(this.role == "ADMIN"){
                var thisrouter = JSON.stringify(this.$route.path);
                items.forEach(function (item,index) {
                    item.active = false;
                    if(thisrouter.indexOf(item.paths) > 0){
                        item.active = true;
                    }
                })
            }
            
        }
    }
}
</script>
<style scoped="" lang="less">
    @img:"../../assets/img/icon";
    @import "../../assets/less/icon.less";
    @import "../../assets/reset-element-ui/form.css";
    @borderColor: #f0f0f0;
    .z-pro-menu {
        float: left;
        width: 168px;
        background-color: #37323e;
        border-radius: 10px;
        color: #fff;
        height: auto;
        min-height: 621px;
        height: 621px;
        .z-menu-list {
            width: 100%;
            li {
                font-size: 16px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                cursor: pointer;
                border-bottom:1px solid #312d37;
                // height: 60px;
                // line-height: 60px;
                overflow: hidden;
            }


            li a:hover{
                background-color: #35a69d;
            }
            li a{
                color: #fff;
                text-decoration: none;
            }
            a.icon-org {
                background:url("@{img}/icon-user-2.png") no-repeat 20px center;
                display: inline-block;
                padding-left: 46px;
                height: 60px;
                line-height: 60px;
                width: 100%;
                height: 100%;
            }
            a.icon-pro {
                background:url("@{img}/icon-user-3.png") no-repeat 20px center;
                height: 20px;
                padding-left: 46px;
                display: inline-block;
                height: 60px;
                line-height: 60px;
                width: 100%;
                height: 100%;
            }
            a.icon-man {
                background:url("@{img}/icon-user-1.png") no-repeat 20px center;
                height: 20px;
                padding-left: 46px;
                display: inline-block;
                height: 60px;
                line-height: 60px;
                width: 100%;
                height: 100%;
            }
            a.icon-professor {
                background:url("@{img}/icon-user-5.png") no-repeat 20px center;
                height: 20px;
                padding-left: 46px;
                display: inline-block;
                height: 60px;
                line-height: 60px;
                width: 100%;
                height: 100%;
            }
            a.icon-student {
                background:url("@{img}/icon-user-4.png") no-repeat 20px center;
                height: 20px;
                padding-left: 46px;
                display: inline-block;
                height: 60px;
                line-height: 60px;
                width: 100%;
                height: 100%;
            }
            .icon-active{
                background-color: #35a69d;
            }

            .icon-active-f{
                background: #35a69d;
                border-top-left-radius:10px;
                border-top-right-radius:10px;
            }
            li {
                &:first-child {
                    a {
                        border-top-left-radius:10px;
                        border-top-right-radius:10px;
                    }

                }
            }

            a.active{
                background-color: #35a69d;



            }
        }
    }
    .clazz-list-comp {
        float: left;
        margin-left: 20px;
    }
</style>
