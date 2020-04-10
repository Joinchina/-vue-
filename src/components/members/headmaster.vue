
<template>
  <!--<div id="w-table">-->
    <!--<div class="top clearfix">-->
      <!--<button class="w-add" type="button" @click="addClass = true">-->
        <!--<i class="icon-circle-add"></i>-->
        <!--新增班主任-->
      <!--</button>-->
      <!--<div class="search">-->
        <!--<input type="text" v-model="searchQuery" placeholder="账号/姓名/手机号" @keyup.13="searchData()" /><i class="el-icon-search" @click.stop="searchData()"></i>-->
      <!--</div>-->

    <!--</div>-->
    <div id="w-table">
      <div class="top mg-b16 clearfix">
        <span class="w-sum">班主任：{{totalElements}}人</span>

        <button class="w-add" type="button" @click="addClass = true" v-if="getRole == 'ADMIN' || getRole == 'ORGADMIN' || getRole == 'PROJECTADMIN'">
          <i class="icon-circle-add"></i>
          新增班主任
        </button>
        <button class="w-add" type="button" @click="assignClassMethod" v-if="getRole == 'ADMIN' || getRole == 'ORGADMIN' || getRole == 'PROJECTADMIN'">
          <i class="icon-circle-add"></i>
          分配班主任
        </button>
        <div class="right">
            <el-select class="wtype" v-model="value" placeholder="使用APP"   @change = "appStatusSearch">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search">
          <input type="text" v-model="searchQuery" placeholder="账号/姓名/手机号" @keyup.13="getClassList()" /><i class="el-icon-search" @click.stop="getClassList('search')"></i>
        </div>

      </div>
    <el-table class="list"
              :data = "tableData" 
               :empty-text="loading_font"
              stripe>
      <el-table-column
        prop="username"
        label="账号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号"
        width="200">
      </el-table-column>
      <el-table-column
        prop="appStatus"
        label="使用APP"
        width="180">
      </el-table-column>
      <el-table-column
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button type="text" @click.native="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-dropdown class="more"  placement="bottom-start" >
						<span class="el-dropdown-link">
              更多
              <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu class="more-menu" slot="dropdown">
              <el-dropdown-item @click.native="handlePwd(scope.$index, scope.row)">
                密码重置
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleDel(scope.$index, scope.row, tableData)">
                删除账号
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
      <p class="page-sum">共{{totalElements}}条 每页20条</p>
    <!--分页-->
    <div class="pagination">
      <el-pagination
        :page-size="20"
        :current-page="cur_page"
        @current-change ="handleCurrentChange"
        layout="prev, pager, next"
        :total="totalElements">
      </el-pagination>
    </div>
    <!-- 密码重置 -->
    <pwd-reset
      :dialogPwdReset.sync="pwdShow"
      :userId = "rowUserId"
    ></pwd-reset>
    <!-- 创建机构管理员 -->
    <add-class
      :dialogAddClass.sync="addClass"
      :clazzId = "clazzId"
      role = "CLAZZMANAGER"
      @updateClassUserList="getClassList"></add-class>

    <!-- 编辑机构管理员 -->
    <edit-class
      :dialogEditClass.sync="editClass"
      :userId = "rowUserId"
      :clazzId = "clazzId"
      role = "CLAZZMANAGER"
      @updateClassUserList="getClassList"></edit-class>
      <!--分配班主任-->
      <assign-class :dialogAssignClass.sync="assignClass" @updateClassUserList="getClassList"></assign-class>


  </div>

</template>
<script>
  import model from 'model/members/members'
  import user from 'model/user/user_manage'
  import pwdReset from 'components/user/pwd_reset'
  import addClass from 'components/members/headmaster_create'
  import editClass from 'components/members/headmaster_edit'
  import assignClass from 'components/members/headmaster_assign'
  import { delTip } from '@/global/open'
  import bus from '@/global/bus'
  import { getCurRole } from  '@/filters/userVerify'

  export default {
    data () {
      return {
        tableData: [],
        clazzId: "",
        searchQuery: "",
        pwdShow: false,		//密码重置弹出框
        rowUserId:"",		// 当前row userid
        addClass: false,		// 添加机构弹出框
        editClass: false,		// 编辑机构弹出框,
        assignClass:false, //分配班主任
        //分页
        cur_page: 1,
        totalElements:0,
        getRole:"",
        loading_font:this.$globalParam.loadText,
        app:"",
        options: [{
          value: "",
          label: "全部"
        }, {
          value: "TRUE",
          label: "是"
        }, {
          value: "FALSE",
          label: "否"
        }],
        value: "使用APP",
      }
    },

    created() {
      this.getRole = getCurRole();
      this.clazzId = this.$route.query.clazzId;
      this.getClassList();
    },

    mounted() {

    },
    methods: {
      appStatusSearch(value){
          this.app = value;
          this.cur_page = 1;
          this.getClassList();
      },
      handleCurrentChange(val){
        this.cur_page = val;
        this.getClassList();
      },
      getClassList(type, cur_page) {

        let data = {
          keyword:this.searchQuery,
          clazzId:this.clazzId,
          number:cur_page || this.cur_page,
          size:20,
          appStatus:this.app
        }

        if(type == 'search') {
            data.number = 1;
        }

        if(!!this.clazzId) {
          model.getClazzManagerList(data, ( res => {
            if(res.status == 200) {
              this.tableData = res.data.content;
              this.totalElements = res.data.totalElements;
               this.loading_font=this.$globalParam.dataEmpty;
              this.tableData.forEach(function(value,index,arr) {
                arr[index].appStatus = value.appStatus == 1 ? '是' : '否';
              })


            }
          }));
        } else {
          console.log('缺少orgId');
        }
      },
      handlePwd(index,row) {
        this.pwdShow = true;
        this.rowUserId = row.id;
        // console.log("row",index,row.id);
      },
      handleDel(index, row, rows) {
        this.rowUserId = row.id;
        let str = "确定要删除该账号吗？";
        delTip(this, str, this.delUser, index);
        // console.log(row.id);
      },
      handleEdit(index, row) {
        this.editClass = true;
        this.rowUserId = row.id;

        // console.log("orgiiii", this.rowUserId);
      },

      delUser(index) {
        let _this = this;
        let data = {
          id: this.rowUserId,
          clazzId:this.clazzId
        }
        model.removeProfessCLazz(data, ( res => {

          if(res.status == 200) {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose() {

                _this.tableData.splice(index, 1);
                  if(_this.tableData.length == 0) {

                        let val = _this.cur_page-1;
                        _this.cur_page = val;
                        _this.getClassList('page', val);

                  } else {
                          _this.getClassList();
                  }
                  
              }
            });


          } else {
            this.$message.error(res.message);
          }
        }));

      },
      assignClassMethod(){
        bus.$emit('assignClass',"1");
        this.assignClass = true;
      }
    },
    components: {
      pwdReset,
      addClass,
      editClass,
      assignClass
    }
  }
</script>
<style scoped lang="less">
  @import "../../assets/less/icon.less";
  @import "../../assets/less/btn-search.less";
  @import "../../assets/reset-element-ui/user-table.css";

  #w-table {
    .w-sum {
      display: inline-block;
      margin-top: 8px;
    }

  }
  // .down {
  //   .icon-reset,.icon-del {
  //     vertical-align: text-bottom;
  //     background-size: 90% 90%;
  //   }

  //   .el-dropdown-menu__item{
  //     font-size: 14px;
  //     border-bottom: 1px solid #eee;
  //     &:last-child {
  //       border-bottom: 0;
  //     }
  //   }
  // }
  // .el-dropdown-menu{
  //   background: rgba(0,0,0,0.5)!important;
  //   border: none;
  // } 
</style>
