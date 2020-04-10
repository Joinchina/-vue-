<template>
    <div class="list_content" v-loading="loading"
        :element-loading-text='this.$globalParam.loadText'
        :element-loading-spinner='this.$globalParam.loadSpinner'
        :element-loading-background='this.$globalParam.loadBg'>
        <p class="w-nocont" v-show="nodata">暂无数据</p>
        <ul>
            <li v-for="(item,index) in stuList" :key="index">
                <div class="list_box_left">
                    <div class="list_box_info">
                       <img :src="item.avatar" alt="" v-if="item.avatar">
                       <img src="../../assets/img/icon/moimg.png" alt="" v-else>
                       <h1 v-if="!item.workPlace">{{item.name}}</h1>
                       <h1 v-else>{{item.name}} ·<span>{{item.workPlace}}</span></h1>
                       <h2>{{item.clazzName}}</h2>
                    </div>
                    <p>
                       {{item.answer}}
                    </p>
                </div>
                <div class="list_box_right">
                    <span>{{item.createTime}}</span>
                </div>
            </li>
        </ul>
        <LoadMore :loadData = "loadData" :loadUrl = "loadurl" @getList = "getList"></LoadMore>
    </div>

</template>
<script>
import LoadMore from '@/base/loadmore/loadmore'
import API from '@/global/resource';
import { mapGetters} from 'vuex';
import { getCurRole } from '@/filters/userVerify';
import storage from '@/global/storage'
export default {
    data(){
        return {
            stuList:[],  //遍历的数组
            loadData:{}, //传入请求数据
            loadurl:"",  //传入请求接口地址
            loading:true,
            nodata:false,
            tip:'暂无数据',

            role: getCurRole(),
            orgId:""
        }
    },
    computed:{
        ...mapGetters(['showOrgObj'])
    },
    watch:{

          showOrgObj(cur,old){
           
             this.orgId = cur.identification;
             this.menuRole(cur.role); 

             if(this.role == 'ORGADMIN' || this.role == 'ADMIN') {
                this.passdata();
             }
          },

    },
    created(){

       // this.passdata();
    },
    methods:{
        menuRole (role){

            //目前不需进行机构权限的的反查，项目管理员和专家班主任只有两个菜单;
            var role = role || storage.get("exp_role");
            // console.log("项目列表获取角色" + role );
            this.role = role;
        },

        getList(val,bool){

            this.nodata = false;
            this.stuList = [];
            
			val.forEach((item,index)=>{

                this.stuList.push(item);
                this.loading=false;
                return;                    
            });
            if (this.stuList.length == 0) {
                this.nodata = true;
                this.loading=false;
            }
        },
        passdata(){
           this.loadData={
                number:0,
                organizationId:this.orgId,
                size:10
           };


           this.loadurl=API.urls.getorgmessage;
           console.log("chuangguoqu");
            console.log(this.loadurl);
        }    
    },
    components:{
       LoadMore,
    },
}
</script>
<style lang="less" scoped>
.list_content{
    width: 100%;
    display:block;
    overflow: hidden;
     .w-nocont{
		 height: 467px;
		margin-bottom: 20px;
		text-align: center;
		color: #999;
		font-size: 24px;
		padding-top: 150px;
	 }
    ul{
        width: 100%;
        overflow: hidden;
        li{
         width: 100%;
         overflow: hidden;
         border-bottom:1px solid #E6E6E6;
         .list_box_left{
             width: 80%;
             float: left;
             overflow: hidden;
             .list_box_info{
                 width: 100%;
                 overflow: hidden;
                 img{
                     float: left;
                     margin: 22px 16px 0 20px;
                     width: 46px;
                     height: 46px;
                     border-radius: 46px;
                 }
                 h1{
                     float: left;
                     font-size: 18px;
                    color: #333333;
                    width:60%;
                    margin-top: 22px;
                    span{
                        font-size: 18px;
                        color: #666666;
                    }
                 }
                 h2{
                     float: left;
                     width:60%;
                     font-size: 16px;
                    color: #333333;
                    margin-top: 2px;
                 }
             }
             p{
                 width: 100%;
                 overflow: hidden;
                font-size: 18px;
                color: #666666;
                line-height: 29px;
                margin: 10px 0 30px 0;
                padding: 0 20px;
                
             }
         } 
         .list_box_right{
             width: 20%;
             float: right;
             margin-top: 24px;
             span{
                 float: right;
                 font-size: 14px;
                color: #666666;
                line-height: 14px;
                margin-right: 10px;
             }
         }   
        }
    }
}
</style>

