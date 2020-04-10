<template>
    <div id="content">
        <div class="pathnav">
             <Goback :passtitle="passtitle"></Goback>
        </div>
        <div class="add-clazz-t">
          <button type="button" class="btn-export" @click="groupExport">
            <i class="icon-export-white"></i>
            导出
          </button>
        </div>
        <div class="ranklist">
            <div class="ranktitle">
                <img src="../../../assets/img/icon/tanhao.png" alt="">
                <h1>小组积分是当前所有成员的积分平均值</h1>
            </div>
            
            <div class="ranktable">
                <template>
                    <el-table
                    :data="tableData"
                     :empty-text="loading_font"
                    stripe
                    style="width: 100%; text-align:center"
                    :header-cell-style="rowClass"
                    >
                    <el-table-column
                        type="index"
                        label="排名"
                        width="100">
                        <template slot-scope="scope">
                            <div class="number">
                               {{scope.$index | number}}
                               <img src="../../../assets/img/clazz/one.png" alt=""  v-if="scope.$index==0">
                               <img src="../../../assets/img/clazz/two.png" alt="" v-else-if="scope.$index==1">
                               <img src="../../../assets/img/clazz/three.png" alt="" v-if="scope.$index==2">
                            </div>                            
                        </template>
                    </el-table-column>
                    <el-table-column
                        property=""
                        label="组名"
                        width="400">
                        <template slot-scope="scope">
                            <div class="setimg">
                                <span v-if="scope.row.miniLogo"><img :src="scope.row.miniLogo" alt=""></span>
                                <span v-else><img src="../../../assets/img/icon/moimg.png" alt=""></span>
                                <div class="setimglogo">
                                    <img src="../../../assets/img/clazz/one_l.png" alt=""   v-if="scope.$index==0">
                                    <img src="../../../assets/img/clazz/two_l.png" alt=""   v-else-if="scope.$index==1">
                                    <img src="../../../assets/img/clazz/three_l.png" alt="" v-if="scope.$index==2">
                                </div>
                                <h1>{{scope.row.name}}</h1>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        property="integral"
                        label="成员平均积分"
                        >
                    </el-table-column>
                    </el-table>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
 import Goback from 'base/goback/goback';
import model from "model/clazz/group";
import API from "@/global/resource";
import { getToken } from "@/filters/userVerify";
export default {
  data() {
    return {
      tableData: [],
      classid: "",
       passtitle:'小组排行',
        	loading_font:this.$globalParam.loadText
    };
  },
  filters: {
    number: function(value) {
      if (value == 0 || value == 1 || value == 2) {
        return (value = "");
      } else {
        return value + 1;
      }
    }
  },
  created() {
    this.classid = this.$route.query.clazzaa;
    this.getRanklist();
  },
  methods: {
    groupExport() {
      if(!this.$store.getters.getOrgVipInfo.vip){
          this.$store.state.vipFuncPopFalg = true;
          return;
      }
      window.open(
        API.urls.getRank + "?clazzId=" + this.classid + "&token=" + getToken()
      );
    },
    getRanklist() {
      var data = {
        clazzId: this.classid
      };
      model.getRanklist(data, res => {
        if (res.status == 200) {
          //  console.log(res.data)
          this.tableData = res.data;
          this.loading_font=this.$globalParam.dataEmpty;
        }
      });
    },
    rowClass({ row, rowIndex}) {
        return 'text-align:center'
    }
  },
  components: {
    Goback
  }
};
</script>
<style lang="less" scoped>
@import "../../../assets/less/icon.less";
  @import "../../../assets/less/btn-search.less";
@import "../../../assets/reset-element-ui/user-table.css";
#content {
  .pathnav {
    float: left;
  }
  .add-clazz {
    padding: 0 0 !important;
    i {
      display: inline-block;
      padding-right: 3px;
    }
    button {
      padding: 9px 21px 10px 13px;
    }
  }
  .ranklist {
    width: 100%;
    overflow: hidden;
    background-color: #ffffff;
    padding: 20px 50px 20px 50px;
    float: left;
    border-radius: 6px;
    box-shadow: 0 0 3px #eee;
    .ranktitle {
      width: 100%;
      overflow: hidden;
      margin-bottom: 18px;
      img {
        float: left;
        margin: 3px 10px 0 20px;
      }
      h1 {
        font-size: 16px;
        color: #4a4a4a;
      }
    }
    .ranktable {
      width: 100%;
      overflow: hidden;
      .setimg {
        width: 100%;
        height: 40px;
        overflow: hidden;
        display: block;
        float: left;
        position: relative;
        span {
          img {
            width: 40px;
            height: 40px;
            border-radius: 40px;
            margin-left: -50px;
          }
        }
        .setimglogo {
          img {
            position: absolute;
            top: 20px;
            left: 140px;
          }
        }

        h1 {
          position: absolute;
          top: 0;
          left:200px;
          font-size: 14px;
          color: #333333;
          margin-top: 12px;
        }
      }
    }
  }
  .btn-export{
    position: relative;
    &::after{
      position: absolute;
      right: -10px;
      top: -10px;
      width: 27px;
      height: 15px;
      content: "";
      background: url("../../../assets/img/expert/vipLogo.png") center center no-repeat;
      background-size: 27px 14px;
    }
  }
}
</style>


