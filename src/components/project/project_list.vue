<template>
  <div id = "proList" class="clearfix">
    
    <!-- 没有项目时 -->
    <empty v-if="emptyFlag"
    :tip="tip"
    :btntext="btntext"
    @add="createProCli"></empty>
    <!-- /没有项目时 -->
    <!-- 创建项目 -->
    <el-dialog class="dialog-form w-wang"
        title="创建项目"
        :visible.sync="dialogCreatePro"
        :close-on-click-modal=false
        :before-close="close"
        @open="open"
        >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-loading="loading"
            element-loading-text="拼命加载中">
        <el-form-item label="项目名称：" :label-width="labelWidth" prop="name">
          <el-input v-model.trim="ruleForm.name" placeholder="请填写项目名称" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label=" 项目简介：" :label-width="labelWidth" prop="desc">
          <!-- <el-input type="textarea" v-model="ruleForm.desc"></el-input> -->
          <div id="edit_menup1" class="toolbar"></div>
          <div id="edit_contentp1" class="text"></div> 
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="!loading && submitForm('ruleForm')">创建</el-button>
        <el-button  @click="close">关闭</el-button>
      </div>
    </el-dialog>
    <!-- /创建项目 -->
    <div class="pro-menu" v-if="!emptyFlag">
      <div class="search">
        <input type="text"
        v-model="searchQuery"
        placeholder="项目名" v-on:input="searchData(items2)" /><i class="el-icon-search"
        @click.stop="searchData(items2)"></i>
      </div>
      <ul class="menu-list2">
        <li v-for = "(item,index) in items"
            :title="item.name"
            :class="{'active':item.active,'unactive':!item.active}"
            @click="subClazz(item.params,item.userIds,item.identification), selectStyle (item, index)"
            >
            <i  class="icon-point-white"></i>
            <span  class="pro-cli"
            effect="dark"
            :content="item.name" placement="bottom-start">{{item.name}}</span>
        </li>
      </ul>
      <div class="create-pro"  v-if = "role == 'ADMIN' || role == 'ORGADMIN'">
          <button class="btn-add" type="button" @click="createProCli">创建项目</button>
      </div>
    </div><!-- pro-menu -->
    <div class="clazz-list-comp" v-if="!emptyFlag">
      <clazz-list :queryParams="queryParams" :orgId="identification"></clazz-list>
    </div>
  </div><!-- proList -->
</template>
<script>
  import ClazzList from "components/clazz/list"
  import modelAdmin from 'model/project/admin_project_list'
  import model from 'model/project/project_list'
  import storage from '@/global/storage'
  import { turnQueryStr,limits} from  '@/filters/userVerify'
  import Empty from 'base/empty/empty'
  import { mapGetters, mapActions } from 'vuex'
  import aliyunDir from 'model/organization/list'
  import E from 'wangeditor'
  import ailiyunUpload from 'model/aliyun/index'
  export default {
    computed:{
      // showOrg(){
      //    return this.$store.getters.showOrgObj;
      // }
      ...mapGetters(['showOrgObj','showCurProIdEdit','showCurProIdDel'])
    },
    watch:{
      showOrgObj(cur,old){
          this.identification = cur.identification;
          console.log("当前项目列表机构id" +　 this.identification);
          this.orgUserIds = cur.userIds;
          this.menuRole(cur.role);  //切换机构空页面权限
          
          this.getProList();
      },
      //时时更新删除、编辑项目
      showCurProIdEdit(cur,old){
        this.curProId = cur;
        this.getProList();
      },
      showCurProIdDel(cur,old){
        this.curProId = cur;
        this.getProList();
      }
    },
    data(){
      return {
        role:"",
        items:"",
        items2:"",
        curUserId:"",
        identification:"",   // orgId
        orgUserIds:"",
        queryParams:"",
        // 创建项目
        dialogCreatePro: false,
        ruleForm: {
          name:"",
          desc:""
        },
        rules: {
          name:[
          { required: true, message: '请填写项目名称', trigger: 'blur'},
          { max: 50, message: '项目名称不能超过50字', trigger: 'blur' }
          ],
          desc: [
          { max: 20000, message: '项目简介不能超过20000字', trigger: 'blur'}
          ]
        },
        labelWidth: "120px",
        searchQuery:"",
        tip: '',
        btntext: '',
        loading: false,
        emptyFlag: false,  // 是否显示空页面
          // 阿里云上传
          editorpro1: {},
          percentage: 0,
          aliyunName: '',
          originalUrl: '',
          loadingText:0,
          curProId:"",
          ulheight:0,
      }
    },
    components: {
      ClazzList,
      Empty
    },
    created() {
      console.log("项目列表啦啦");
    },
    mounted() {
      //this.menuRole();
      this.onOrgMenu();
      this.permissionEmpty();
      
    },
    // updated(){
    //   this.changesize();
    // },
    methods: {
      createProCli() {
        this.ruleForm.desc = "";
        this.dialogCreatePro = true;
        this.scroll_()
      },
      open() {
        this.loading = false;
        this.$nextTick(() => {
          console.log("ididididid==", this.editorpro1.id);
          if(this.editorpro1.id) {
            this.editorpro1.txt.html("");
            console.log("txthtml==", this.editorpro1.txt.html());
          } else {
            this.wangEditp1();
          }
        })
      },
      wangEditp1() {
        let editorpro1 = new E('#edit_menup1', '#edit_contentp1')
            
            editorpro1.customConfig.menus = [
                'head',  // 标题
                'bold',  // 粗体
                'fontSize',  // 字号
                'foreColor',  // 文字颜色
                'link',  // 插入链接
                'justify',  // 对齐方式
                'quote',  // 引用
                'emoticon',  // 表情
                'image',  // 插入图片
                'video',  // 插入视频
                'undo',  // 撤销
                'redo'  // 重复
            ]
            // 配置服务器端地址
            editorpro1.customConfig.customUploadImg = (files, insert) => {
                // aliyun 上传图片
                aliyunDir.getAliyunImg({}, (res => {
                    if(res.status == 200) {
                        ailiyunUpload.aliyunUpload(res.data,files,(percentage, cpt)=>{
                          this.loadingText = Math.round(percentage*100);
                        }).then((results)=>{
                          // 上传完成
                          this.aliyunName = results.name.split("/").pop();
                          this.originalUrl = decodeURI(results.res.requestUrls[0]).split('?')[0];                                   
                          insert(this.originalUrl);                                                              

                        }).catch((err)=>{
                          this.$message.error('上传错误'+err);

                        });
                    } else {
                        this.$message.error(res.message);
                    }
                }))
            };
            editorpro1.customConfig.onchange = (html) => {
                this.ruleForm.desc = html
            };
            editorpro1.customConfig.zIndex = 1;
            editorpro1.create();
            this.editorpro1 = editorpro1;
      },
      
      selectStyle(item, index) {
        let _this = this;
        _this.$nextTick(() => {
          this.items.forEach((item) => {
            _this.$set(item, 'active', false);
          })
          _this.$set(item,'active',true);
        });
      },
      menuRole (role){
        //目前不需进行机构权限的的反查，项目管理员和专家班主任只有两个菜单;
        var role = role || storage.get("exp_role");
        // console.log("项目列表获取角色" + role );
        this.role = role;
        this.offtop();
        this.changesize();
      },
      // 判断空页面权限
      permissionEmpty(){
        let role = storage.get("exp_role");
        if(role == "ADMIN" || role == "ORGADMIN") {
          this.tip = "您还没有项目，赶紧添加项目吧";
          this.btntext = "创建项目";
        }
        if(role == "PROJECTADMIN" || role == "CLAZZMANAGER" || role == "PROFESSOR") {
          this.tip = "您还没有任何项目，联系管理员给您添加项目吧";
          this.btntext = "";
        }
      },
      searchData(items2) {
        // console.log("searchQuerypro",items2);
        let searchQuery = this.searchQuery && this.searchQuery.toLowerCase();
        searchQuery = searchQuery.trim();
        let data = items2;
        if(searchQuery) {
          data = data.filter(function(row) {
            return Object.keys(row).some(function() {
              return String(row["name"]).toLowerCase().indexOf(searchQuery) > -1
            })
          })
          if(data.length == 0){
            this.items = [{"name":"暂无数据"}];
            return;
          }
          this.items = data;
        } else {
          var curIndex = 0;
          this.items = this.items2;
          this.items.forEach((item,index) => {
                  this.$set(item, 'active', false);
                  if(item.identification ==  this.curUserId){
                   curIndex = index
                   }
          })
          this.$set(this.items[curIndex],'active',true);
        }
        // console.log("searchdatapro",this.items);
      },
      getProList () {
        let data;
        //admin-点击进入项目列表 by jiajy
        if(!!this.$route.query.orgId && !!this.$route.query.userId){
          var identification = this.$route.query.orgId;
          var userIds = this.$route.query.userId;
          var orgUserIds = userIds.split(",");
          data = turnQueryStr(orgUserIds,"orgId",identification);
          this.ondata(data);
        //非admin-点击进入项目列表
        }else{
            data = turnQueryStr(this.orgUserIds,"orgId",this.identification);
            // console.log(data);
            this.ondata(data);
        }
      },
      ondata(data){
        let _this = this;
        model.getProList(data,( res => {
          //console.log("项目列表花湖" + JSON.stringify(res));
          if(res.status === 200) {
            let curIndex = 0;
            //角色判断
            this.menuRole();
            this.items = res.data;
            this.items2 = res.data;
            // 判断是否显示空页面
            if(this.items2.length == 0) {
                this.emptyFlag = true;
            } else {
                this.emptyFlag = false;
            }
            // 默认选中列表样式
            if(this.items2.length > 0) {
              this.$nextTick(function () {
                this.items2.forEach((item,index) => {
                  _this.$set(item, 'active', false);
                  //当前项目id选中
                  if(item.identification == _this.curProId){
                     curIndex = index;
                  }
                })
                _this.$set(_this.items2[curIndex],'active',true);
              });
            }
            if(res.data.length > 0){
                //存储权限role
                limits(res.data[curIndex]["userIds"]);
               
                
                res.data.forEach(function(val, ind, arr) {
                  let proUserIds = val.userIds;
                  //当前项目id选中
                  if(val.identification == _this.curProId){
                     curIndex = ind;
                  }
                  val.params = turnQueryStr(val.userIds, "proId", val.identification);
                })
                // 设置默认的class
                this.queryParams = this.items[curIndex].params;
            }
            // setTimeout(()=>{this.scroll_()},100);
          }
        }));
      },
      
      onOrgMenu() {
        //admin权限登录,获取机构id 和userIds by jiajy
        if(!!this.$route.query.orgId && !!this.$route.query.userId){
          this.identification = this.$route.query.orgId;
          let userIds = this.$route.query.userId;
          this.orgUserIds = userIds.split(",");
          this.getProList();
        }else{
          //切换tab切换执行
          var obj = storage.get("orgId");
          if(!!obj){
              this.identification = obj.identification;
              this.orgUserIds = obj.userIds;
              this.getProList();
          }
        }
      },
      subClazz(params,userIds,curId) {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        console.log("点击的-params", params);
        this.curUserId = curId;
        this.queryParams = params;
        //add new
         // this.$router.push("/project/prolist?"+this.queryParams);
         //存储角色
          limits(userIds);
          this.menuRole();
          //console.log("项目列表实际角色" + limits(userIds));
      },
      // 创建项目
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            this.createPro();
          } else {
            console.log('create project error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      close () {
        this.dialogCreatePro = false;
        this.resetForm('ruleForm');
      },
      createPro() {
        let data = {
          organizationId: this.identification,
          name: this.ruleForm.name,
          description: this.ruleForm.desc
        }
        this.loading = true;
        model.createPro(data, (res => {
          if(res.status == 200) {
            // 关闭弹出框
            this.dialogCreatePro = false;
            this.getProList();
            this.ruleForm.name = "";
            this.ruleForm.desc = "";
            this.loading = false;
          } else {
            this.$message.error(res.message);
            this.loading = false;
          }
        }));
      },
      changesize(){
        window.addEventListener("resize",this.offtop);
      },
      offtop(){
        //获取当前元素距离顶部的距离
        let prohtml=document.getElementById("proList")
        //设置button按钮的高度76px"role == 'ADMIN' || role == 'ORGADMIN'"在是管理或者机构时才有
        let btnheight=0;
        if(this.role=='ADMIN' || this.role == 'ORGADMIN'){
          btnheight=0;
        }else{
          btnheight=70;
        }
        if(prohtml!=null){
          let offsettop=$("#proList").offset().top;
          //获取当前浏览器可视区的高
          let cliheight=$(window).height();
          //设置列表的默认高度

          $(".menu-list2").css("height",(cliheight-150-offsettop+btnheight)+"px");
          this.scroll_=()=>{
            //获取当前浏览器可视区的高
            let cliheight=$(window).height();
            let scrolltop=$(document).scrollTop();//滚动的距离
            if(scrolltop>=offsettop){
              //为导航列表增加浮动
              $(".pro-menu").css({"position":"fixed","top":0})
              //计算导航列表的高度
              $(".menu-list2").css("height",(cliheight-150+btnheight)+"px")
            }else{
              $(".pro-menu").css({"position":"static"})
                //设置列表的滚动时的高度
              $(".menu-list2").css("height",(cliheight-150-offsettop+scrolltop+btnheight)+"px");
            }
          }
          //获取滚动轴滚动的距离        
          window.addEventListener("scroll",this.scroll_);
        }        
        
      },
      
    },
    destroyed(){
      window.removeEventListener("scroll",this.scroll_);
      window.removeEventListener("resize",this.size);
      this.offtop=()=>{
         return
      }
    }
    // watch: {
    //   identification: 'getProList',
    //   orgUserIds: 'getProList'
    // },
  
  }
</script>
<style scoped lang="less">
  @img:"../../assets/img/item";
  @import "../../assets/less/icon.less";
  @import "../../assets/reset-element-ui/form.css";
  @borderColor: #f0f0f0;
  .w-wang {
      .text {
          width: 100%;
          height: 200px;
          border: 1px solid #F2F0F0;
      }
      .toolbar {
          width: 100%;
          background: #FCFDFF;
          border: 1px solid #F2F0F0;
          height: 50px;
      }
      .w-e-toolbar{
          .w-e-menu{
              padding: 17px 10px;
          }
      } 
  }
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
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    padding-top: 20px;
    color: #fff;
    position: relative;
    // margin-bottom: -99923px;
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
      >i {
        position: absolute;
        right: 0;
        top: 0;
        width: 34px;
        height: 34px;
        line-height: 34px;
        background-color: #636069;
        border-radius:0 6px 6px 0;
        text-align: center;
        color: #fff;
        border: 0;
      }
      >input {
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
    .menu-list2 {
      width: 100%;
      overflow-y: auto;
      // min-height: 640px;
      li {
        font-size: 14px;
        height: 46px;
        line-height: 46px;
        padding: 0 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
        >i {
          vertical-align: middle;
          margin-right: 12px;
        }
        &:hover,&.active {
          background-color: #35a69d;
        }
      }
    }
    .create-pro {
      position: fixed;
      bottom:0px;
      width: 230px;
      height: 76px;
      padding-top: 17px;
      background-color: #464452;
      
      >.btn-add {
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
    // min-height:677px;
  }
  
</style>