<template>
	<div class="j-clazz" id="w-table">
    <!--header_start-面包屑-->
    <div class="bread-box">
      <Goback :passtitle="passtitle"></Goback>
      <div class="add-clazz">
        <button data-v-74b68b4e="" type="button" class="btn-export" @click="exportIntegral">
          <i class="icon-export-white"></i>
          导出
        </button>
      </div>
      <div class="search">
        <input type="text" v-model="searchQuery" placeholder="姓名" @keyup.13="getIntegralList()" /><i class="el-icon-search" @click.stop="getIntegralList()"></i>
      </div>
    </div>

    <!--list_start-->
    <div class="round-layout" >
      <el-table class="list"
                :empty-text="loading_font"
                align="center"
                tooltip-effect="light"
                :data="tableData.slice((cur_page-1)*pagesize,cur_page*pagesize)"
                
                stripe>
        <el-table-column
          fixed="left"
          width="60"
          label="操作" >
          <template slot-scope="scope">
            <!-- <el-button type="text" @click.native="IntergralView(scope.$index, scope.row)" class="btn-check">查看</el-button> -->
            <el-button v-if="getRole !== 'PROFESSOR'" type="text" @click.native="plusAddMethod(scope.$index, scope.row)" class="btn-addPlus">加分</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="rank"
          label="排名"
          width="60"
          fixed="left">
          <template slot-scope="scope">
            <span v-if="scope.row.first == 1">
              <i class="j-one"></i>
              </span>
            <span v-else-if="scope.row.second == 2">
              <i class="j-two"></i>
              </span>
            <span v-else-if="scope.row.three == 3">
              <i class="j-three"></i>
              </span>
            <span v-else>
              <span style="margin-left: 10px">{{ scope.row.rank }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          row-key = "1"
          label="姓名"
          :show-overflow-tooltip="true"
          fixed="left"
          width="210">
          <template slot-scope="scope" >
            <p v-if="scope.row.first == 1" class="j-table-pic">
              <span v-if="scope.row.miniAvatar"><img :src="scope.row.miniAvatar"/></span>
              <span v-else><img src="../../../assets/img/activity/example2.png"/>&nbsp;</span>
              <span class="j-one-l"></span>
              <a href="javascript:void(0)" @click="stuMsgView(scope.$index, scope.row)">{{ scope.row.name }}</a>
            </p>
            <p v-else-if="scope.row.second == 2" class="j-table-pic">
              <span v-if="scope.row.miniAvatar"><img :src="scope.row.miniAvatar"/></span>
              <span v-else><img src="../../../assets/img/activity/example2.png"/>&nbsp;</span>
              <span class="j-one-t"></span>
              <a href="javascript:void(0)" @click="stuMsgView(scope.$index, scope.row)">{{ scope.row.name }}</a>
            </p>
            <p v-else-if="scope.row.three == 3" class="j-table-pic">
              <span v-if="scope.row.miniAvatar"><img :src="scope.row.miniAvatar"/></span>
              <span v-else><img src="../../../assets/img/activity/example2.png"/>&nbsp;</span>
              <span class="j-one-r"></span>
              <a href="javascript:void(0)" @click="stuMsgView(scope.$index, scope.row)">{{ scope.row.name }}</a>
            </p>
            <p v-else  class="j-table-pic">
              <span><img src="../../../assets/img/activity/example2.png"/>&nbsp;</span>
              <span><a href="javascript:void(0)" @click="stuMsgView(scope.$index, scope.row)">{{ scope.row.name }}</a></span>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="integral"
          label="积分"
          fixed="left">
          <template slot-scope="scope">
            <el-button type="text" @click.native="IntergralView(scope.$index, scope.row)"  class="btn-check score">{{scope.row.integral}}</el-button>
          </template>
        </el-table-column>
        <!-- 预留不删除 -->
        
          <template v-for="(item,index) in intergralItem">
            <el-table-column 
            :label="item.integralReasonName" :prop="item.integralReasonType" :key="index" v-if="item.integralReasonType!='REVIEWHOMEWORKREASON'">
            <template slot-scope="scope">
            <el-button type="text" @click.native="IntergralViewOption(scope)" class="btn-check score">{{Boolean(scope.row.integralReasonVoList)?scope.row.integralReasonVoList[index].integral:0}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            :label="item.integralReasonName" :prop="item.integralReasonType" :key="index" v-else width="110">
            <template slot-scope="scope">
            <el-button type="text" @click.native="IntergralViewOption(scope)" class="btn-check score">{{Boolean(scope.row.integralReasonVoList)?scope.row.integralReasonVoList[index].integral:0}}</el-button>
            </template>
          </el-table-column>
          </template>
      </el-table>

    <!--page-footer-->
    <div class="j-page-footer">
      <p>共{{totalElements}}条&nbsp;每页6条</p>
    </div>
    <!--分页-->
    <div class="pagination">
      <el-pagination
        @current-change ="handleCurrentChange"
        layout="prev, pager, next"
        :page-size="6"
        :total="totalElements">
      </el-pagination>
    </div>
    <!--加分-->
    </div>
    <add-plus
      :dialogAddPlus.sync="addPlus"
      @updatedialogAddPlus="addSuccess"
      :userId = "identification">
    </add-plus>

    <!--查看积分-->
    <view-points
      :dialogViewPoints.sync="viewPoints"
      :userId = "identification"
    >
    </view-points>

    <!--查看学员-->
    <stu-msg
      :dialogStuMsg.sync="stuMsgFlag"
      :stuId="identification"
    >
    </stu-msg>
    <!-- 查看积分项 -->
    <viewPointsitem :dialogViewPointsItem.sync="dialogViewPointsItem" :seeRow="seeRow"></viewPointsitem>
	</div>
</template>
<script>
 import Goback from 'base/goback/goback'
  import addPlus from 'components/clazz/integral/add'
  import viewPoints from 'components/clazz/integral/view'
  import viewPointsitem from 'components/clazz/integral/viewItem'
  import stuMsg from 'components/clazz/stumsg'
  import model from 'model/clazz/integral'
  import API from '@/global/resource'
  import { getToken } from '@/filters/userVerify'
  import bus from "@/global/bus";
  import { getCurRole } from "../../../filters/userVerify"
  export default{
    data(){
      return{
        getRole:getCurRole(),
        clazzId:"",
        name:"",
        identification:"",
        addPlus:false,
        viewPoints:false,
        stuMsgFlag:false,
        dialogViewPointsItem: false,
        searchQuery:"",
        tableData:[],
        totalElements:0,
        cur_page:1,
        pagesize:6,
        addPlusObj:{
          name:"",
          identification:"",
          miniAvatar:"",
        },
        seeRow:{},
        passtitle:'积分管理',
        loading_font:this.$globalParam.loadText,
        intergralItem:[],
      }
    },
    created(){
      this.clazzId = this.$route.query.clazzId;
      this.getIntegralList();
    },
    methods:{
      handleCurrentChange(val){
        this.cur_page = val;
       // this.getIntegralList();
      },
      getIntegralList(){
       //暂时是分页接口，一次取10000条数据，后台后期进行优化
        var data = {
          name:this.searchQuery,
          number:1,
          size:6,
          clazzId:this.clazzId
        }
        model.IntegralList(data, ( res => {
          if(res.status == 200) {
            this.intergralItem = res.data.content[0].integralReasonVoList 
            this.tableData = res.data.content;
            
            this.loading_font=this.$globalParam.dataEmpty;
            this.totalElements = res.data.totalElements;
            if( !!this.tableData && this.tableData.length !=0){
              this.sortArray(this.tableData);

              if(!!this.tableData[0]){
                 this.tableData[0]["first"] = 1;
              }
              
              if(!!this.tableData[1]){
                 this.tableData[1]["second"] = 2;
              }

              if(!!this.tableData[2]){
                this.tableData[2]["three"] = 3;
              }
              
            }

          }else{
            this.$message.error(res.message);
          }
        }))
      },
      IntergralView(index,row){
          console.log(index);
          console.log(row);
          this.identification = row.identification;
          bus.$emit("itergralView",this.identification )
          this.viewPoints = true;

      },
      plusAddMethod(index,row){
        //加分点击确定获取值
        this.identification = row.identification;
        //bus 传值
        this.addPlusObj.identification = row.identification;
        this.addPlusObj.name = row.name;
        if(!! row.miniAvatar){
          this.addPlusObj.miniAvatar = row.miniAvatar;
        }
        bus.$emit("itergralAddPlus",this.addPlusObj )
        this.addPlus = true;
      },
      sortArray(array){
          array.sort(function(a,b){
            return a.rank - b.rank
          })
      },
      addSuccess(){
        this.getIntegralList();
      },
      exportIntegral(){
        if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
        window.open(API.urls.IntegraExportExcel+"?clazzId="+this.clazzId+"&token="+getToken())
      },
      stuMsgView(index,scope){
        this.identification = scope.identification;
        this.stuMsgFlag = true;
      },
      IntergralViewOption(param){
        console.log(param);
        this.seeRow=param;
        this.dialogViewPointsItem=true;
      },
    },
    components:{
      addPlus,
      viewPoints,
      Goback,
      stuMsg,
      viewPointsitem
    }
  }
</script>
<style scoped="" lang="less">
  @import "../../../assets/less/icon.less";
  @import "../../../assets/less/clazz.less";
  @import "../../../assets/reset-element-ui/form.css";
  @import "../../../assets/less/btn-search.less";
  @import "../../../assets/reset-element-ui/user-table.css";
  .bread-box {
      margin-bottom: 15px;
  }
  .j-clazz{
    .j-table-pic{
      font-size: 16px;
      a{
        color: #333;
        text-decoration: underline;
      }
      a:hover{
        color: #409EFF
      }
      
    }
    .j-table-pic img{
       width: 45px!important;
       height: 45px!important;
       border-radius: 50%;
       position: relative;
    }
    .j-one-l{
      position: absolute;
      bottom:5px;
      left: 9px;
      background: url("../../../assets/img/clazz/one_l.png") no-repeat;
      display: inline-block;
      width: 48px;
      height: 21px;
    }
    .j-one-t{
      position: absolute;
      bottom:6px;
      left: 9px;
      background: url("../../../assets/img/clazz/two_l.png") no-repeat;
      display: inline-block;
      width: 48px;
      height: 21px;
    }
    .j-one-r{
      position: absolute;
      bottom:5px;
      left: 9px;
      background: url("../../../assets/img/clazz/three_l.png") no-repeat;
      display: inline-block;
      width: 48px;
      height: 21px;
    }
    .j-one{
      background: url("../../../assets/img/clazz/one.png") no-repeat;
      display: inline-block;
      width: 19px;
      height: 23px;
      vertical-align: middle;
    }
    .j-two{
      background: url("../../../assets/img/clazz/two.png") no-repeat;
      display: inline-block;
      width: 19px;
      height: 23px;
      vertical-align: middle;
    }
    .j-three{
      background: url("../../../assets/img/clazz/three.png") no-repeat;
      display: inline-block;
      width: 19px;
      height: 23px;
      vertical-align: middle;
    }
    .btn-check{
      user-select: none;
      cursor: pointer;
      color: #333;
      text-decoration: underline;
      font-size: 18px;
    }
    .btn-check:hover{
      color: #1077D7;
    }
    .btn-addPlus{
      border: 1px solid #b0cff0;
      padding:3px 7px;
      border-radius: 2px;
      color: #488cdc;
    }
  }
  .round-layout{
    padding-left: 73px;
    padding-right:73px;
    padding-top: 30px;
    padding-bottom: 30px;
  }
  .el-table p{
    margin:12px 0 12px 0;
  }
  .btn-export{
    position: relative;
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
</style>
<style lang="less">
  .j-clazz .el-table__body-wrapper.is-scrolling-left~.el-table__fixed,.el-table__fixed{
    box-shadow: 0 0 10px rgba(0,0,0,.12);
  }
</style>

