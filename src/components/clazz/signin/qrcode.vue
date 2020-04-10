<template>
  <div id="waddSucc">
    <el-dialog class="dialog-form" title="签到二维码"
               :visible.sync="dialogQrcodeSign"
               :close-on-click-modal="false"
               :before-close="close">
      <div class="j-sign-success">
        <div class="j-left">
          <h1>签到时间：{{signData}} {{beginTime}} - {{endTime}}</h1>
          <p>班级名称：{{clazzName}}</p>
          <p>签到模式：{{signType | filterSignType}}</p>
        </div>
        <div class="j-rg">
          <div><img :src="qrcodeUrl"/></div>
          <div class="mt12"><a href="javascript:void(0)" class="load-qrcode" @click="loadQrcold">下载签到二维码</a> </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import model from 'model/clazz/signin'
  import API from '@/global/resource'
  import {getToken} from "@/filters/userVerify"
  export default {
    props:["dialogQrcodeSign","signId"],
    data(){
      return{
          clazzId:"",
          clazzName:"",
          signData:"",
          beginTime:"",
          endTime:"",
          signType:"",
          qrcodeUrl:""
      }
    },
    created(){
      this.clazzId = this.$route.query.clazzId;
    },
    watch:{
      signId:"getQrCode",
    },
    methods:{
      getQrCode(){
        var data = {
          id: this.signId
        }
        model.signFindId(data, (res => {
          if(res.status == 200) {
            var data = res.data;
            this.clazzName = data.clazzName
            this.signData = data.signDate;
            this.beginTime = data.beginTime;
            this.endTime = data.endTime;
            this.signType = data.signType;
            this.qrcodeUrl = data.url;
          } else {
            this.$message.error(res.message);
          }
        }));
      },
      close () {
        this.$emit('update:dialogQrcodeSign', false);
      },
      loadQrcold(){

        window.open(API.urls.signCodeDownLoad+"?signId="+this.signId + "&token="+getToken());

      }
    },
    filters:{
      filterSignType(value){
        switch(value){
          case "common":
            value = "普通模式";
            break;
          case "avoid":
            value = "防作弊模式";
            break;
        }
        return value;

      }
    }
  }
</script>
<style scoped lang="less">
  @import "../../../assets/less/icon.less";

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
    .j-sign-success{
      .j-left{
        border-bottom: 1px solid #e6e6e6;
        width: 100%;
        padding-bottom: 38px;
      }
      .j-left h1{
        font-size: 20px;
        color: #000;
        width: 330px;
        margin: 0 auto;
      }
      .j-left p{
        padding-top: 20px;
        color: #666;
        font-size: 16px;
        width: 330px;
        margin: 0 auto;
      }
      .j-rg{
        padding-left: 44px;
        padding-top:28px;
        text-align: center;
      }
    }
  }
</style>
