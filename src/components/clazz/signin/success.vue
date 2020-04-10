<template>
  <div id="waddSucc">
    <el-dialog class="dialog-form" title="签到详情"
               :visible.sync="dialogSignSuccess"
               :close-on-click-modal="false"
               :before-close="close">
        <dl>
          <dt>
            <img src="../../../assets/img/common/pic-succ.png" alt="">
            <h1 class="tip">创建签到成功</h1>
          </dt>
        </dl>
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
        <div slot="footer" class="dialog-footer">

          <el-button @click="close">关闭</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
  import API from '@/global/resource'
  import {getToken} from "@/filters/userVerify"
  import bus from  "@/global/bus"
  export default {
    props:["dialogSignSuccess","signSuccessDataP"],
    created(){
        this.clazzId = this.$route.query.clazzId;
    },
    watch:{
      signSuccessDataP:"getData"
    },
    data(){
      return{
        signSuccessData:{},
        clazzId:"",
        signId:"",
        clazzName:"",
        signData:"",
        beginTime:"",
        endTime:"",
        signType:"",
        qrcodeUrl:""
      }
    },
    methods:{
      close () {
        this.$emit('update:dialogSignSuccess', false);

      },
      loadQrcold(){

        window.open(API.urls.signCodeDownLoad+"?signId="+this.signId + "&token="+getToken());
        // window.open(API.urls.signCodeDownLoad+"?clazzId="+this.clazzId+"&token="+getToken()+"&signDate="+this.signData+"&signTime="+this.beginTime+"-"+this.endTime+"&urlString="+this.qrcodeUrl+"&type="+this.signType);

      },
      getData(){
        this.clazzId = this.$route.query.clazzId;
        let signSuccessData = this.signSuccessDataP;
        this.signId = signSuccessData.id;
        this.clazzName = signSuccessData.clazzName
        this.signData = signSuccessData.signDate;

        this.beginTime = signSuccessData.beginTime;
        this.endTime = signSuccessData.endTime;
        this.signType = signSuccessData.signType;
        this.qrcodeUrl = signSuccessData.url;
        bus.$emit('dialogSignSuccess', "1");
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
        width:562px;
        margin:0 auto;
        .j-left{
          float: left;
          border-right: 1px solid #e6e6e6;
          width: 60%;
        }
        .j-left h1{
          font-size: 20px;
          color: #000;
        }
        .j-left p{
          padding-top: 20px;
          color: #666;
          font-size: 16px;
        }
        .j-rg{
          float: left;
          padding-left: 44px;
        }
    }
  }
</style>
