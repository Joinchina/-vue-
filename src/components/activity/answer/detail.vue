<template>
<div>
  <el-dialog class="dialog-form"  title="查看详情"
             :visible.sync="dialogDtailAnswer"
             :close-on-click-modal="false"
             :before-close="close">

      <div class="answer_con">
        <!--头部_start-->
        <ul class="con con_none">
          <li class="clearfix">
            <div class="clearfix">
              <div class="image"><img src="../../../assets/img/activity/example2.png"/></div>
              <div class="text">
                <h2>张三<span class="gray">2016-11-12 12:33</span></h2>
              </div>
            </div>
            <h3><a href="javascript:void(0)" @click="dtailAnswerf = true" class="title_hover">信息技术公司</a></h3>
            <div class="answer-detail">
            <p class="icon-con">在企业和学校和其他组织中在企业和学校和其他组织中在企业 <a href="javascript:void(0)" class="blue icon-more"> 展开更多<span class="answer-more"></span></a></p>

              <ul class="clearfix images ">
                <li><img src="../../../assets/img/activity/example.png" width="90" height="90"/></li>
                <li><img src="../../../assets/img/activity/example.png" width="90" height="90"/></li>
                <li><img src="../../../assets/img/activity/example.png" width="90" height="90"/></li>
                <li><img src="../../../assets/img/activity/example.png" width="90" height="90"/></li>
                <li><img src="../../../assets/img/activity/example.png" width="90" height="90"/></li>
              </ul>
            </div>
          </li>
        </ul>
        <!--头部_end-->
        <!--详情_start-->
        <ul class="con  answer-detail">
          <li class="clearfix border_none">
            <div class="image"><img src="../../../assets/img/activity/example2.png"/></div>
            <div class="text">
              <h2>张三<span class="gray">2016-11-12 12:33</span></h2>
              <p>在企业和学校和其他组织中在企业和学校和其他组织中在企业和学校和其他组织中在企业和学校和其他组织中在企业和学校和其他组织中在企业和学校和其他组织中</p>
            </div>
          </li>
          <li class="clearfix border_none">
            <div class="image"><img src="../../../assets/img/activity/example2.png"/></div>
            <div class="text">
              <h2>张三<span class="gray">2016-11-12 12:33</span></h2>
              <p>在企业和学校和其他组织中在企业和学校和其他组织中在企业和学校和其他组织中在企业和学校和其他组织中在企业和学校和其他组织中在企业和学校和其他组织中</p>
            </div>
          </li>
          <li class="clearfix border_none">
            <div class="image"><img src="../../../assets/img/activity/example2.png"/></div>
            <div class="text">
              <h2>张三<span class="gray">2016-11-12 12:33</span></h2>
              <p>在企业和学校和其他组织中在企业和学校和其他组织中在企业和学校和其他组织中在企业和学校和其他组织中在企业和学校和其他组织中在企业和学校和其他组织中</p>
            </div>
          </li>
        </ul>
        <!--详情_end-->

      </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">关闭</el-button>
    </div>
  </el-dialog>
</div>
</template>
<script>
  export default {
     props:["dialogDtailAnswer"],
      created(){
      },
     methods:{
       close () {
         this.$emit('update:dialogDtailAnswer', false);
       }
     }
  }
</script>
<style scoped lang="less">
  @import "../../../assets/less/activity.less";

</style>
