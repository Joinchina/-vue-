<template>
  <div class="j-group">
    <div class="j-content round-layout">

      <h2 class="clearfix right"  v-if="getRole !== 'PROFESSOR'">
          <span>
          <router-link :to="{path:'/clazz/lifesev',query:{clazzId:clazzId}}">生活服务</router-link>
          </span>
         <i></i>
        <span>
        <router-link :to="{path:'/clazz/detail',query:{clazzId:clazzId}}">班级详情</router-link>
        </span>
        <!-- <i></i>
        <span>
          <router-link :to="{path:'/clazz/set',query:{clazzId:clazzId}}">班级设置</router-link>
        </span> -->
      </h2>
      <h2 class="clearfix right" v-else>
        <span>
          <router-link :to="{path:'/clazz/detail',query:{clazzId:clazzId}}">班级详情</router-link>
        </span>
      </h2>
      <el-row :gutter="24">
        <el-col :span="6" @click.native="routerLink('signup')" v-if="getRole!='PROFESSOR'">
          <div class="grid-content bg-purple" >
            <span class="clazz-signup"></span>
            <span class="text">
              学员报名
            </span>
          </div>
        </el-col>
        <el-col :span="6" @click.native="routerLink('notice')">
          <div class="grid-content bg-purple" >
            <span class="clazz-notice"></span>
            <span class="text">
              通知管理
            </span>
          </div>
        </el-col>
        <el-col :span="6" v-if="getRole !== 'PROFESSOR'" @click.native="routerLink('signin')">
          <div class="grid-content bg-purple" >
            <span class="clazz-signin"></span>
            <span class="text">
                 签到管理
            </span>
          </div>
        </el-col>
        <el-col :span="6" v-if="getRole !== 'PROFESSOR'" @click.native="routerLink('learncase')">
          <div class="grid-content bg-purple" >
            <span class="clazz-learncase"></span>
            <span class="text">
                 班级学情
            </span>
          </div>
        </el-col>
        <el-col :span="6"  @click.native="routerLink('integral')">
          <div class="grid-content bg-purple" >
            <span class="clazz-intergral"></span>
            <span class="text">
                  积分管理
            </span>
          </div>
        </el-col>
        <el-col :span="6" v-if="getRole !== 'PROFESSOR'" @click.native="routerLink('group')">
          <div class="grid-content bg-purple" >
            <span class="clazz-group"></span>
            <span class="text">
                 分组管理
            </span>
          </div>
        </el-col>
        <el-col :span="6"  v-if="getRole !== 'PROFESSOR'" @click.native="routerLink('course')">
          <div class="grid-content bg-purple" >
            <span class="clazz-course"></span>
            <span class="text">
                  课程安排
            </span>
          </div>
        </el-col>
        <el-col :span="6" @click.native="routerLink('post')">
          <div class="grid-content bg-purple" >
            <span class="clazz-post"></span>
            <span class="text">
                 帖子管理
            </span>
          </div>
        </el-col>
        <el-col :span="6" @click.native="routerLink('interact')">
          <router-link target="_blank" :to="{path : '/clazz/interact/full', query: { clazzId: clazzId}}">
            <div class="grid-content bg-purple" >
              <span class="clazz-interact"></span>
              <span class="text">
                 互动点名
              </span>
            </div>
          </router-link>
        </el-col>
        <el-col :span="6" v-if="getRole !== 'PROFESSOR'">
          <router-link :to="{path : '/clazz/dailyrecord/list', query: { clazzId: clazzId}}">
            <div class="grid-content bg-purple" >
              <span class="clazz-record"></span>
              <span class="text">
                 日志管理
              </span>
            </div>
          </router-link>
        </el-col>
        <el-col :span="6" v-if="getRole !== 'PROFESSOR'" @click.native="routerLink('certificate')">
          <router-link  :to="{path : '/clazz/certificate/list', query: { clazzId: clazzId}}">
            <div class="grid-content bg-purple" >
              <span class="icon-certificate"></span>
              <span class="text">
                 颁发证书
              </span>
            </div>
          </router-link>
        </el-col>
      </el-row>
    </div>

  </div>
</template>
<script>
  import { getCurRole } from "../../filters/userVerify"
  export default {
    data(){
      return{
        clazzId:"",
        getRole:getCurRole()
      }
    },
    created(){
      this.clazzId = this.$route.query.clazzId;
    },
    methods:{
      routerLink(type){
//        if(type == "notice"){
//            this.$router.push("/clazz/notice/list?clazzId="+this.clazzId);
//        }else if(type == "")
        switch (type){
            case "notice":
            this.$router.push("/clazz/notice/list?clazzId="+this.clazzId);
            break;
          case "signin":
            this.$router.push("/clazz/signin/res?clazzId="+this.clazzId);
            break;
          case "learncase":
            this.$router.push("/clazz/learncase/list?clazzId="+this.clazzId);
            break;
          case "integral":
            this.$router.push("/clazz/integral/list?clazzId="+this.clazzId);
            break;
          case "group":
            this.$router.push("/clazz/group/list?clazzId="+this.clazzId);
            break;
          case "course":
            this.$router.push("/clazz/course/result?clazzId="+this.clazzId);
            break;
          case "post":
            this.$router.push("/clazz/post/list?clazzId="+this.clazzId);
            break;
          case "certificate":
            this.$router.push("/clazz/certificate/list?clazzId="+this.clazzId);
            break;
          // case "interact":
          //   this.$router.push("/clazz/interact/full?clazzId="+this.clazzId);
          //   break;
          case "signup":
            this.$router.push("/clazz/signUP/steps?clazzId="+this.clazzId);
            break;
          default:
        }
      }
    }
  }
</script>
<style scoped="" lang="less">
  .j-group li{
    border: 1px solid red;
    margin-right: 20px;
    width: 100px;
    height: 100px;
  }
  .j-group{
    .j-content{
      padding:0 32px 70px 80px;
      h2{
        float: right;
        padding-right: 30px;
        color: #333;
        font-size:17px;
        padding-top:22px;
        a{ color: #333;}
        i{
          background:url("../../assets/img/clazz/clazz-line.png") no-repeat;
          width: 1px;
          height: 12px;
          overflow: hidden;
          display: inline-block;
          margin:0 14px;
        }
      }
    }
    .bg-purple:hover{
      box-shadow: 1px 17px 15px -11px rgba(204,204,204,0.44);
      transition: all 0.2s;
      -moz-transition:all 0.2s;
      -webkit-transition: all 0.2s;
      -o-transition: all 0.2s;
    }
    .bg-purple {
      box-sizing: border-box;
      background: #fff;
      border: 0;
      border: 1px solid #e6e6e8;
      margin-bottom: 36px;
      padding-left: 36px;
       transition: all 0.2s;
      -moz-transition:all 0.2s;
      -webkit-transition: all 0.2s;
      -o-transition: all 0.2s;
      height: 89px;
      line-height: 89px;
      width: 216px;
      cursor: pointer;
      position: relative;
      .clazz-signup{
        background: url("../../assets/img/clazz/clazz-signup.png") no-repeat;
        background-size: 100% 100%;
        width: 44px;
        height: 44px;
        display: inline-block;
        vertical-align: middle;
      }
      .clazz-notice{
        background: url("../../assets/img/clazz/clazz-notice.png") no-repeat;
        width: 44px;
        height: 44px;
        display: inline-block;
        vertical-align: middle;
      }
      .clazz-signin{
        background: url("../../assets/img/clazz/clazz-signin.png") no-repeat;
        width: 44px;
        height: 44px;
        display: inline-block;
        vertical-align: middle;
      }
      .clazz-intergral{
        background: url("../../assets/img/clazz/clazz-intergral.png") no-repeat;
        width: 44px;
        height: 44px;
        display: inline-block;
        vertical-align: middle;
      }
      .clazz-group{
        background: url("../../assets/img/clazz/clazz-group.png") no-repeat;
        width: 44px;
        height: 44px;
        display: inline-block;
        vertical-align: middle;
      }
      .clazz-course{
        background: url("../../assets/img/clazz/clazz-course.png") no-repeat;
        width: 44px;
        height: 44px;
        display: inline-block;
        vertical-align: middle;
      }
      .clazz-post{
        background: url("../../assets/img/clazz/clazz-post.png") no-repeat;
        width: 44px;
        height: 44px;
        display: inline-block;
        vertical-align: middle;
      }
      .clazz-interact{
        background: url("../../assets/img/clazz/clazz-interact.png") no-repeat;
        width: 44px;
        height: 44px;
        display: inline-block;
        vertical-align: middle;
      }
      .clazz-record{
        background: url("../../assets/img/clazz/clazz-record.png") no-repeat;
        width: 44px;
        height: 44px;
        display: inline-block;
        vertical-align: middle;
      }
      .clazz-learncase {
        background: url("../../assets/img/clazz/clazz-learncase.png") no-repeat;
        width: 44px;
        height: 44px;
        display: inline-block;
        vertical-align: middle;
      }

      .icon-certificate {
          display: inline-block;
          width: 44px;
          height: 44px;
          background: url("../../assets/img/icon/icon-certificate.png") no-repeat;
          vertical-align: middle;
      }

      .text{
        font-size: 18px;
        display: inline-block;
        padding-left: 8px;
        color: #666;
      }
      .text a{
        color: #666;
      }
  }
  }
  .el-row{
    margin-top:120px;
  }
</style>
