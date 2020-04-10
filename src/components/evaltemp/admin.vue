<template>
  <div class="j-group">
    <div class="j-content round-layout">
      <el-row :gutter="24">
        <el-col :span="6" @click.native="routerLink('coureva')">
          <div class="grid-content bg-purple" >
            <span class="t-cour-eva"></span>
            <span class="text">
              修改课程评价
            </span>
          </div>
        </el-col>
        <el-col :span="6" @click.native="routerLink('courref')">
          <div class="grid-content bg-purple" >
            <span class="t-cour-ref"></span>
            <span class="text">
                 修改课程反思
            </span>
          </div>
        </el-col>
        <el-col :span="6"  @click.native="routerLink('clazzeva')">
          <div class="grid-content bg-purple" >
            <span class="t-pro-eva"></span>
            <span class="text">
                  修改项目评价
            </span>
          </div>
        </el-col>
        <el-col :span="6" @click.native="routerLink('clazzref')">
          <div class="grid-content bg-purple" >
            <span class="t-pro-ref"></span>
            <span class="text">
                 修改项目反思
            </span>
          </div>
        </el-col>
        <el-col :span="6" @click.native="routerLink('draft')">
          <div class="grid-content bg-purple" >
            <span class="t-qustion"></span>
            <span class="text">
                  问卷草稿
            </span>
          </div>
        </el-col>
        <el-col :span="6" @click.native="routerLink('questemp')">
          <div class="grid-content bg-purple" >
            <span class="icon-questemp"></span>
            <span class="text">
                  问卷模板库
            </span>
          </div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>
<script>
  import { getCurRole } from "../../filters/userVerify"
  import Clazz from "model/clazz/clazz"
  export default {
    data(){
      return{
        clazzId:"",
        getRole:getCurRole(),
        orgId: "",
      }
    },

    created(){
      this.clazzId = this.$route.query.clazzId;
    },
    mounted() {
        this.getDetails();
    },
    methods:{

        routerLink(type){

            switch (type){
                case "coureva":
                this.$router.push("/evaltemp/result?clazzId="+this.clazzId+"&level=COURSE&type=EVALUATION&template=课程评价");
                break;
              case "courref":
                this.$router.push("/evaltemp/result?clazzId="+this.clazzId+"&level=COURSE&type=INTROSPECTION&template=课程反思 ");
                break;
              case "clazzeva":
                this.$router.push("/evaltemp/result?clazzId="+this.clazzId+"&level=CLAZZ&type=EVALUATION");
                break;
              case "clazzref":
                this.$router.push("/evaltemp/result?clazzId="+this.clazzId+"&level=CLAZZ&type=INTROSPECTION");
                break;
              case "draft":
                this.$router.push("/questionare/draft?clazzId="+this.clazzId);
                break;
              case "questemp":
                this.$router.push("/evaltemp/questemp/list?orgId="+this.orgId+"&clazzId="+this.clazzId);
                break;

              default:
            }
        },
        getDetails() {
            let data = {
                id: this.clazzId
            }
            Clazz.getClassInfor(data, (res => {
                if(res.status == 200) {
                    this.orgId = res.data.organizationId
                } else {
                    this.$message.error(res.message);
                }
            }));
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
        font-size:18px;
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
    .bg-purple {
      box-sizing: border-box;
      background: #fff;
      border: 0;
      box-shadow:-3px 0 3px #e7f5f3, 3px 0 3px #e7f5f3, 0 -3px 3px #e7f5f3, 0 3px 3px #e7f5f3;
      margin-bottom: 36px;
      padding-left: 18px;
      
      height: 89px;
      line-height: 89px;
      width: 216px;
      cursor: pointer;
      position: relative;
      .t-cour-eva{
        background: url("../../assets/img/template/t-cour-eva.png") no-repeat;
        width: 44px;
        height: 44px;
        display: inline-block;
        vertical-align: middle;
      }
      .t-cour-ref{
        background: url("../../assets/img/template/t-cour-ref.png") no-repeat;
        width: 44px;
        height: 44px;
        display: inline-block;
        vertical-align: middle;
      }
      .t-pro-eva{
        background: url("../../assets/img/template/t-pro-eva.png") no-repeat;
        width: 44px;
        height: 44px;
        display: inline-block;
        vertical-align: middle;
      }
      .t-pro-ref{
        background: url("../../assets/img/template/t-pro-ref.png") no-repeat;
        width: 44px;
        height: 44px;
        display: inline-block;
        vertical-align: middle;
      }
        .t-qustion{
            background: url("../../assets/img/template/t-qustion.png") no-repeat;
            width: 44px;
            height: 44px;
            display: inline-block;
            vertical-align: middle;
        }
        .icon-questemp {
            background: url("../../assets/img/template/icon-questemp.png") no-repeat;
            width: 44px;
            height: 44px;
            display: inline-block;
            vertical-align: middle;
        }

      .text{
        font-size: 20px;
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
