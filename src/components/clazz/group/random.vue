<template>
  <div>
    <el-dialog class="dialog-form" title="随机分组"
               :visible.sync="dialogCreateRandom"
               :close-on-click-modal="false"
               :before-close="close"
               @open="open"
              >
      <div class="j-random"  v-loading="loading"
           element-loading-text="拼命加载中">
        <h2>学员共<span>{{totalElements}}</span>人</h2>
        <div class="content">
          <h3>分<input type="text" name="groupCount" @keyup="divideIntoGroup"/>组</h3>
          <p>
            <!--<span id="randomGroupTips" v-show="errorMsg">请输入符合规则的数值</span>-->
            <span id="randomGroupTips"></span>
          </p>
        </div>
        <div class="notice">
          注：每组最少3人，每班最多支持分50组<br/>
          如果人数不能整除，那么各小组人数最多差相差1人
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="!loading && conFirm()">确定</el-button>
        <el-button @click="close">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import model from "model/members/members";
  import group from "model/clazz/group";
  import bus from "@/global/bus"
  export default {
     props:["dialogCreateRandom","groupCeates"],
      data(){
        return{
          loading:false,
          clazzId:"",
          totalElements:0,
          groupCount:"",
          errorMsg:false
        }
      },
     created(){
        this.clazzId = this.$route.query.clazzId;
        this.getMemberTotal();
     },
      methods:{
        open() {
          this.loading = false;
        },
        getMemberTotal(){
          var data = {
            clazzId:this.clazzId
          }
          model.getClazzStudentList(data, ( res => {
            if(res.status == 200){
              this.totalElements = res.data.totalElements;
            }else{
              this.$message.error(res.message)
            }


          }))
        },
        divideIntoGroup(){
          this.groupCount = $("input[name='groupCount']").val();
          this.totalElements = ~~this.totalElements;
          this.groupCount = ~~this.groupCount;
          if(this.totalElements <= 0){
            $('#randomGroupTips').html('请输入符合规则的组数');
            return;
          }
          if(this.groupCount <= 0){
            $('#randomGroupTips').html('请输入符合规则的组数');
            return;
          }
          if(this.groupCount > 50){
            $('#randomGroupTips').html('请输入符合规则的组数');
            return;
          }
          if(this.groupCount*3 > this.totalElements){
            $('#randomGroupTips').html('请输入符合规则的组数');
            return;
          }
          $('#randomGroupTips').html('约' + Math.round(this.totalElements/this.groupCount) + '人一组');

        },
        conFirm(){
          this.loading = true;
          var _this = this;
          if($('#randomGroupTips').html() == "" || $('#randomGroupTips').html() == "请输入符合规则的组数"){
            this.loading = false;
            $('#randomGroupTips').html("请输入符合规则的组数");
            return;
          }
          //随机成功页面更新
          if(_this.groupCeates  ==  "1"){
            bus.$emit("GroupCreate","1")
          }
          var data = {
            clazzId:this.clazzId,
            groupCount:this.groupCount
          }
          group.groupRandomCreate(data, ( res => {
            if(res.status == 200){
              this.loading = false;
              //随机成功页面更新
              if(this.groupCeates  ==  "1"){
                bus.$emit("GroupCreate","1")
              }
              this.close();

              //成功后清空值
              $("input[name='groupCount']").val("");
              this.groupCount = "";
            }else{
              this.loading = false;
              this.$message.error(res.message);
            }


          }))
        },
        close () {
          this.$emit('update:dialogCreateRandom', false);
        },
      }
  }
</script>
<style scoped="" lang="less">
.j-random{
  width: 335px;
  margin:0 auto;
  text-align: center;
  h2 {
    padding: 32px 0 22px 0;
    color: #666;
    font-size: 20px;
    span {
      color: #fd7e23;
    }
  }
  .content{
      background: url("../../../assets/img/clazz/group-random-bg.png") no-repeat;
      width: 259px;
      height: 187px;
      margin-left: 40px;
      h3{
        padding:46px 0 0 0;
        color: #333;
        font-size:22px;
        input{
          border: 1px solid #54a9a9;
          width: 116px;
          height: 34px;
          line-height: 34px;
          border-radius: 4px;
          margin-left: 8px;
          margin-right:8px;
          background: #fff9f7;
          text-align: center;
        }
      }
      p{
        margin-top:16px;
        font-size: 18px;
        color: #fd7e23;
        line-height: 27px;
      }
    }
    .notice{
        padding:28px 0 0 0;
        color: #999;
        line-height: 28px;
        font-size:14px;
    }
  }
</style>
