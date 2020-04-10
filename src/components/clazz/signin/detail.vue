<template>
  <div class="j-clazz">
    <!--header_start-面包屑-->
    <div class="bread-box">
      <Goback :passtitle="passtitle"></Goback>
      <div class="add-clazz">
          <button type="button" class="btn-export" @click="qrcodeCheck">
            <i class="icon-export-white"></i>
            签到二维码
          </button>
      </div>
      <div class="add-clazz-t">
        <button data-v-74b68b4e="" type="button" class="btn-blue btn-blue-small" @click="exportUserList">
          <i class="icon-export-white"></i>
          导出名单
        </button>
      </div>
    </div>
    <div class = "round-layout" style="margin-top:20px">
    <section class="wtabs-box" id="w-table">
      <ul class="wtabs clearfix">
        <li v-for="(item, index) in tabsParam"
            @click="toggleTabs(index)"
            :class="{active:index==nowIndex}">{{item.name}}
          <span>({{item.num}})</span>
        </li>
        <!-- <li>已提交<span>(80)</span></li> -->
      </ul>

      <div class="wtab-cont"  v-show="nowIndex==0">
        <el-table class=""
        :empty-text="loading_font"
                  :data = "unCommitUser"
                  stripe>
          <el-table-column
            prop="userName"
            label="账号"
            width="192">
          </el-table-column>
          <el-table-column
            label="姓名"
            width="215"
          >
            <template slot-scope="scope">
               {{scope.row.name}}
               <span class="leave" v-if="scope.row.absenceFlag">(请假)</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号"
            width="205">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope"  v-if="getRole == 'ADMIN' || getRole == 'ORGADMIN' || getRole == 'PROJECTADMIN'|| getRole == 'CLAZZMANAGER'">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)" class="el-button-att">
                代签
              </el-button>

              <el-button
                size="mini"
               class="el-button-att el-cancle"
               @click="recordsCancel(scope,'absence')" v-if="scope.row.absenceFlag">
                取消请假
              </el-button>
              <el-button
                size="mini"
               class="el-button-att"
               @click="records(scope,'absence')" v-else>
                请假
              </el-button>

              <el-button
                size="mini"
                class="el-button-att"
                @click="records(scope,'comeLate')">
                迟到
              </el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
      <div class="wtab-cont"  v-show="nowIndex==1">
        <el-table class=""
        :empty-text="loading_font2"
                  :data = "commitUser"
                  stripe>
          <el-table-column
            prop="userName"
            label="账号"
            :show-overflow-tooltip="true"
            width="100">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            :show-overflow-tooltip="true"
            width="100"
          >
            <template slot-scope = "scope">
                {{scope.row.name}}
                <span class="leave" v-if="scope.row.comeLateFlag">
                   (迟到)
                </span>
                <span class="leave" v-if="scope.row.leaveEarlyFlag">
                   (早退)
                </span>
                <span class="leave" v-if="scope.row.cheatTagFlag">
                   (作弊)
                </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号"
            :show-overflow-tooltip="true"
            width="150">
          </el-table-column>

          <el-table-column
            label="签到时间"
            :show-overflow-tooltip="true"
            width="150">
            <template slot-scope="scope">
              {{ scope.row.createDate  }}
              <span class="ml18 gray" v-if="scope.row.cheatFlag">(可能作弊)</span>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            :show-overflow-tooltip="true"
            label="是否代签"
            width="100">
            <template slot-scope="scope">
               <span v-if="!!scope.row.agentUser">是</span>
               <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="agentUser"
            :show-overflow-tooltip="true"
            label="代签人"
            width="100">
          </el-table-column>
           <el-table-column
            label="操作">
                 <template slot-scope="scope"  v-if="getRole == 'ADMIN' || getRole == 'ORGADMIN' || getRole == 'PROJECTADMIN'|| getRole == 'CLAZZMANAGER'">
                  <el-button
                    size="mini"
                   class="el-button-att el-cancle" 
                   @click="recordsCancel(scope,'comeLate')" 
                   v-if="scope.row.comeLateFlag">
                     取消迟到
                  </el-button>
                  <el-button
                    size="mini"
                   class="el-button-att" 
                   @click="records(scope,'comeLate')" v-else>
                     迟到
                  </el-button>
                  
                   <el-button
                    size="mini"
                    class="el-button-att el-cancle"
                    @click="recordsCancel(scope,'leaveEarly')"
                    v-if="scope.row.leaveEarlyFlag">
                    取消早退
                  </el-button>
                  <el-button
                    size="mini"
                    class="el-button-att"
                    @click="records(scope,'leaveEarly')" v-else>
                    早退
                  </el-button>

                  <el-button
                    size="mini"
                    class="el-button-att el-cancle"
                    @click="recordsCancel(scope,'cheat')"
                    v-if="scope.row.cheatTagFlag">
                    取消作弊
                  </el-button>

                  <el-button
                    size="mini"
                   class="el-button-att"
                   v-else 
                   @click="records(scope,'cheat')">
                     作弊
                  </el-button>
                   
                  
                </template>
            </el-table-column>

        </el-table>

      </div>
    </section>
    </div>
    <!--查看二维码-->
    <qr-code
      :dialogQrcodeSign.sync="qrCodeSign"
      :signId="signIdD"
    ></qr-code>
  </div>
</template>
<script>
   import Goback from 'base/goback/goback'
  import model from 'model/clazz/signin'
  import { getCurRole } from "@/filters/userVerify"
  import { delTipSign} from '@/global/open'
  import API from '@/global/resource'
  import {getToken} from "@/filters/userVerify"
  import qrCode from 'components/clazz/signin/qrcode'
  export default {
    data(){
      return {
        getRole:getCurRole(),
        qrCodeSign:false,
        rowId:"",
        userId:"",
        type:"",
        signId:"",
        signIdD:"",
        clazzId:"",
        nowIndex:0,
        tabsParam: [{
          name:'未签到',
          sum: 0,
        }, {
          name: '已签到',
          sum: 0
        }],
        commitUser: [],
        unCommitUser: [],
        passtitle:'签到详情',
        loading_font:this.$globalParam.loadText,
        loading_font2:this.$globalParam.loadText
      }
    },
    created(){
      this.clazzId = this.$route.query.clazzId;
      this.signId = this.$route.query.signId;
      this.getUnCommitList();
      this.getCommitList();

    },
    methods:{

      records(scope,type){

         this.userId = scope.row.userId;
         this.type = type;
         if(type == "comeLate"){
             //请假
            if(scope.row.absenceFlag){
                let str = "确定将请假的考勤记录变更为迟到";
                let index = scope.$index;
                delTipSign(this, str, this.delAbsence, index);
                return;
            }
         }
         this.delAbsence();
      },

      delAbsence(){
        let msg = "";
        let data = {
          signId :this.signId,
          userId:this.userId,
          signTag:this.type 
        }
        model.addSignTag(data, (res => {
          if(res.status == 200) {
           
            switch(this.type){
              case "comeLate":
              msg = "该学员已记录为迟到";
              break;

              case "absence":
              msg = "该学员请假申请成功";
              break;

              case "leaveEarly":
              msg = "该学员已记录为早退";
              break;

              case "cheat":
              msg = "该学员已记录为作弊";
              break;

              default:
            }
            this.msgTip(msg);

          } else {
            this.$message.error(res.message);
          }
        }));
         
      },

      recordsCancel(scope,type){
        //console.log("取消请假");
        this.userId = scope.row.userId;
        this.type = type;
        let msg = "";
        let data = {
          signId :this.signId,
          userId:this.userId,
          signTag:this.type 
        }
        model.delSignTag(data, (res => {
          if(res.status == 200) {
            
            switch(type){
              case "comeLate":
              msg = "取消该学员迟到";
              break;

              case "absence":
              msg = "取消该学员请假";
              break;

              case "leaveEarly":
              msg = "取消该学员早退";
              default:

              case "cheat":
              msg = "取消该学员作弊";
              break;
            }
            this.msgTip(msg);

          } else {
            this.$message.error(res.message);
          }
        }));
      },

      msgTip(msg){
          let _this = this;
          this.$message({
              type: 'success',
              message: msg,
              duration: 1000,
              onClose() {
                _this.getUnCommitList();
                _this.getCommitList();
              }
          });
      },


      toggleTabs(index) {

        this.nowIndex=index;

      },
      getUnCommitList(){
        var data = {
          signId: this.signId
        }
        model.unSignUserList(data, (res => {
          if(res.status == 200) {
            this.unCommitUser = res.data;
            this.loading_font=this.$globalParam.dataEmpty
            this.tabsParam[0].num = res.data.length;
          } else {
            this.$message.error(res.message);
          }
        }));
      },
      handleEdit(index,row){
        this.rowId = row.userId;
        let str = "";
        if(row.absenceFlag){
           str = "该学员已请假，是否取消请假直接帮学员代签到";
        }else{
           str = "是否确认该学员已到，并替他签到";
        }
       
        delTipSign(this, str, this.delUser, index);

      },
      delUser(){
        var _this = this;
        var data = {
          signId: this.signId,
          userId:this.rowId
        }
        model.agentSign(data, (res => {
          if(res.status == 200) {
            this.$message({
              type: 'success',
              message: '代签成功',
              duration: 1000,
              onClose() {
                _this.getUnCommitList();
                _this.getCommitList();
              }
            });
          } else {
            this.$message.error(res.message);
          }
        }));
      },
      getCommitList(){
        var data = {
          signId: this.signId
        }
        model.signUserList(data, (res => {
          if(res.status == 200) {
            this.commitUser = res.data;
            this.loading_font2=this.$globalParam.dataEmpty
            this.tabsParam[1].num = res.data.length;
          } else {
            this.$message.error(res.message);
          }
        }));
      },
      exportUserList(){
        if(!this.$store.getters.getOrgVipInfo.vip){
					this.$store.state.vipFuncPopFalg = true;
					return;
				}
        window.open(API.urls.exportUserList+"?signId="+this.signId+"&token="+getToken());
      },
      qrcodeCheck(){
        this.signIdD = this.$route.query.signId;
        this.qrCodeSign = true;
      },
    },
    components:{
      Goback,
      qrCode
    }
  }
</script>
<style scoped lang="less">
  @import "../../../assets/less/clazz";
  @import "../../../assets/less/btn-search.less";
  @import "../../../assets/reset-element-ui/user-table.css";
   @import "../../../assets/reset-element-ui/form.css";
  .j-clazz .bread-box .add-clazz-t{
     right: 155px;
     
  }
  .bread-box{
    margin-bottom: 20px;
  }
  .wtab-cont{
    margin-left: 73px;
    margin-right:73px;
    margin-top: 30px;
    margin-bottom: 30px;
    .leave{
      color: #ff8200;
    }
  }
  .wtabs {
    border-bottom: 1px solid #e6e6e6;
    height: 72px;
    line-height: 66px;
    font-size: 20px;
    padding: 0 70px;
    li {
      display: inline-block;
      padding: 0 10px;
      margin-right: 56px;
      // border-bottom: 5px solid #fff;
      &.active {
        color: #35a69d;
        border-bottom: 5px solid #35a69d;
      }
    }
    span {
      font-size: 20px;
      color: #ff8200;
    }
  }
  .btn-blue::after{
    position: absolute;
    right: -6px;
    top: -10px;
    width: 27px;
    height: 15px;
    content: "";
    background: url("../../../assets/img/expert/vipLogo.png") center center no-repeat;
    background-size: 27px 14px;
  }
</style>
