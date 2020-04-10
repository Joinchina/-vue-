<template>
  <div id = "proList" class="clearfix">
    <!-- 没有项目时 -->
    <empty v-if="emptyFlag"
           :tip="tip"
           :btntext="btntext"></empty>
    <!-- /没有项目时 -->
    <div class="pro-menu" v-if="!emptyFlag">
      <div class="search">
        <input type="text"
               v-model="searchQuery"
               placeholder="项目名" v-on:input="searchData(items2)" /><i class="el-icon-search"
                                                                     @click.stop="searchData(items2)"></i>
      </div>
      <ul class="menu-list">
        <li v-for = "(item,index) in items"
            :title="item.name"
            :class="{'active':item.active,'unactive':!item.active}"
            @click="subClazz(item.params,item.userIds,item.identification), selectStyle (item, index)">
            <i class="icon-point-white"></i>
          <span  class="pro-cli"
                 effect="dark"
                 :content="item.name" placement="bottom-start">{{item.name}}</span>
        </li>
      </ul>
      <!--<div class="create-pro"  v-if = "role == 'ADMIN' || role == 'ORGADMIN'">-->
        <!--<button class="btn-add" type="button" @click="dialogCreatePro = true">创建项目</button>-->
      <!--</div>-->

    </div><!-- pro-menu -->
    <div class="clazz-list-comp" v-if="!emptyFlag">
      <clazz-list :queryParams="queryParams" :orgId="identification"></clazz-list>
    </div>
  </div><!-- proList -->
</template>
<script>
import ClazzList from "components/clazz/list";
import modelAdmin from "model/project/admin_project_list";
import model from "model/project/project_list";
import storage from "@/global/storage";
import { turnQueryStr, limits } from "@/filters/userVerify";
import bus from "@/global/bus";
import jQuery from "jquery";
import Empty from "base/empty/empty";
export default {

  data() {
    return {
      role: "",
      roleAdminPro: true,
      items: "",
      items2: "",
      curUserId: "",
      identification: "", // orgId
      orgUserIds: "",
      queryParams: "",

      labelWidth: "120px",
      searchQuery: "",
      tip: "",
      btntext: "",
      emptyFlag: false // 是否显示空页面
    };
  },

  components: {
    ClazzList,
    Empty
  },
  created() {
    this.menuRole();
    // this.onOrgMenu();
    this.permissionEmpty();
    let _this = this;

    // 时时更新删除项目
    // bus.$on('deletePro', function(proId) {
    //   _this.getAdminProList();
    // });
    // // 时时更新编辑项目
    // bus.$on('editPro', function(proId) {
    //   _this.getAdminProList();
    // });

    //admin全部项目列表
    _this.getAdminProList();
  },
  mounted() {
    this.offtop();
    this.changesize();
  },
  // updated(){
  //     this.offtop();
  //     this.changesize();
  //   },
  methods: {
    selectStyle(item, index) {
      let _this = this;
      _this.$nextTick(() => {
        this.items.forEach(item => {
          _this.$set(item, "active", false);
        });
        _this.$set(item, "active", true);
      });
    },

    menuRole() {
      //目前不需进行机构权限的的反查，项目管理员和专家班主任只有两个菜单;
      var role = storage.get("exp_role");
      // console.log("项目列表获取角色" + role );
      this.role = role;
    },
    // 判断空页面权限
    permissionEmpty() {
      let role = storage.get("exp_role");
      if (role == "ADMIN") {
        this.tip = "您还没有任何项目，联系管理员给您添加项目吧";
        this.btntext = "";
      }
    },
    searchData(items2) {
      // console.log("searchQuerypro",items2);
      let searchQuery = this.searchQuery && this.searchQuery.toLowerCase();
      searchQuery = searchQuery.trim();
      let data = items2;
      if (searchQuery) {
        data = data.filter(function(row) {
          return Object.keys(row).some(function() {
            return (
              String(row["name"])
                .toLowerCase()
                .indexOf(searchQuery) > -1
            );
          });
        });
        //暂无数据
        if (data.length == 0) {
          this.items = [{ name: "暂无数据" }];
          return;
        }
        this.items = data;
      } else {
        var curIndex = 0;
        this.items = this.items2;
        this.items.forEach((item, index) => {
          this.$set(item, "active", false);
          if (item.identification == this.curUserId) {
            curIndex = index;
          }
        });
        this.$set(this.items[curIndex], "active", true);
      }
      // console.log("searchdatapro",this.items);
    },

    //admin 下所有项目
    getAdminProList() {
      let _this = this;
      let adminUserId = storage.get("exp_userId");
      let data = "id=" + adminUserId;
      modelAdmin.getAdminProList(data, res => {
        if (res.status === 200) {
          this.items = res.data;
          this.items2 = res.data;

          // 设置空页面显示逻辑
          if (this.items2.length == 0) {
            this.emptyFlag = true;
          } else {
            this.emptyFlag = false;
          }

          // 设置默认第一个选中
          if (this.items2.length > 0) {
            this.$nextTick(function() {
              this.items2.forEach(item => {
                _this.$set(item, "active", false);
              });
              _this.$set(_this.items2[0], "active", true);
            });
          }
          res.data.forEach(function(val, ind, arr) {
            let proUserIds = val.userIds;
            val.params = turnQueryStr(val.userIds, "proId", val.identification);
          });
          // 设置默认的class
          this.queryParams = this.items[0].params;
        }
      });
    },

    subClazz(params, userIds, curId) {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;

      this.curUserId = curId;
      this.queryParams = params;

      //存储角色
      limits(userIds);

      this.menuRole();
    },
    changesize() {
      window.addEventListener("resize", this.size);
      this.size = () => {
        this.offtop();
      };
    },
    offtop() {
      //获取当前元素距离顶部的距离
      if($("#proList").length =0) {
              return 
          }  
      let offsettop = $("#proList").offset().top;
      //获取当前浏览器可视区的高
      let cliheight = $(window).height();
      //设置列表的默认高度
      $(".menu-list").css("height", cliheight - 74 - offsettop + "px");
      //获取滚动轴滚动的距离
      this.scroll_ = () => {
        let scrolltop = $(document).scrollTop(); //滚动的距离
        if (scrolltop >= offsettop) {
          //为导航列表增加浮动
          $(".pro-menu").css({ position: "fixed", top: 0 });
          //计算导航列表的高度
          $(".menu-list").css("height", cliheight - 74 + "px");
        } else {
          $(".pro-menu").css({ position: "static" });
          //  $(".menu-list").css("height",(cliheight-150-offsettop)+"px")
          //设置列表的滚动时的高度
          $(".menu-list").css(
            "height",
            cliheight - 74 - offsettop + scrolltop + "px"
          );
        }
      };
      window.addEventListener("scroll", this.scroll_);
    }
  },
  destroyed() {
    window.removeEventListener("scroll", this.scroll_);
    window.removeEventListener("resize", this.size);
    this.offtop=()=>{
         return
    }
  }
};
</script>
<style scoped lang="less">
@img: "../../assets/img/item";
@import "../../assets/less/icon.less";
@import "../../assets/reset-element-ui/form.css";
@borderColor: #f0f0f0;
#proList {
}
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar
{
	width: 8px;
	height: 8px;
  background-color: #37323e;
}
 
/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track
{
	// -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	border-radius: 6px;
  background-color: #37323e;
}
 
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb
{
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: #ffffff;
}
.pro-menu {
  float: left;
  width: 230px;
  background-color: #37323e;
  border-radius: 4px;
  padding-top: 20px;
  color: #fff;
  margin-bottom: -99923px;
  // padding-bottom: 99999px;
  height: auto;
  .search {
    position: relative;
    display: block;
    margin: 0 auto 20px;
    width: 200px;
    height: 34px;
    border-radius: 6px;
    background-color: #5b5761;
    float: none;
    border: 0;
    > i {
      position: absolute;
      right: 0;
      top: 0;
      width: 34px;
      height: 34px;
      line-height: 34px;
      background-color: #636069;
      border-radius: 0 6px 6px 0;
      text-align: center;
      color: #fff;
      border: 0;
    }
    > input {
      display: block;
      width: 166px;
      height: 100%;
      border: 0;
      background-color: transparent;
      padding: 0 8px;
      color: #fff;
    }
    input::-webkit-input-placeholder,
    textarea::-webkit-input-placeholder {
      color: #fff;
    }
    input:-moz-placeholder,
    textarea:-moz-placeholder {
      color: #fff;
    }
    input::-moz-placeholder,
    textarea::-moz-placeholder {
      color: #fff;
    }
    input:-ms-input-placeholder,
    textarea:-ms-input-placeholder {
      color: #fff;
    }
  }
  .menu-list {
    width: 100%;
    // height: 400px;
    overflow-y: auto;
    li {
      font-size: 14px;
      height: 46px;
      line-height: 46px;
      padding: 0 20px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
      > i {
        vertical-align: middle;
        margin-right: 12px;
      }
      &:hover,
      &.active {
        background-color: #35a69d;
      }
    }
  }
  .create-pro {
    position: fixed;
    bottom: 0;
    width: 230px;
    height: 76px;
    padding-top: 17px;
    background-color: #464452;
    > .btn-add {
      color: #fff;
      display: block;
      margin: 0 auto;
      border: 0 none;
      width: 155px;
      height: 41px;
      background: url("@{img}/btn_create.png") center center no-repeat;
      background-size: 100% 100%;
      text-align: center;
      padding-left: 15px;
      font-size: 16px;
      line-height: 41px;
      cursor: pointer;
    }
  }
}
.clazz-list-comp {
  margin-left: 250px;
}
</style>
