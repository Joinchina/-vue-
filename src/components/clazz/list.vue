<template>
  <div id = "classList" class="">


    <pro-infor :proId="proId"></pro-infor>

    <!-- 没有班级时 -->
    <empty v-if="emptyFlag"
      :tip="tip"
      :btntext="btntext"
      @add="dialogCreateClass = true"></empty>
    <!-- /没有班级时 -->

    <section class="class-list" v-if="!emptyFlag">

      <div class="top clearfix">
        <button class="add-clazz" type="button" @click="dialogCreateClass = true" v-if="role != 'CLAZZMANAGER' && role != 'PROFESSOR' ">
          <i class="icon-circle-add"></i>
          创建班级
        </button>
        <div class="search">
          <input type="text" v-model="searchQuery" placeholder="班级名" @keyup.13="searchData()" /><i class="el-icon-search" @click.stop="searchData()"></i>
        </div>
        <!--  <search placeholder="班级名" :sdata="clazzList"></search> -->
      </div>

      <ul class="pane-list clearfix">

        <li class="pane" v-for = "(item,index) in clazzList">
          <!-- <div v-if = "role == 'ADMIN'"> -->
          <div v-if = "role != 'PROFESSOR'">
              <div class="desc" >
                <router-link :to = "{ path: '/clazz/index',query: {clazzId:item.identification}}" target="_blank" @click.native = "clazzClick(item.userIds)">
                  <h3 :title="item.name">{{item.name | filterWord(29)}}</h3>
                  <p class="info">
                    <span>课程：{{item.courseCount}}</span>
                    <span>学员：{{item.studentCount}}</span>
                  </p>
                </router-link>
              </div>

              <div class="operate" :class-id="item.identification">
                <router-link :to="{ path: '/clazz/index',query: { clazzId:item.identification}}" v-if="role == 'PROFESSOR'" @click.stop="editClass($event)" class="bg-into">进入班级</router-link>
                <span v-else @click.stop="editClazzCli(item.identification)" class="bg-edit">编辑</span>
                <span @click.stop="delClass($event)" class="el-icon-delete" v-if = "role == 'ADMIN'"></span>
              </div>
          </div>
          <!--暂时先admin可见-->
           <div v-else>
              <div class="desc" >
                <router-link :to = "{ path: '/course/all',query: { clazzId:item.identification}}" target="_blank" @click.native = "clazzClick(item.userIds)">
                  <h3 :title="item.name">{{item.name | filterWord(29)}}</h3>
                  <p class="info">
                    <span>课程：{{item.courseCount}}</span>
                    <span>学员：{{item.studentCount}}</span>
                  </p>
                </router-link>
              </div>

              <div class="operate" :class-id="item.identification">
                <router-link :to="{ path: '/course/all',query: { clazzId:item.identification}}" v-if="role == 'PROFESSOR'" @click.stop="editClass($event)" class="bg-into">进入班级</router-link>
                <span v-else @click.stop="editClazzCli(item.identification)" class="bg-edit">编辑</span>
                <span @click.stop="delClass($event)" class="el-icon-delete" v-if = "role == 'ADMIN'"></span>
              </div>
          </div>
        </li>

      </ul>
    </section>
    
    <!-- 创建班级 -->
    <create-clazz
      :dialogCreateClass.sync="dialogCreateClass"
      :proId = "proId"
      @updateProList="getListFromPro"></create-clazz>

    <!-- 编辑班级 -->
    <edit-clazz
      :dialogEditClass.sync = "dialogEditClass"
      :clazzId = "curclazzId"
      @updateProList="getListFromPro"></edit-clazz>
  </div>
</template>
<script>
  import model from 'model/clazz/list'
  import storage from '@/global/storage'
  import { turnQueryStr,limits } from  '@/filters/userVerify'
  import bus from '@/global/bus'
  import ProInfor from 'components/project/pro_infor.vue'
  import { delTip } from '@/global/open'
  import Empty from 'base/empty/empty'

  import createClazz from 'components/clazz/create_clazz'
  import editClazz from 'components/clazz/edit_clazz'

  export default {
    data() {
      return {
        role:"",
        searchQuery:"",
        clazzList:"",
        clazzList2:"",
        dialogCreateClass: false,
        dialogEditClass: false,

        curclazzId: "",
        tip: '',
        btntext: '',
        loading: false,
        emptyFlag: false,       // 是否显示空页面
      }
    },

    props: ['queryParams','orgId'],
    computed: {
      proId() {
        return this.queryParams.split("&")[0].split("=")[1];
      }
    },
    filters: {
      filterWord(value, len) {
        let currlen = value.length;
        if(currlen > len) {
          value = value.substr(0, len)+'...';
        }
        return value;
      }
    },
    components:{
      ProInfor,
      Empty,
      createClazz,
      editClazz
      // Search
    },

    created() {
      this.getListFromPro();
    //  this.permissionEmpty();
    },
    ready() {
      // console.log("router", this.$route.params);
    },
    methods: {
      editClazzCli(clazzId) {
        this.curclazzId = clazzId;
        this.dialogEditClass = true;

        console.log("clazzIdclasss===", this.curclazzId);
      },
      // 判断空页面权限
      permissionEmpty(){
        let role = storage.get("exp_role");
        if(role == "ADMIN" || role == "ORGADMIN" || role == "PROJECTADMIN") {
          this.tip = "项目下还没有班级，赶紧创建班级吧";
          this.btntext = "创建班级";
        }

        if(role == "CLAZZMANAGER" || role == "PROFESSOR") {
          this.tip = "您还没有任何班级，联系管理员给您添加班级吧";
          this.btntext = "";
        }
      },
      menuRole:function () {

        var role = storage.get("exp_role");
        // console.log("班级列表角色" + role);
        this.role = role;

      },
      searchData() {
        let searchQuery = this.searchQuery && this.searchQuery.toLowerCase();
        searchQuery = searchQuery.trim();
        let data = this.clazzList2;
        // console.log("searchQuery",searchQuery);
        if(searchQuery) {
          data = data.filter(function(row) {
            return Object.keys(row).some(function() {
              return String(row["name"]).toLowerCase().indexOf(searchQuery) > -1
            })
          })
          this.clazzList = data;
        } else {
          this.clazzList = this.clazzList2;
        }

      },
      clazzClick:function (userIds) {
        limits(userIds);
      },

      getListFromPro () {
        var _this = this;
        if(!!this.queryParams) {
          model.getClazzList(this.queryParams, (res => {
            // console.log("班级列表",res);
            if(res.status == 200) {
              this.clazzList = res.data;
              // console.log("班级数据" + JSON.stringify(this.clazzList));
              //角色判断
              this.menuRole();
              this.permissionEmpty();
              this.clazzList2 = res.data;

                if(this.clazzList2.length == 0) {
                    this.emptyFlag = true;
                } else {
                    this.emptyFlag = false;
                }
            }
          }));
        }
      },
      
     
      // 删除班级
      delClass(event) {
        let str = "删除班级会将班级下的所有内容都删除，确定要删除吗？";
        delTip(this, str, this.delClass2, event);

      },
      delClass2 (event) {
        let _this = this;
        // console.log(event.target.parentNode);
        let classId = event.target.parentNode.getAttribute("class-id");

        let data = {
          id : classId
        }
        model.delClass(data, (res => {
          // console.log(res);
          if(res.status == 200) {
            _this.$message({
              type:'success',
              message: '删除成功',
              duration: 1000,
              onClose() {
                _this.getListFromPro();
                // _this.$router.go(0);
              }
            });
          } else {
            _this.$message.error(res.message);
          }
        }));
      }

    },

    watch: {
      queryParams: 'getListFromPro'
    }


  }
</script>
<style scoped lang="less">
  @import "../../assets/less/icon.less";
  @import "../../assets/reset-element-ui/form.css";
  @import "../../assets/less/btn-search.less";

  
  @borderColor: #f0f0f0;
  #classList {
    background-color: #fff;
    border: 1px solid @borderColor;
    border-radius: 6px;
    box-shadow: -2px 0 3px #f0f0f0,
    2px 0 3px #f0f0f0,
      0 -2px 3px #f0f0f0,
    0 2px 3px #f0f0f0;
      
  }


  .class-list {
    .top {
      height: 60px;
      padding: 20px 50px 0;
    }


    .pane-list {
      padding: 24px 50px 5px;
      // overflow: hidden;

      li {
        box-sizing: border-box;
        float: left;
        width: 262px;
        height:185px;
        margin-right: 25px;
        margin-bottom: 25px;
        border: 1px solid #ededed;
        border-radius: 0 0 6px 6px;
        box-shadow: -3px 0 3px #f2f2f2,
        3px 0 3px #f2f2f2,
          0 -3px 3px #f2f2f2,
        0 3px 3px #f2f2f2;
        &:nth-child(3n-2)
        {
          border-top: 3px solid #367a5f;
        }
        &:nth-child(3n-1) {
          border-top: 3px solid #2e89fb;
        }
        &:nth-child(3n) {
          margin-right: 0;
          border-top: 3px solid #749d60;
        }
        .desc {
          padding: 15px 10px 20px;
          border-bottom: 1px solid #ededed;
          border-radius: 0 0 6px 6px;
          box-shadow: 0 3px 3px #f2f2f2;

          a {
            color: #333;
          }
        }
        h3 {
          font-size: 16px;
          line-height: 2em;
          height: 64px;
          overflow: hidden;
        }
        .info {
          color: #666;
          font-size: 14px;
          margin-top: 15px;
          >span {
            display: inline-block;
            margin-right: 28px;
          }

        }
        .operate {
          color: #666;
          font-size: 14px;
          padding: 15px 10px 0;
          text-align: right;
          >span, >a {

            cursor: pointer;
            display: inline-block;
            width: auto;
            text-align: left;
            padding-left: 15px;
            color: #666;
          }
          .bg-into {
            background: url("../../assets/img/icon/icon-into.png") left center no-repeat;
          }
          .bg-edit {
            background: url("../../assets/img/icon/icon-edit.png") left center no-repeat;
          }

          i {
            vertical-align: middle;
          }
          .el-icon-delete {
            color: #999;
          }
        }
      }
    }
  }
</style>
