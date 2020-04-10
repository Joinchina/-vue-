<template>
	<div id="worgList">

		<!--top_sart-->
		<div class="clearfix top">
      <button class="z-add-clazz" type="button"  @click="exportorg">
					<i class="z-icon-export-white"></i>
					导出
			</button>
      	<button class="z-add-clazz" type="button" @click="createOrgCli">
				<i class="z-icon-circle-add"></i>
				创建机构
			</button>
			<div class="search">
				<input type="text" placeholder="机构名"  v-model="searchQuery" v-on:input="searchData()"/>
        <div class="el-icon-search" @click.stop="searchData()"></div>
			</div>
		</div>
		<!--top_end-->
		<!--content_start-->

		<el-row :gutter="24" >
			<el-col :span="6" v-for="(item,index) in orgListArray" :title="item.name" :key="item.identification" @click.native="prolistClick(item.identification,item.userIds,item.name)">
				<div class="grid-content bg-purple" >
          <span class="vipSign" v-if="!!item.vip">{{item.endDate}}到期</span>
          <!--<img v-if="item.logo" :src="item.logo" class="logo" alt="">-->
					<img v-if="item.logo" :src="item.logo" class="logo" @error="imgError" alt="">
					<img v-else src="/static/img/avatar.png" class="logo" alt="">
					<span class="text">{{item.name | cutstrs(item.name) }}</span>
				</div>
			</el-col>
		</el-row>
		<!--content_end-->

		<!-- 创建机构 -->
		<el-dialog class="dialog-form w-wang" title="创建机构"
        :visible.sync="dialogCreateOrg"
        :close-on-click-modal=false
        :before-close="close"
        @open="open"
        >
			<el-form
            :model="ruleFormOrg"
            :rules="rulesOrg"
            ref="ruleFormOrg"
            enctype="multipart/form-data"
            v-loading="loading"
            :element-loading-text="loadingText">
				<el-form-item label="机构名称：" :label-width="labelWidth" prop="name">
					<el-input v-model.trim="ruleFormOrg.name" placeholder="请填写机构名称" auto-complete="off"></el-input>
				</el-form-item>

        <el-form-item label="机构类型：" :label-width="labelWidth" prop="type">
            <el-select v-model.trim="ruleFormOrg.type" placeholder="请选择" >
                <el-option 
                  v-for="item,key,index in orgType" 
                  :key="index" 
                  :label="item" 
                  :value="key">
                </el-option>
            </el-select>
        </el-form-item>

        <!--新增一个选择省份 -->
      <el-form-item  label="机构所在省份：" :label-width="labelWidth" prop="province">
          <el-select v-model.trim="ruleFormOrg.province"  placeholder="请选择">
              <el-option 
                v-for="item,key,index in Province" 
                :key="index" 
                :label="item" 
                :value="key">
              </el-option>

          </el-select>      
      </el-form-item>
      <el-form-item  label="VIP开关：" :label-width="labelWidth" prop="vipSwitch">
        <el-switch
          v-model="ruleFormOrg.vipSwitch"
          @change="vipChange"
          active-color="#13ce66"
          inactive-color="#DCDFE6">
        </el-switch> 
      </el-form-item>

      <div class="configurationBlock">
        <el-form-item  label="付费功能配置：" :label-width="labelWidth" prop="vipSwitch"> </el-form-item>
        <el-form-item  label="学员提交附件大小：" label-width="160px" prop="attachmentSize" :class="{attachForm:true,attchVideo:attchVideoFalse}">
          <span>文档类</span><el-input v-model="ruleFormOrg.attachmentSize" placeholder="请输入内容"></el-input><em class="unit">M</em>
          <span>视频</span><el-input v-model="ruleFormOrg.videoSize" placeholder="请输入内容"></el-input><em>M</em>
        </el-form-item>
        <el-form-item  label="网络课程数量限制：" label-width="160px" prop="onlineCourse"  class="onlineForm">
          <span>必修</span><el-input v-model="ruleFormOrg.onlineCourse" placeholder="请输入内容"></el-input><em class="unit">门/班</em>
          <span>选修</span>
          <el-switch
            v-model="ruleFormOrg.take"
            active-color="#13ce66"
            inactive-color="#DCDFE6">
          </el-switch> 
        </el-form-item>
        <el-form-item  label="存储空间大小限制：" label-width="160px" prop="storageSize" class="storageForm">
          <el-input v-model="ruleFormOrg.storageSize" placeholder="请输入内容"></el-input><em>G</em>
        </el-form-item>
        <el-form-item  label="成员数量限制：" label-width="160px" prop="Members" class="membersForm">
          <el-checkbox @change="memberChange" v-model="ruleFormOrg.noLimit">不限制</el-checkbox><span class="other">或</span><el-input v-model="ruleFormOrg.Members" :disabled="ruleFormOrg.noLimit" placeholder="请输入内容"></el-input><em>人</em>
        </el-form-item>
      </div>

      <el-form-item  label="直播体验时长：" :label-width="labelWidth" prop="liveExperience">
        <el-input placeholder="请输入内容" v-model="ruleFormOrg.liveExperience" class="inputExperience">
          <template slot="append">小时</template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="ruleFormOrg.vipSwitch"  label="VIP有效期：" :label-width="labelWidth" prop="vipDateRange">
        <el-date-picker
          v-model="ruleFormOrg.vipDateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>

				<el-form-item label="机构logo：" :label-width="labelWidth"  prop="file" class="file-box">

					<img v-if="imageUrl" :src="imageUrl" id="avatarOrg" class="avatar">
					<img v-else src="/static/img/avatar.png"  class="avatar">
					<label for="file" class="sel2">选择照片<i class="el-icon-arrow-right"></i></label>
					<input class="sel1" id="file"  type="file" name="ruleFormOrg.file" accept="image/png,image/gif,image/jpeg"  @change="selAvatar($event)">

				</el-form-item>
				<el-form-item label="机构简介：" :label-width="labelWidth" prop="desc">
					<!-- <el-input type="textarea" v-model="ruleFormOrg.desc"></el-input> -->
          <div id="edit_menu" class="toolbar"></div>
          <div id="edit_content" class="text"></div> 
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="!loading && submitOrg('ruleFormOrg')">创建</el-button>
				<el-button  @click="close">关闭</el-button>
			</div>
		</el-dialog>
		<!-- /创建机构 -->

	</div>
</template>
<script>
	import model from 'model/organization/list'
	import storage from '@/global/storage'
	import { setIds,limits } from  '@/filters/userVerify'
	import bus from '@/global/bus'
	import {cutstr} from '@/global/util'
  import API from '@/global/resource'
  import { getToken } from '@/filters/userVerify'
  import E from 'wangeditor'
  import ailiyunUpload from "model/aliyun/index"

	export default {

    data() {
      let validateInteger = (rule, value, callback) => {
        if (!(/(^[1-9]\d*$)/.test(value))) {
          callback(new Error('请输入大于零的正整数'));
        }else if(Number(value) > 999999999){
          callback(new Error('超出限制'));
        }else {
          callback();
        }
      };
      let validateMembers = (rule, value, callback) => {
        if (!(/(^[1-9]\d*$)/.test(value))&&!this.ruleFormOrg.noLimit) {
          callback(new Error('请输入大于零的正整数'));
        } else if(Number(value) > 999999999){
          callback(new Error('超出限制'));
        }else {
          callback();
        }
      };
      let validateAttachmentSize = (rule, value, callback) => {
        if (!(/(^[1-9]\d*$)/.test(value))||!(/(^[1-9]\d*$)/.test(this.ruleFormOrg.videoSize))) {
          if(!(/(^[1-9]\d*$)/.test(this.ruleFormOrg.videoSize))){
            this.attchVideoFalse = true;
          }else{
            this.attchVideoFalse = false;
          }
          
          callback(new Error('请输入大于零的正整数'));
        } else if(Number(value) > 999999999 || Number(this.ruleFormOrg.videoSize) > 999999999){
          if( Number(this.ruleFormOrg.videoSize) > 999999999){
            this.attchVideoFalse = true;
          }else{
            this.attchVideoFalse = false;
          }
          callback(new Error('超出限制'));
        }else {
          this.attchVideoFalse = false;
          callback();
        }
      };
      return {
         
        orgListArray : [],
        orgListArray2 : [],
        orgType : [],
        Province : [],
        searchQuery : "",
        attchVideoFalse: false,
        // 创建机构
        dialogCreateOrg : false,
        ruleFormOrg : {
          name : "",
          type :  "",
          file : "",
          desc : "",
          province : "",
          vipSwitch :  false,
          attachmentSize : 5,
          videoSize : 10,
          onlineCourse : 1,
          take : true,
          storageSize : 50,
          Members : 10,
          noLimit : false,
          liveExperience : 10,
          vipDateRange : "",
          logo : ""
        },
        imageUrl:"",
        rulesOrg: {
          name :[
            { required: true, message: '请填写机构名称', trigger: 'blur'},
            { max: 30, message: '机构名称不能超过30字', trigger: 'blur' }
          ],
          type : [
            { required: true, message: '请填写机构类型', trigger: 'change'}
          ],
          province : [
            { required: true, message: '请填写机构所在省份', trigger: 'change'}
          ],
          desc : [
            { max: 20000, message: '机构简介不能超过20000字', trigger: 'blur'}
          ],
          vipSwitch : [
            { required : true, trigger : 'change'}
          ],
          liveExperience :[
            { required : true, trigger : 'blur',  validator : validateInteger}
          ],
          vipDateRange :[
            { required : true, trigger : 'blur', message: '请填写VIP有效期'}
          ],
          attachmentSize : [
            { required : false, validator : validateAttachmentSize}
          ],
          onlineCourse : [
            { required : false, validator : validateInteger}
          ],
          storageSize : [
            { required : false, validator : validateInteger}
          ],
          Members : [
            { required : false, validator : validateMembers}
          ],
        },
        labelWidth: "136px",
        userIds:[],
        loading: false,
        loadingText : "拼命加载中",

         // 阿里云上传
        editor: {},
        percentage: 0,
        aliyunName: '',
        originalUrl: '',
        loadingText:0,
        posturl:'',
        freeConfig:{},
        vipConfig:{},
        pickerOptions: {
         disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          },
        }    
      };
    },
    created:function () {

      var token_json = JSON.parse(storage.get("exp_token_json"));
      var data = setIds(token_json);
      model.getOrgList(data, (res => {
        if(res.status == 200) {
          this.orgListArray = res.data;
          this.orgListArray2 = res.data;
        }else{
          this.$message.error(res.message);
        }
      }));

      //存储当前机构的角色对象
      this.$store.state.orgObj = {
          role:"ADMIN"
      };

      this.defaultConfiguration();
    },
    mounted() {
     
     
      // 获取机构类型
      this.getOrgType();
      // 获取省份信息
      this.getProvince();
    },
    methods: {
      createOrgCli() {
        this.dialogCreateOrg = true;
        // 富文本编辑器
        this.$nextTick(() => {
          if(this.editor.id) {
            this.editor.txt.html("");
          } else {
            this.wangEdit();
          }
          
        })
         
      },
      wangEdit() {
        let editor = new E('#edit_menu', '#edit_content')
            
              editor.customConfig.menus = [
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
              editor.customConfig.customUploadImg = (files, insert) => {
                  // aliyun 上传图片
                  model.getAliyunImg({}, (res => {
                      if(res.status == 200) {
                          ailiyunUpload.aliyunUpload(res.data,files,(param1,param2)=>{
                            this.loadingText = "上传中" + Math.round(param1*100);
                          }).then((result)=>{
                            // 上传完成
                            this.aliyunName = result.name.split("/").pop();
                            this.originalUrl = decodeURI(result.res.requestUrls[0]).split('?')[0];                                   
                            insert(this.originalUrl);
                          }).catch((err)=>{
                            console.log(err);
                            this.$message.error("上传错误"+res);
                          })

                      } else {
                          this.$message.error(res.message);
                      }
                  }))
              };

              editor.customConfig.onchange = (html) => {
                  this.ruleFormOrg.desc = html
              };
              editor.customConfig.zIndex = 1;
              editor.create();
              this.editor = editor;
      },

      imgError (e) {
        e.srcElement.src = "/static/img/avatar.png";
      },
      open() {
        this.loading = false;
      },
      close () {
        this.dialogCreateOrg = false;
        this.resetForm('ruleFormOrg');
        this.imageUrl = "";
        this.ruleFormOrg = Object.assign(this.ruleFormOrg,this.freeConfig);
      },
      searchData () {
        let searchQuery = this.searchQuery && this.searchQuery.toLowerCase();
        searchQuery = searchQuery.trim();
        let data = this.orgListArray2;
        // console.log("searchQuery",searchQuery);
        if (searchQuery) {
          data = data.filter(function (row) {
            return Object.keys(row).some(function () {
              return String(row["name"]).toLowerCase().indexOf(searchQuery) > -1
            })
          })
          this.orgListArray = data;
        } else {
          this.orgListArray = this.orgListArray2;
        }

      },
      orgList () {
        var token_json = JSON.parse(storage.get("exp_token_json"));
        var data = setIds(token_json);
        model.getOrgList(data, (res => {
          console.log("orglist",res.data);
          this.orgListArray = res.data;
        }));
      },
      // 创建机构弹出框
      selAvatar (event) {
        let _this = this;
        let extend = event.target.value.substr(event.target.value.lastIndexOf(".") + 1).toLowerCase();
        // console.log("value",event.target.files);
        if (extend == "jpg" || extend == "png" || extend == "gif" || extend == "jpeg") {
          let files = event.target.files;
          
          this.orgLogoUpload(files,()=>{
            let objUrl = event.target.files[0];
            let windowURL = window.URL || window.webkitURL;
            let imageUrl = windowURL.createObjectURL(objUrl);
            _this.imageUrl = imageUrl
            _this.ruleFormOrg.file = files[0];
          })
          
          // document.getElementById("avatarOrg").src = imageUrl;
        }
      },
      // 创建机构
      submitOrg (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // alert('submit');
            this.createOrg();
          } else {
            console.log('create organization error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
          this.$refs[formName].resetFields();
      },
      createOrg () {
        let data = {
          logo : this.ruleFormOrg.logo,                   // 
          name : this.ruleFormOrg.name,                   // 机构名称
          orgType : this.ruleFormOrg.type,                // 机构类型
          description : this.ruleFormOrg.desc,            // 机构简介
          zoneId : this.ruleFormOrg.province,             // 机构所在省份
          organizationAccount : {
            vip : this.ruleFormOrg.vipSwitch,               // 是否为vip
            studentDocSize : this.ruleFormOrg.attachmentSize*1024*1024,   // 学员附件--->文档类(b)
            studentVideoSize : this.ruleFormOrg.videoSize*1024*1024,      // 学员附件--->视频类(b)
            onlineCourseCount : this.ruleFormOrg.onlineCourse,            // 网络课程必修
            onlineSelectCourse : this.ruleFormOrg.take,       // 网络选修课开关
            storageSpace : this.ruleFormOrg.storageSize*1024*1024*1024,       // 存储空间大小(b)
            studentCount : this.ruleFormOrg.noLimit ? -1 : this.ruleFormOrg.Members,   // 成员数量限制 不限制（-1）
            liveTime : this.ruleFormOrg.liveExperience*60*60    // 直播体验时长
          }
          
        }
        if(this.ruleFormOrg.vipSwitch){
          data.organizationAccount.startDate = this.ruleFormOrg.vipDateRange[0];
          data.organizationAccount.endDate = this.ruleFormOrg.vipDateRange[1];
        };
        this.loading = true;
        model.createOrg(data, (res => {
          // console.log(data, res);
          if (res.status == 200) {
            this.orgList();
            this.loading = false;
            this.close();
          } else {
            this.loading = false;
            this.$message.error(res.message);
          }
        }));
      },

      handleClick (tab, event) {
        //项目列表
        if(tab.name == "proList"){
          // bus.$emit('adminprolist',"1");
           this.$router.push('/adminpro/list');
        }else if(tab.name == "orgList"){
          this.$router.push('/org/list');
        } else if (tab.name == "user") {
          this.$router.push('/admin/user');
        }
        //用户列表
        if(tab.name == "user"){
          //bus.$emit('userManager',"1");
        }
      },

      prolistClick (orgId, userIds, name) {
         //权限判断
         limits(userIds);
        //storage.set("userId", userIds);
        //跳入班级列表
         this.$router.push("/project/objnav?orgId=" + orgId + "&userId=" + userIds);

      },

      // 获取机构类型
      getOrgType() {
        model.getOrgType({}, (res => {
          // console.log("机构类型 ", res);
          if(res.status == 200) {
            this.orgType = res.data;
          } else {
            this.$message.error(res.message);
          }
        }))
      },
      //获取的省信息
      getProvince(){
          model.getProvince({}, (res => {
          if(res.status == 200) {
            // console.log("省份", res.data);
            this.Province = res.data
          } else {
            this.$message.error(res.message);
          }
        }))
      },
      //导出机构列表
      exportorg(){
       window.open(API.urls.exportorg+"?token="+getToken())
      },
      //vip开关
      vipChange(){
        if(this.ruleFormOrg.vipSwitch){
          this.ruleFormOrg = Object.assign(this.ruleFormOrg,this.vipConfig)
        }else{
          this.ruleFormOrg = Object.assign(this.ruleFormOrg,this.freeConfig)
        }
      },
      memberChange(){
        if(this.ruleFormOrg.noLimit){
          this.ruleFormOrg.Members = "";
        }
      },
      // 接口获取默认配置
      defaultConfiguration(){
        model.defaultConfiguration({},res=>{
          res.data.forEach((item,index)=>{
            let configObj = {
              attachmentSize : Number(item.studentDocSize)/1024/1024,
              videoSize : Number(item.studentVideoSize)/1024/1024,
              onlineCourse:item.onlineCourseCount,
              take : item.onlineSelectCourse,
              storageSize : item.storageSpace/1024/1024/1024,
              Members : item.studentCount == -1 ? "" : item.studentCount,
              noLimit : item.studentCount == -1,
              liveExperience : 100,
            };
            if(item.vip){
              this.vipConfig = configObj;
            }else{
              configObj.liveExperience = 10;
              this.freeConfig = configObj;
            }
            console.log(configObj);
          })
          this.ruleFormOrg = Object.assign(this.ruleFormOrg,this.freeConfig);
          console.log(this.ruleFormOrg);
        })
      },

      // 机构logo 阿里云上传
      orgLogoUpload(file,success){
        model.getAliyunOrgLogo({}, (res => {
          console.log(res);
          if(res.status == 200){
            this.loading = true;
            ailiyunUpload.aliyunUpload(res.data,file,(param1,param2)=>{
              this.loadingText = "上传中" + Math.round(param1*100);
            }).then((result)=>{
              this.ruleFormOrg.logo = decodeURI(result.res.requestUrls[0]).split('?')[0];
              success();
              this.loading = false;
            }).catch((err)=>{
              this.$message.error("上传错误"+res);
              this.loading = false;
              console.log(err);
            })
          }else{
            this.$message.error(res.message);
          }
          
        }))
      }
    },
    components: {
      
    },

    filters: {
      cutstrs: function (value) {
        return cutstr(value, 35);
      }
    },

  };
</script>
<style scoped lang="less">
  @import "../../assets/reset-element-ui/item.css";
  @import "../../assets/reset-element-ui/form.css";
  @import "../../assets/less/btn-search.less";
  @borderColor: #f0f0f0;
::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color:    #cccccc;
}
:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
   color:    #cccccc;
}
::-moz-placeholder { /* Mozilla Firefox 19+ */
   color:    #cccccc;
}
:-ms-input-placeholder { /* Internet Explorer 10-11 */
   color:    #cccccc;
}
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
  #worgList {
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 0 3px #eee;
    .search{
      float: right;
      height: 36px;
      input{
        float: left;
        height: 36px;
        line-height: 36px;
        font-size: 15px;
      }
     div{
        float: right;
        height: 35px;
        width: 36px;
        border-left: #d7d8df 1px solid;
        cursor: pointer;
      }
      div:before{
        margin: 9px 9px;
        display: block;
      }
    }
    .z-add-clazz{
      float: right;
      padding: 0 15px;
      height: 36px;
      line-height: 36px;
      color: #fff;
      background-color: #11ADA6;
      border-radius: 6px;
      border: 0;
      cursor: pointer;
      margin-left: 12px;
      font-size: 14px;

      .z-icon-circle-add{
        display: inline-block;
        vertical-align: text-bottom;
        width: 14px;
        height: 14px;
        background: url('../../assets/img/common/add.png') center center no-repeat;
        background-size: 100% 100%;
      }
      .z-icon-export-white{
        display: inline-block;
        vertical-align: middle;
        width: 12px;
        height: 12px;
        background: url('../../assets/img/common/import.png') center center no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  // 上传图片
  .file-box {
    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 30px;
    }
    .sel2,
    .sel1 {
      width: 100px;
      font-size: 14px;
      color: #35a69d;
      margin-top: 10px;
      margin-left: 10px;
    }
    .sel1 {
      opacity: 0;
    }
    .sel2 {
      color: #fff;
      >i{
        font-size: 12px;
      }
    }
  }

  .item{
    color: #333;
  }

  .top{
    padding: 18px 25px 18px 0;
  }
  //封装为组件
  .el-row {
    margin-bottom: 20px;
    padding-left:40px;
    padding-right: 40px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #fff;
    border: 1px solid #e6e6e8;;   
    height: 88px;
    line-height: 88px;
    padding-left: 8px;
    margin-bottom: 24px;
    position: relative;
    color: #666666;
    cursor: pointer;
    transition: all 0.2s;
    -moz-transition:all 0.2s;
    -webkit-transition: all 0.2s;
    -o-transition: all 0.2s;
    .vipSign{
      position: absolute;
      top: 2px;
      right: 4px;
      font-size: 12px;
      color: #612D00;
      height: 20px;
      line-height: 26px;
      padding-right: 40px;
      background: url('../../assets/img/expert/vipLogo.png') center right no-repeat;
      background-size: 38px 17px;
    }
  }
  .bg-purple:hover{
    box-shadow: 1px 17px 15px -11px rgba(204,204,204,0.44);
    color:#333333;
    transition: all 0.2s;
      -moz-transition:all 0.2s;
      -webkit-transition: all 0.2s;
      -o-transition: all 0.2s;
  }
  .bg-purple .logo{

    border-radius: 50%;
    // display: inline-block;
    vertical-align:top;
    width: 60px;
    height: 60px;
    margin-top: 14px;
  }
  .bg-purple .text{
    display: inline-block;
    vertical-align: middle;
    width: 68%;
    line-height:26px;
    padding-left:6px;
    font-size: 15px;
    overflow: hidden;
    // position: relative;
    /*overflow: hidden;*/
    /*text-overflow:ellipsis;*/
    /*display:-webkit-box;*/
    /*-webkit-box-orient:vertical;*/
    /*-webkit-line-clamp:2;*/
}
.bg-purple .text:after {
    //content:"...";
    // position:absolute;
    // bottom:0;
    // right:0;
    // padding-left: 0.2px;
}

.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.configurationBlock{
  box-shadow: 0px 0px 12px 4px #eeee;
  margin-left: 30px;
  padding: 10px 30px;
  margin-bottom: 20px;
  .unit{
    margin-right: 24px;
    &:last-child{
      margin-right: 0px;
    }
  }
  .other{
    margin: 0 20px;
  }
}

</style>
<style lang="less">
  .configurationBlock{
    box-shadow: 0px 0px 12px 4px #eeee;
    margin-left: 30px;
    .el-form-item__label{
      color: #666;
    }
    .el-input{
      width: 90px;
      margin: 0 4px 0 10px;
    }
    .el-form-item__content{
      text-align: right;
    }
  }
  .inputExperience{
    width: 230px;
  }
  .el-date-editor .el-range-separator{
    width: 8%;
  }
  .attachForm{
    .el-form-item__error{
      right: 160px;
    }
  }
  .attachForm.attchVideo{
    .el-form-item__error{
      right: 0px;
    }
  }
  .onlineForm{
    .el-form-item__error{
      right: 100px;
    }
  }
  .storageForm{
    .el-form-item__error{
      right: 0px;
    }
  }
  .membersForm{
    .el-form-item__error{
      right: 0px;
    }
  }
</style>
