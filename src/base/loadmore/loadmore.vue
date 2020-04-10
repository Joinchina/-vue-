<template>
    <div>
        <div class="loadMore">
            <slot></slot>
            <section v-show="loadFlag" class="load_width">
               <img src="../../assets/img/report/load.gif" width="45" height="45"> 数据正在加载中...
            </section>
            <section v-show="loadFlagMore" class="load_width">没有更多~</section>
        </div> 
    </div>
</template>

<script> 
    import http from '@/global/request';

    import { mapGetters} from 'vuex';
    import { getCurRole } from '@/filters/userVerify';
    import storage from '@/global/storage'


    export default{
       props:{

          loadData:{
              type:Object,
              default:{}
          },
          loadUrl:"",

       },

        computed:{
            ...mapGetters(['showOrgObj'])
        },
        watch:{

              showOrgObj(cur,old){
                 
                 this.orgId = cur.identification;
                 this.menuRole(cur.role); 

                 if(this.role == 'ORGADMIN' || this.role == 'ADMIN') {
                    this.getList();
                 }
              },

        },

       created(){
         this.getList();
       },

       mounted(){
          this.bottomMore();
       },
       data(){
          return{
            totalPages:0,

            loadFlag:false,
            loadFlagMore:false,

            role: getCurRole(),

            dataArray:[],

            /*防止滚动过快，服务端没来得及响应造成多次请求*/
            isAjax:false
          }
       },

       methods:{
          menuRole (role){

            //目前不需进行机构权限的的反查，项目管理员和专家班主任只有两个菜单;
            var role = role || storage.get("exp_role");
            // console.log("项目列表获取角色" + role );
            this.role = role;
          },

          getList(){

             this.isAjax = true;

             let url = this.loadUrl;

             let data = this.loadData;            
             http.get(url, data, 'h2', (res)=>{
              if(!res.data){
                 this.$emit("getList",[]);
              }
                if(res.status == 200){

                  this.isAjax = false;

                  if(!!res.data){

                      this.dataArray = res.data.content;

                      this.totalPages = res.data.totalPages;
                      if(res.data.content.length==0 && res.data.number!=0){
                          this.loadFlag = false;
                          this.loadFlagMore = true;
                      };
                        
                  }

                  //父节点传输数组
                  this.$emit("getList",this.dataArray);
                 
                  //console.log(this.dataArray)                 
               }else{
                   this.$message.error(res.message);
               }
             })
          },
          bottomMore(){
              window.addEventListener('scroll',this.scollPage);
          },
          scollPage(){
                let _this = this;

                if(_this.isAjax){
                   return;
                }

                if($(document).height()-50 <= $(window).scrollTop() + $(window).height()) {             
                  //空页面或当前page为1页不执行
                  if(_this.totalPages <= 1){
                        return;
                  }
                   _this.loadFlag = true;
                   //没有更多了
                   if(_this.loadData.number == _this.totalPages){
                       _this.loadFlag = false;
                       _this.loadFlagMore = true;
                       return;
                   }
                   _this.getList();
                   _this.loadData.number++;
                }
          },
          destroyed(){
             window.removeEventListener('scroll', this.scollPage)
          }
       }
    }
</script>

<style>
  .load_width{
     font-size: 14px;
     color: #666;
     text-align: center;
     height: 40px;
     line-height: 40px;
     margin-bottom: 10px;
  }

</style>
