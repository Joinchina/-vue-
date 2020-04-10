<template>
  <div id="w-table">
    <div class="top mg-b16 clearfix">
      <span class="w-sum">专家：{{totalElements}}人</span>
      
      <el-dropdown placement="bottom-start" class="right"  @command="importExport">
        <button class="w-add" type="button">
          导入/导出
          <i class="icon-export"></i>
        </button>
        <el-dropdown-menu class="item-export" slot="dropdown">
          <el-dropdown-item command="import">
            <i class="icon-personal"></i>
             导入专家 
          </el-dropdown-item>
          <el-dropdown-item command="export">
            <i class="icon-student"></i>
             导出专家 
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <button class="w-add" type="button" @click="addProfessor = true"  v-if="getRole == 'ADMIN' || getRole == 'ORGADMIN' || getRole == 'PROJECTADMIN' || getRole == 'CLAZZMANAGER'">
        <i class="icon-circle-add"></i>
        新增专家
      </button>
      <button class="w-import-green" type="button" @click="signProfessorMethod"  v-if="getRole == 'ADMIN' || getRole == 'ORGADMIN' || getRole == 'PROJECTADMIN'|| getRole == 'CLAZZMANAGER'">
        <i class="icon-import-green"></i>
        分配专家
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
        <input type="text" v-model="searchQuery" placeholder="账号/姓名/手机号" @keyup.13="getProfessorList()" /><i class="el-icon-search" @click.stop="getProfessorList('search')"></i>
      </div>

    </div>
    <el-table class="list"
              :data = "tableData"
              :empty-text="loading_font"
              stripe
    >
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
          <el-dropdown class="down more" placement="bottom-start" >
						<span class="el-dropdown-link">
              更多
              <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu class="down" slot="dropdown">
              <el-dropdown-item  @click.native="handlePwd(scope.$index, scope.row)">
                <i class="icon-reset"></i>
                密码重置
              </el-dropdown-item>
              <el-dropdown-item  @click.native="handleDel(scope.$index, scope.row, tableData)">
                <i class="icon-del"></i>
                删除账号
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <p class="page-sum">共{{totalElements}}条 每页20条</p>
    <!-- 分页 -->
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

    <!-- 创建专家 -->
    <add-professor
      :dialogAddProfessor.sync="addProfessor"
      :clazzId = "clazzId"
      role = "PROFESSOR"
      @updateProfessorUserList="getProfessorList"></add-professor>


    <!-- 编辑专家 -->
    <edit-professor
      :dialogEditProfessor.sync="editProfessor"
      :userId = "rowUserId"
      :clazzId = "clazzId"
      role = "PROFESSOR"
      @updateProfessorUserList="getProfessorList"></edit-professor>
    <!--分配专家-->
    <pfessor-assign :dialogAssignProfessor.sync="signProfessor" @updateProfessorUserList="getProfessorList"></pfessor-assign>
    
    <!-- 导入学员 -->
    <professor-import
        :dialogImportProfessor.sync="importProfessor"
        :clazzId = "clazzId"
        @updateList="getProfessorList"></professor-import>
  </div>

</template>
<script>
  import model from 'model/members/members'
  import user from 'model/user/user_manage'
  import pwdReset from 'components/user/pwd_reset'
  import addProfessor from 'components/members/pfessor_create'
  import editProfessor from 'components/members/pfessor_edit'
  import pfessorAssign from 'components/members/pfessor_assign'
  import { delTip } from '@/global/open'
  import bus from '@/global/bus'
  import { getCurRole } from  '@/filters/userVerify'
  import professorImport from 'components/members/professor_import'
  import API from '@/global/resource';
  import { getToken } from '@/filters/userVerify';

  export default {
    data () {
      return {
        tableData: [],
        clazzId: "",
        searchQuery: "",
        pwdShow: false,		//密码重置弹出框
        rowUserId:"",		// 当前row userid
        addProfessor: false,		// 添加项目弹出框
        editProfessor: false,		// 编辑项目弹出框
        signProfessor:false,//分配专家
        importProfessor: false, //导入专家
        cur_page: 1,
        totalElements: 0,
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
      this.getProfessorList();
    },

    mounted() {

    },
    methods: {
      appStatusSearch(value){
          this.app = value;
          this.cur_page = 1;
          this.getProfessorList();
      },

      handleCurrentChange (val) {
        this.cur_page = val;
        this.getProfessorList();
      },
      getProfessorList(type, cur_page) {

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

          model.getClazzProfessorList(data, ( res => {
           // console.log("class", res)
            if(res.status == 200) {
              this.totalElements = res.data.totalElements;
              this.tableData = res.data.content;
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

      handleEdit(index, row) {
        this.editProfessor = true;
        this.rowUserId = row.id;

        // console.log("orgiiii", this.rowUserId);
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

      delUser(index) {
        let _this = this;
        let data = {
          id: this.rowUserId,
          clazzId:this.clazzId
        }
       // alert(JSON.stringify(data));
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
                        _this.getProfessorList('page', val);

                  } else {
                          _this.getProfessorList();
                  }
              }
            });


          } else {
            this.$message.error(res.message);
          }
        }));

      },
      //分配专家
      signProfessorMethod(){
          this.signProfessor = true;
          bus.$emit('assignPfessor',"1");
      },
        // 导入导出专家
        importExport(value) {
            if(value == "import") {
                this.importProfessor = true;
                // console.log("导入专家")
            } else {
                // console.log("导出专家")
                window.open(API.urls.exportProfessor+"?clazzId="+this.clazzId+"&token="+getToken());
            }   
        }

    },

    components: {
      pwdReset,
      addProfessor,
      editProfessor,
      pfessorAssign,
      professorImport
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
    
    .w-import-green {
      float: right;
      padding: 0 15px;
      height: 40px;
      line-height: 40px;
      width: 118px;
      border: 1px solid #8dc6c2;
      border-radius: 6px;
      color: #4ba8a2;
      background-color: #f3faf9;
      cursor: pointer;
      margin-left: 12px;
      vertical-align: text-bottom;
    }
    .w-add {
      font-size: 16px;

    }

    .icon-export {
      vertical-align: middle;
    }
    .el-dropdown-menu__item {
      padding: 0 20px;
    }

  }
  .down {
    .icon-reset,.icon-del {
      vertical-align: text-bottom;
      background-size: 90% 90%;
    }

    .el-dropdown-menu__item{
      font-size: 14px;
      border-bottom: 1px solid #eee;
      &:last-child {
        border-bottom: 0;
      }
    }
  }
  .item-export {
    margin-left: 12px;
  }
  .wtype {
    width: 105px;
    outline: 0;
    margin-left: 10px;
  }
</style>
