<template>
  <div id="orgLayer">
    <section class="wrapper relative">
      <!--<img src="../../assets/img/common/avatar.png" class="org-logo" alt="">-->
      <!-- 非admin登录展现 -->
      <div v-if = "role != 'ADMIN'">
        <img v-if="imgUrlFlag" :src="imgUrl" class="org-logo">
        <img src="/static/img/avatar.png" class="org-logo" alt="" v-else>
        <div class="org-menu" >
          <h1>{{defaultname}}<img src="/static/img/vipLogo.png" class="vip-logo" alt="" v-if="vipInfo.vip"></h1>
          <el-dropdown class="org-down" trigger="click" v-if="orglist.length > 1">
                <span class="el-dropdown-link">
                  切换机构<i class="el-icon-caret-bottom"></i>
                </span>
            <el-dropdown-menu class="org-down org-down-height" slot="dropdown">
              <el-dropdown-item class="line" :class="{ active:item.checked }" v-for = "(item,index) in orglist" :key="item.identification" @click.native="handleCommand(index,item.userIds)" >{{item.name}}</el-dropdown-item>


            </el-dropdown-menu>
          </el-dropdown>
          <!--下拉菜单end-->
        </div>
      </div>
      <!-- admin登录展现 -->
      <div v-else>
        <img :src="adminorgList.logo" class="org-logo" alt=""  v-if = "adminorgList.logo">
        <img src="/static/img/avatar.png" class="org-logo" alt="" v-else>
        <div class="org-menu">
          <h1>{{defaultname}} <img src="/static/img/vipLogo.png" class="vip-logo" alt=""  v-if="vipInfo.vip"></h1>
          <!-- <p>当前位置：
            <router-link :to="{ path: 'home' }">机构列表</router-link> >
            <router-link :to="{ path: 'home' }">APP启动屏</router-link>
          </p> -->
        </div>
      </div><!-- org-menu -->



    </section>
  </div>
</template>
<script>
  import model from 'model/organization/list'
  import { Base64 } from 'js-base64'
  import storage from '@/global/storage'
  import { setIds,limits,decodeToken } from  '@/filters/userVerify'
  import { mapGetters, mapActions } from 'vuex'
  import httpRequest from '@/model/orgAccount/index'
  export default {
     computed:{
          ...mapGetters(['showCurOrgLogo'])
      },

      watch:{

        showCurOrgLogo(cur,old){
            if (this.role != "ADMIN") {
                this.imgUrlFlag = true;
                this.imgUrl = cur.logo;
                this.defaultname = cur.name;

            }else{
               this.adminorgList.logo = cur.logo;
               this.defaultname = cur.name;
            }
        },

      },

    data: function () {

      return {
        role: "",
        logo: "",
        defaultname: "",
        orglist: [],
        orgUsers:[],
        obj: {},
        adminorgList:{},
        imgUrlFlag:false,
        imgUrl:"",
        loginType:"",
        userIds:"",
        vipInfo : {vip:false},
        lastGetInfo: 0,
      }
    },
    mounted () {
      // alert( this.defaultname2);
    },

    created () {

      this.menuRole();
      if (this.role != "ADMIN") {
        this.initList();
      } else {
        this.adminList();
      }


      //改变logo
      // bus.$on("changeLogo",(imgUrlFrom) => {
      //   if (this.role != "ADMIN") {
      //     this.imgUrlFlag = true;
      //     this.imgUrl = imgUrlFrom.logo;
      //     this.defaultname = imgUrlFrom.name;

      //   }else{
      //      this.adminorgList.logo = imgUrlFrom.logo;
      //      this.defaultname = imgUrlFrom.name;
      //   }

      // })
      // console.log(Base64.decode("eyJzdWIiOiIyNjUzIiwibmFtZSI6Iui1teS5puWNhyIsInJvbGUiOiJQUk9KRUNUQURNSU4ifQ"));
      // console.log(Base64.decode("eyJzdWIiOiIxMDU0NCIsIm5hbWUiOiLotbXkuabljYciLCJyb2xlIjoiUFJPRkVTU09SIn0"));
      // console.log("9990" + Base64.decode("eyJzdWIiOiI5ODQ1IiwibmFtZSI6Iui1teS5puWNhyIsInJvbGUiOiJDTEFaWk1BTkFHRVIifQ"));
      this.getAccountInfo();
    },

    methods: {
      adminList(){
        var orgId = this.$route.query.orgId;
        if(!!orgId){
          var data = {
            id:orgId
          }
          model.getDetail(data, (res => {
            if(res.status == 200){
              this.adminorgList = res.data;
              this.defaultname = this.adminorgList.name;
            }else{
              this.$message.error(res.message);
            }

          }))
        }
      },
      menuRole(){
        var role = storage.get("exp_role");
        this.role = role;
      },
      handleCommand(index,curUserId) {
         //点击获取当前角色
        var curRole = this.setLocstorageToken(curUserId);

        this.defaultname = this.orglist[0]["name"];
        //存储机构id,change
        if(this.orglist != undefined && this.orglist.length != 0){
          this.defaultname = this.orglist[index]["name"];
          var identification = this.orglist[index]["identification"];
          var userIdFirst = this.orglist[index]["userIds"][0];
          this.userIds = this.orglist[index]["userIds"];

          //选中红对勾
          this.orglist.forEach(function (item,index) {
              item.checked = false
          })
          this.orglist[index].checked = true;

          //显示logo
          if(this.orglist[index]["logo"]){
            this.imgUrlFlag= true;
            this.imgUrl = this.orglist[index]["logo"];
          }else{
            this.imgUrl = "/static/img/avatar.png";
          }
          
          var obj = {
            "identification": identification,
            "userFirst":userIdFirst,
            "userIds":this.userIds,
            "role":curRole
          }
          //console.log("点击userId" + obj.role)
          storage.set("orgId",obj);

          //项目列表进行传值
          this.obj = obj;

          //存储机构权限
          limits(this.userIds);

         // console.log("点击切换" + JSON.stringify(this.obj))
          this.$store.dispatch("swichtab",this.obj)

          this.getAccountInfo();
          this.$emit("upVipInfo")

        }
      },

      orgIdNext(){
          //获取当前登录方式（账号 or 手机号）
          this.loginType = storage.get("loginType");
          //账号登录
          if(this.loginType["type"] == "username"){

             var curUserName = this.loginType["username"];
             var decodeAray = decodeToken();
             var curOrgList = {};
             var curOrgId = decodeAray[curUserName]["orgId"];

             this.changeOrgList(curOrgId);
             this.defaultname = this.orglist[0]["name"];
             //选中对勾显示
             this.orglist[0].checked = true;



             //项目列表传值
             this.orglist.forEach(function(item,index){
                 if(item.identification == curOrgId){
                     curOrgList = item;
                 }
             })

              var curRole = this.setLocstorageToken(curOrgList["userIds"]);

              //获取当前用户id集合
              this.userIds = curOrgList["userIds"];

              
              var obj = {
                "identification": curOrgId,
                "userFirst": curOrgList["userIds"][0],
                "userIds": curOrgList["userIds"],
                "role":curRole
              }

             

              storage.set("orgId", obj);

              
              this.obj = obj;

              //显示logo
              if(this.orglist[0]["logo"]){
                  this.imgUrlFlag= true;
                  this.imgUrl = this.orglist[0]["logo"];
              }


          //手机号登录
          }else{
            
              var identification = this.orglist[0]["identification"];
              var userIdFirst = this.orglist[0]["userIds"][0];
              //获取当前角色
              this.userIds = this.orglist[0]["userIds"];
              var curRole = this.setLocstorageToken(this.userIds);
              //选中红对勾显示
              this.orglist[0].checked = true;
              var obj = {
                "identification": identification,
                "userFirst": userIdFirst,
                "userIds": this.userIds,
                "role":curRole
              }
              storage.set("orgId", obj);
              //项目列表进行传值
              this.obj = obj;
              //显示logo
              if(this.orglist[0]["logo"]){
                this.imgUrlFlag= true;
                this.imgUrl = this.orglist[0]["logo"];
              }
          }
          
      },

      //机构列表排序
      changeOrgList(curOrgId){

           //获取当前机构Id
           var curIndex = "";
           this.orglist.forEach(function (item, index) {
                  if (curOrgId == item.identification) {
                      curIndex = index;
                  }
            })
            var curObj = this.orglist[curIndex];
            // 删除选中机构id,将其插入数组第一项，改变数组。
            this.orglist.splice(curIndex, 1);
            this.orglist.unshift(curObj);
            return this.orglist;
            
      },
      setLocstorageToken(curUserId){
        //new初始化获取用户token 和 role 进行存储;
        var token_json = JSON.parse(storage.get("exp_token_json"));
        var userIdFirst = curUserId[0];
        //console.log(JSON.stringify(token_json));
        var day30 = 60*60*24*30;
        var getToken = token_json[userIdFirst];
        //console.log("gettoke=====" ,userIdFirst , getToken);
        //console.log("tokenjsom=====" , token_json);
        var token_name = getToken.split(".")[1];
        var decode_token = JSON.parse(Base64.decode(token_name));
        var role = decode_token["role"];
        return role;

      },
      initList () {
        //判断当前的角色;
        var token_json = !!storage.get("exp_token_json")&&JSON.parse(storage.get("exp_token_json"));

        //机构角色
        var role = storage.get("exp_role");
        var data = setIds(token_json);

        //用户存在
        //var curIndex = "";
        var userIds="";

        model.getOrgList(data, (res => {
          this.orglist = res.data;
          var _this = this;
          this.orglist.forEach(function (item,index) {
            _this.$set(item,'checked',false);
          })
          this.defaultname = this.orglist.length > 0 && this.orglist[0]["name"];
          if (this.orglist != undefined && this.orglist.length != 0) {
              //二次进入机构列表
              if (storage.get("orgId") != undefined) {
                var orgId = storage.get("orgId");
                var identification = orgId["identification"];
                var userId = parseInt(orgId["userFirst"]);
                this.userIds = orgId["userIds"];
                //如果key存在,记录第二次登录
                if (token_json[userId]) {
                  //console.log("第二次登陆");
                  this.changeOrgList(identification);

                  this.defaultname = this.orglist[0]["name"];
                  //选中对勾显示
                  this.orglist[0].checked = true;
                  //显示logo
                  if(this.orglist[0]["logo"]){
                    this.imgUrlFlag= true;
                    this.imgUrl = this.orglist[0]["logo"];
                  }
                  //项目列表进行传值
                  this.obj = orgId;

                //如果key不存在,第二次进行登录
                }else{
                  //console.log("第二次切换登陆");
                  this.orgIdNext();
                }

                //用户第一次登录
              } else {
                  this.orgIdNext();
                  //console.log("第一次登陆");
              }

            //存储机构权限
            limits(this.userIds);

            this.$store.state.orgObj = this.obj;

          }
        }))
      },
      // 获取机构账户信息
      getAccountInfo(){
        if((new Date().getTime() - this.lastGetInfo) < 3000){
          return
        }
        let data = {
            orgId: !!this.$route.query.orgId ? this.$route.query.orgId : localStorage.orgId ? JSON.parse(localStorage.orgId).identification : '',
        }

        if(!data.orgId) return
        httpRequest.getAccountInfo(data,(res)=>{
            this.lastGetInfo = new Date().getTime();
            if(res.status==200){
              
                this.vipInfo.vip = res.data.vip;
                console.warn(this.vipInfo.vip);
            }else{
                // this.$message.error(res.message);
            }
        })
      },
    },

  };
</script>
<style scoped lang="less">
  @import "../../assets/reset-element-ui/item.css";
  @img: "../../assets/img/item";
  .menu-height{
    height: 100px;
    overflow:hidden;
  }
  #orgLayer {
    width: 100%;
    height: 78px;
    margin-top: -78px;
  }
  .org-logo {
    position: absolute;
    width: 57px;
    height: 57px;
    border-radius: 90px;
    top:50%;
    margin-top:-28px;
    margin-left: 10px;
  }
  .vip-logo{
    width: 36px;
    height: 18px;
    margin-left: 10px;
  }
  .org-menu {
    display: block;
    height: 100%;
    margin-left: 80px;
    >h1 {
      margin-right: 14px;
      font-size: 18px;
      color: #fff;
      margin-top: 26px;
      float: left;
    }
    .el-dropdown {
      font-size: 14px;
      color: #fff;
      margin-top: 24px;
    }
    .el-icon-d-arrow-right {
      transform:rotate(90deg);
      font-size: 12px;
    }
    .el-dropdown-link {
      display: inline-block;
      cursor: pointer;
      border-radius: 100px;
      background-color: rgba(0, 0, 0, 0.43);
      font-size: 14px;
      color: #FFFFFF;
      width: 101px;
      height: 27px;
      text-align:center;
      line-height: 27px;
      i{
        margin-left: 4px;
      }
    }


  }
  .org-down {
    width: 260px;
    font-size: 14px;
    color: #000;
    border-radius: 3px;
  }
  .org-down-height{
    max-height: 500px;
    overflow-y: auto;
  }
  .org-down .active{
    background: url("../../assets/img/icon/icon-check.png") no-repeat 97% center;
  }
  .org-down .el-dropdown-menu__item {
    white-space: nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    line-height: 34px;
    height: 34px;
    border-bottom: 1px solid #f2f0f0;
    &:last-child{
      border-bottom: 0;
    }
  }
</style>

      <!--<img src="../../assets/img/common/avatar.png" class="org-logo" alt="">-->
