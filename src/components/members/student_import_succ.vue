<style scoped lang="less">
  #waddSucc {
    img {
      display: block;
      width: 136px;
      height: 121px;
      margin: 0 auto;
    }
    .tip {
      font-size: 20px;
      color: #35a69d;
      line-height: 1.6em;
      margin-bottom: 30px;
    }
    dt {
      text-align: center;
    }
    dl {

      overflow: hidden;

    }
    dd {
      display: block;
      margin: 0 auto;
      width: 400px;
      font-size: 16px;
      color: #333;
      line-height: 1.6em;
      text-align: left;
      margin-left: 200px;
    }
  }
</style>
<template>
  <div id="waddSucc">
    <el-dialog class="dialog-form"
               :title="title"
               :visible.sync="dialogAddSucc"
               :close-on-click-modal="false"
               :before-close="close">

      <dl>
        <dt>
          <img src="../../assets/img/common/pic-succ.png" alt="">
        <h1 class="tip">导入成功{{dialogAddSucc}}</h1>
        </dt>
      </dl>
      <div class="import">
         <div class="header">
             <h1>学员现在可以登录app了，用户登录账号和密码</h1>
             <h1>已经通过短信发给学员</h1>
         </div>
        <div class="footer">
           <p>张三的手机已经存在</p>
           <p>张三的手机已经存在</p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="close">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

  export default {
    props: ['dialogAddSucc','title'],
    data() {
      return {
        pwd: ""
      }
    },

    methods: {
      close() {
        this.$emit('update:dialogAddSucc', false);
      }
    }
  }
</script>
<style scoped="">
   .import{}
   .import .header{
      padding-top:26px;
   }
   .import .header h1{
     font-size: 16px;
     color: #333;
     line-height:22px;
     padding-bottom: 8px;
   }
   .import .footer{
     padding-top:32px;
   }
   .import .footer p{
     line-height:22px;
     padding-bottom: 5;
     color: #999;
   }
</style>
