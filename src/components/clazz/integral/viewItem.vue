<template>
  <div class="j-view">
    <el-dialog
      class="dialog-form pointsItemdialog"
      :title="'查看积分—'+itemLabel"
      @open="viewIntergral"
      :visible.sync="dialogViewPointsItem"
      :close-on-click-modal="false"
      :before-close="close"
    >
      <!--title-->
      <div class="title">
        <div v-if="miniAvatar !== ''">
          <img :src="miniAvatar">
        </div>
        <div v-else>
          <img src="../../../assets/img/activity/example2.png">
        </div>
        {{name}}
      </div>
      
      <!--content-->
      <div class="tableIntegralBox">
          <button data-v-74b68b4e="" type="button" class="exportBtn" @click="exportIntegralItem">
              <i class="icon-export-white"></i>
              导出
          </button>
          <el-table class="list" :data="tableData" stripe>
        
            <el-table-column prop="reason" label="加分原因" width="260"></el-table-column>
            <el-table-column prop="createDate" label="时间" width="220"></el-table-column>
            <el-table-column prop="integral" label="分值">
            <template slot-scope="scope">
                <p class="scroeD">{{ scope.row.integral | filterIntegral}}</p>
            </template>
            </el-table-column>
        </el-table>
      </div>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="close">确定</el-button>
        <el-button @click="close">关闭</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>
<script>
import model from "model/clazz/integral";
import bus from "@/global/bus";
import API from '@/global/resource'
import { getToken } from '@/filters/userVerify'
export default {
  props: ["dialogViewPointsItem", "seeRow"],
  data() {
    return {
      tableData: [],
      userIdOn: "",
      name: "",
      miniAvatar: "",
      itemLabel:''
    };
  },
  created() {
    var _this = this;
    console.warn(11111);
  },
  beforeDestroy() {
    bus.$off("itergralView");
  },
  filters: {
    filterType: function(value) {
      switch (value) {
        case "SYSTEM_TASK":
          value = "系统任务";
          break;
        case "CLAZZ_TASK":
          value = "班级任务";
          break;
        case "MANUAL_TASK":
          value = "手动加分";
          break;
        default:
      }
      return value;
    },
    filterIntegral(value) {
      return "+" + value;
    },
    pointesItem: function(param) {
      return (param.split("Integral")[0] + "reason").toLocaleUpperCase();
    }
  },
  methods: {
    viewIntergral() {
        this.itemLabel = this.seeRow.column.label;
        let data ={
            integralReasonType: this.seeRow.column.property,
            clazzId: this.seeRow.row.clazzId,
            userId: this.seeRow.row.identification,
        }
        model.integraItemsDetail(data, res => {
            if (res.status == 200) {
            this.tableData = res.data.integralDetails;
            this.name = res.data.name;
            if (!!res.data.miniAvatar) {
                this.miniAvatar = res.data.miniAvatar;
            }
            } else {
            this.$message.error(res.message);
            }
        });
    },
    close() {
        this.tableData=[];
        this.$emit("update:dialogViewPointsItem", false);
        this.miniAvatar="";
    },
    exportIntegralItem(){
        if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
        window.open(API.urls.exportItemsDetail+"?clazzId="+this.seeRow.row.clazzId+"&token="+getToken()+"&userId="+this.seeRow.row.identification+"&integralReasonType="+this.seeRow.column.property)
    }
  }
};
</script>
<style scoped="" lang='less'>
@import "../../../assets/reset-element-ui/user-table.css";
@import "../../../assets/less/icon.less";
.j-view {
}
.j-view .title {
  text-align: center;
  color: #006295;
  font-size: 18px;
  margin-bottom: 14px;
  margin-top: -30px;
}
.j-view .title img {
  margin-bottom: 6px;
  border-radius: 50%;
  width: 75px;
  height: 75px;
}
.scroeD{
    color: #FD7E23;
}
.exportBtn{
    position: absolute;
    padding: 0 20px;
    height: 30px;
    line-height: 30px;
    color: #fff;
    background-color: #11ADA6;
    border-radius: 6px;
    border: 0;
    cursor: pointer;
    right: 36px;
    top: -60px;
    .icon-export-white{
      vertical-align: sub;
      width: 14px;
      height: 14px;
    }
    &::after{
      position: absolute;
      right: -6px;
      top: -10px;
      width: 27px;
      height: 15px;
      content: "";
      background: url("../../../assets/img/expert/vipLogo.png") center center no-repeat;
      background-size: 27px 14px;
    }
}
.tableIntegralBox{
    position: relative;
}
</style>
<style lang="less">
    .pointsItemdialog.dialog-form{
        .el-dialog__body{
            overflow-y: visible;
            padding: 0;
            padding-bottom: 30px;
        }
        .el-table{
            max-height: 360px;
            overflow: auto;
            width: 90%;
            margin: 0 auto;
        }
    }
</style>
