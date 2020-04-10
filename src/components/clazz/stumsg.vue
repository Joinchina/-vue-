<template>
  <div class="j-add-plus">
    <el-dialog class="dialog-form" title="查看学员信息"
               :visible.sync="dialogStuMsg"
               :close-on-click-modal="false"
               :before-close="close">
      <!--title-->
      <div class="title">
        <div v-if="!!dataMsg.miniAvatar&&dataMsg.miniAvatar !== ''"><img :src="dataMsg.miniAvatar" /></div>
        <div v-else><img src="../../assets/img/activity/example2.png"/></div>
        {{dataMsg.name}}<span class="j-gray">（{{dataMsg.username }}）</span>
      </div>
      <!--con-->
      <div class="j-stumag">
        <!--con-tit-->
        <div class="con-title">
          <h2>手机号：<span>{{dataMsg.phone}}</span></h2>
          <h2>单位：<span>{{dataMsg.workPlace}}</span></h2>
        </div>
        <!--con-content-->
        <div class="con-con">
          <p>性别：{{dataMsg.sex}}</p>
          <p>添加原因：{{dataMsg.addReason}}</p>
          <p>职称：{{dataMsg.title}}</p>
          <p>民族：{{dataMsg.nation}}</p>
          <p>身份证号：{{dataMsg.idnumber}}</p>
          <p>QQ：{{dataMsg.qq }}</p>
          <p>微信号：{{dataMsg.wechat}}</p>
          <p>省：{{dataMsg.province}}</p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary"  @click="close">确定</el-button>
        <el-button @click="close">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import bus from "@/global/bus";
  import model from 'model/clazz/clazz'
  export default {
    props: ['dialogStuMsg','stuId'],
    data(){
      return{
          dataMsg:{}
      }
    },
    methods:{
      getStuMsg(){
        var data = {
          id:this.stuId
        }
        model.getStuMsg(data, ( res => {
          // console.log("学员信息",res)
          if(res.status == 200) {
            this.dataMsg = res.data;
          }else{
            this.$message.error(res.message);
          }
        }))
      },
      close () {
        this.$emit('update:dialogStuMsg', false);
      },
    },
    watch: {
      stuId: 'getStuMsg'
    }
  }
</script>
<style scoped="" lang="less">
@import "../../assets/less/clazz";
@import "../../assets/reset-element-ui/form.css";
  .j-gray{
    font-size: 14px;
    color: #999;
  }
  .j-stumag{

    .con-title{
      padding-top:38px;
      color: #666;
      font-size: 20px;
      border-bottom: 1px solid #f0f0f0;
      padding-left: 48px;
      h2{
        padding: 0 0 18px;
      }
      span{
        color: #000;
      }
    }
    .con-con{
      padding-left: 48px;
      padding-top:18px;
      color: #999;
      font-size: 14px;
      p{
        padding-bottom: 16px;
      }
    }

  }
</style>
