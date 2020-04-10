<template>
    <div>
        <section class="handle clearfix">
            <Goback passtitle="机构简介" ></Goback>
        </section>

        <div class="wrapper  w-wang" id="worgList">
            
            <!--机构编辑状态-->
            <div id="waddClass" class="details" v-if="getCurRole == 'ADMIN' || getCurRole == 'ORGADMIN'">
            <!--{{getCurRole}}-->
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="机构名" :label-width="labelWidth" prop="name" class = "el-form-itemt ">
                <el-input v-model.trim="ruleForm.name" placeholder=""></el-input>
              </el-form-item>
              
              <el-form-item  label="机构类型" :label-width="labelWidth" prop="type">
                  <el-select v-model.trim="ruleForm.type" v-if="getCurRole == 'ORGADMIN'" disabled  placeholder="请选择">
                      <el-option 
                        v-for="item,key,index in orgType" 
                        :key="index" 
                        :label="item" 
                        :value="key">
                      </el-option>

                  </el-select>

                  <el-select v-model.trim="ruleForm.type" v-else  placeholder="请选择">
                      <el-option 
                        v-for="item,key,index in orgType" 
                        :key="index" 
                        :label="item" 
                        :value="key">
                      </el-option>
                  </el-select>
              </el-form-item>
              <!--新增一个选择省份 -->
              <el-form-item  label="机构所在省份" :label-width="labelWidth" prop="province">
                   <!-- 权限设置只有anmin时可以修改显示下面这一条 -->
                  <el-select v-model.trim="ruleForm.province"  v-if="getCurRole == 'ADMIN'"  placeholder="请选择">
                      <el-option 
                        v-for="item,key,index in Province" 
                        :key="index" 
                        :label="item" 
                        :value="item">
                      </el-option>

                  </el-select>
                  <!-- 其他管理员登录时显示这一条 -->
                  <el-select v-model.trim="ruleForm.province" v-else disabled placeholder="请选择">
                      <el-option 
                        v-for="item,key,index in Province" 
                        :key="index" 
                        :label="item" 
                        :value="item">
                      </el-option>

                  </el-select>      
              </el-form-item>
              <el-form-item  label="VIP开关" :label-width="labelWidth" prop="vipSwitch">
                <el-switch
                  v-model="ruleForm.vipSwitch"
                  @change="vipChange"
                  :disabled="getCurRole != 'ADMIN'" 
                  active-color="#13ce66"
                  inactive-color="#DCDFE6">
                </el-switch> 
              </el-form-item>

              <div class="configurationBlock">
                <el-form-item  label="付费功能配置：" :label-width="labelWidth" prop="vipSwitch"> </el-form-item>
                <el-form-item  label="学员提交附件大小：" label-width="160px" prop="attachmentSize" :class="{attachForm:true,attchVideo:attchVideoFalse}">
                  <span>文档类</span><el-input v-model="ruleForm.attachmentSize" placeholder="请输入内容" :disabled="getCurRole != 'ADMIN'"></el-input><em class="unit">M</em>
                  <span>视频</span><el-input v-model="ruleForm.videoSize" placeholder="请输入内容" :disabled="getCurRole != 'ADMIN'"></el-input><em>M</em>
                </el-form-item>
                <el-form-item  label="网络课程数量限制：" label-width="160px" prop="onlineCourse"  class="onlineForm">
                  <span>必修</span><el-input v-model="ruleForm.onlineCourse" placeholder="请输入内容" :disabled="getCurRole != 'ADMIN'"></el-input><em class="unit">门/班</em>
                  <span>选修</span>
                  <el-switch
                    v-model="ruleForm.take"
                    :disabled="getCurRole != 'ADMIN'" 
                    active-color="#13ce66"
                    inactive-color="#DCDFE6">
                  </el-switch> 
                </el-form-item>
                <el-form-item  label="存储空间大小限制：" label-width="160px" prop="storageSize" class="storageForm">
                  <el-input v-model="ruleForm.storageSize" placeholder="请输入内容" :disabled="getCurRole != 'ADMIN'"></el-input><em>G</em>
                </el-form-item>
                <el-form-item  label="成员数量限制：" label-width="160px" prop="Members" class="membersForm">
                  <el-checkbox @change="memberChange" v-model="ruleForm.noLimit" :disabled="getCurRole != 'ADMIN'" v-if="(getCurRole != 'ADMIN'&&ruleForm.noLimit) || getCurRole == 'ADMIN'">不限制</el-checkbox><span class="other" v-if="getCurRole == 'ADMIN'">或</span><el-input  v-if="(getCurRole != 'ADMIN'&&!ruleForm.noLimit)|| getCurRole == 'ADMIN'" :disabled="getCurRole != 'ADMIN' || (ruleForm.noLimit)" v-model="ruleForm.Members" placeholder="请输入内容"></el-input><em v-if="(getCurRole != 'ADMIN'&&!ruleForm.noLimit)|| getCurRole == 'ADMIN'">人</em>
                </el-form-item>
              </div>

              <el-form-item  label="直播体验时长" :label-width="labelWidth" prop="liveExperience">
                <el-input placeholder="请输入内容" v-model="ruleForm.liveExperience" class="inputExperience" :disabled="getCurRole != 'ADMIN'">
                  <template slot="append">小时</template>
                </el-input>
              </el-form-item>
              <el-form-item v-if="ruleForm.vipSwitch" label="VIP有效期" :label-width="labelWidth" prop="vipDateRange" >
                <el-date-picker
                  v-model="ruleForm.vipDateRange"
                  type="daterange"
                  :disabled="getCurRole != 'ADMIN'"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @focus = "dateFocus"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              
              <!-- 富文本编辑器 -->
              <el-form-item label="机构简介" :label-width="labelWidth" prop="desc">
                <!-- <el-input type="textarea" class="el-textarea_width" v-model="ruleForm.desc" placeholder=""></el-input> -->
                <div id="edit_menu" class="toolbar"></div>
                <div id="edit_content" class="text"></div> 
              </el-form-item>

              <el-form-item label="机构logo" :label-width="labelWidth" prop="photo" class="avatar-uploader org-uploader" v-loading="loading" :element-loading-text="loadingText">

                <img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" id="avatarProfessor" class="avatar">

                <div v-else class="avatar"><i class="el-icon-plus"></i></div>

                <label for="file" class="sel2">选择照片</label>
                <input class="sel1" id="file"  type="file" name="ruleAddProfessor.photo" accept="image/png,image/gif,image/jpeg"  @change="selAvatar($event)">

              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')" class="btn-green-square-t" style="margin-left: 108px">保存</el-button>

              </el-form-item>
            </el-form>
            </div>

            <!--机构查看状态 -->
            <div id="waddClass" class="dialog-form" v-else>
              <!--{{getCurRole}}-->
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm noEdit-ruleForm">
              <el-form-item label="机构名：" prop="name" class = "el-form-itemt">
                <span v-if="!!ruleForm.name">{{ ruleForm.name }}</span>
                <span v-else>暂无</span>
              </el-form-item>
              <el-form-item label="机构类型：" prop="type" class = "el-form-itemt">
                <span v-if="!!ruleForm.name">{{ orgType[ruleForm.type] }}</span>
                <span v-else>暂无</span>
              </el-form-item>
              <el-form-item label="机构所在省份：" prop="province" class = "el-form-itemt">
                <span v-if="!!ruleForm.name">{{ruleForm.province }}</span>
                <span v-else>暂无</span>
              </el-form-item>
              <el-form-item label="vip：" prop="province" class = "el-form-itemt">
                <span>{{ruleForm.vipSwitch ? "是" : "否"}}</span>
              </el-form-item>
              <div class="configurationBlock">
                <el-form-item  label="付费功能配置：" :label-width="labelWidth" prop="vipSwitch"> </el-form-item>
                <el-form-item  label="学员提交附件大小：" label-width="160px">
                  <span>文档类：</span><span>{{ruleForm.attachmentSize}}</span><em class="unit">M</em>
                  <span>视频：</span><span>{{ruleForm.videoSize}}</span><em class="unit">M</em>
                </el-form-item>
                <el-form-item  label="网络课程数量限制：" label-width="160px">
                  <span>必修：</span><span>{{ruleForm.onlineCourse}}</span><em class="unit">门/班</em>
                  <span>选修：{{ruleForm.take? "有" : "无"}}</span>
                </el-form-item>
                <el-form-item  label="存储空间大小限制：" label-width="160px">
                  <span>{{ruleForm.storageSize}}</span><em class="unit">G</em>
                </el-form-item>
                <el-form-item  label="成员数量限制：" label-width="160px">
                  <span v-if="ruleForm.noLimit">无限制</span>
                  <span v-else>{{ruleForm.Members}}<em class="unit">人</em></span>
                </el-form-item>
              </div>
              <el-form-item label="直播体验时长：" prop="desc">
                <span>{{ruleForm.liveExperience}}小时</span>
              </el-form-item>
              <el-form-item label="VIP有效期：" prop="desc" v-if="ruleForm.vipSwitch">
                <span>{{ruleForm.vipDateRange[0]}}</span><em> 至 </em><span>{{ruleForm.vipDateRange[1]}}</span>
              </el-form-item>
              <el-form-item label="机构简介：" prop="desc">
                <span v-if="!!ruleForm.desc" class="deschtml" v-html="ruleForm.desc"></span>
                <span v-else>暂无</span>
              </el-form-item>
              <el-form-item label="机构logo：" prop="logo">
                <span v-if="!!ruleForm.imageUrl"><img :src="ruleForm.imageUrl"/></span>
                <span v-else>暂无{{ruleForm.imageUrl}}</span>
              </el-form-item>
            </el-form>
            </div>
        </div>
    </div>
</template>
<script>
    import model from 'model/organization/list'
    import {getCurRole} from '../../filters/userVerify'
    import bus from '@/global/bus'
    import { mapGetters, mapActions } from 'vuex'
    import Goback from 'base/goback/goback'
    import E from 'wangeditor'
    import ailiyunUpload from "model/aliyun/index"

    export default {

      computed:{
          ...mapGetters(['showOrgObj'])
      },

      watch:{

        showOrgObj(cur,old){

           this.orgId = cur.identification;
           this.dataEdit(this.orgId);
        },

      },

      data() {
        let validateInteger = (rule, value, callback) => {
          if(this.getCurRole == "ADMIN"){
            if (!(/(^[1-9]\d*$)/.test(value))) {
              callback(new Error('请输入大于零的正整数'));
            }else if(Number(value) > 999999999){
              callback(new Error('超出限制'));
            } else {
              callback();
            }
          }else{
            callback();
          }
          
        };
        let validateMembers = (rule, value, callback) => {
          if(this.getCurRole == "ADMIN"){
            if (!(/(^[1-9]\d*$)/.test(value))&&!this.ruleForm.noLimit) {
              callback(new Error('请输入大于零的正整数'));
            } else if(Number(value) > 999999999){
              callback(new Error('超出限制'));
            }else {
              callback();
            }
          }else{
            callback();
          }
          
        };
        let validateAttachmentSize = (rule, value, callback) => {
          if (!(/(^[1-9]\d*$)/.test(value))||!(/(^[1-9]\d*$)/.test(this.ruleForm.videoSize))) {
            if(!(/(^[1-9]\d*$)/.test(this.ruleForm.videoSize))){
              this.attchVideoFalse = true;
            }else{
              this.attchVideoFalse = false;
            }
            
            callback(new Error('请输入大于零的正整数'));
          }else if(Number(value) > 999999999 || Number(this.ruleForm.videoSize) > 999999999){
            if( Number(this.ruleForm.videoSize) > 999999999){
              this.attchVideoFalse = true;
            }else{
              this.attchVideoFalse = false;
            }
            callback(new Error('超出限制'));
          } else {
            this.attchVideoFalse = false;
            callback();
          }
        };
        let validateLiveTime = (rule, value, callback) => {
          if(this.getCurRole == "ADMIN"){
            if (!(/^\d+(?=\.{0,1}\d+$|$)/.test(value))) {
              callback(new Error('请输入正数'));
            }else if(Number(value) > 999999999){
              callback(new Error('超出限制'));
            } else {
              callback();
            }
          }else{
            callback();
          }
          
        };
        return {
          getCurRole : "",
          Province : "",
          ProvinceId : "",
          loadingText : "拼命加载中",
          loading : false,
          ruleForm: {
            name: '',
            type: '',
            desc: '',
            photo:"",
            imageUrl:"",
            province:"",
            vipSwitch: false,
            attachmentSize:5,
            videoSize:10,
            onlineCourse:1,
            take:true,
            storageSize:50,
            Members:10,
            noLimit:false,
            liveExperience:10,
            vipDateRange:"",
            logo : "",
          },
          rules: {
            name: [
              { required: true, message: '请输入机构名', trigger: 'blur' },
              { max: 30, message: '机构名不能超过30字', trigger: 'blur' }
            ],
            type: [
              { required: true, message: '请填写机构类型', trigger: 'change'}
            ],
            province: [
              { required: true, message: '请填写机构所在省份', trigger: 'change'}
            ],
            vipSwitch: [
              { required: true, trigger: 'change'}
            ],
            liveExperience :[
              { required : true, trigger : 'blur', message: '请填写直播体验时长'},
              { required : true, trigger : 'blur',validator : validateLiveTime},
            ],
            vipDateRange :[
              { required : true, trigger : 'blur', message: '请填写VIP有效期'}
            ],
            attachmentSize : [
              { required : false, trigger : 'blur', validator : validateAttachmentSize}
            ],
            onlineCourse : [
              { required : false, trigger : 'blur', validator : validateInteger}
            ],
            storageSize : [
              { required : false, trigger : 'blur', validator : validateInteger}
            ],
            Members : [
              { required : false, trigger : 'blur', validator : validateMembers}
            ],
          },
          orgId:"",
          labelWidth: "140px",
          orgType: "",    // 机构类型

            // 阿里云上传
          editor: {},
          percentage: 0,
          aliyunName: '',
          originalUrl: '',
          loadingText:0,
          posturl:'',
          freeConfig:{
            attachmentSize:5,
            videoSize:50,
            onlineCourse:1,
            take:false,
            storageSize:10,
            Members:500,
            noLimit:false,
            liveExperience:10,
          },
          vipConfig:{
            attachmentSize:30,
            videoSize:300,
            onlineCourse:3,
            take:true,
            storageSize:500,
            Members:"",
            noLimit:true,
            liveExperience:100,
          },
          attchVideoFalse: false,
          pickerOptions: {
          disabledDate(time) {
              return time.getTime() < Date.now() - 8.64e7;
            },
          }  
        };
      },
        created(){
            //机构管理员和admin
            this.getCurRole = getCurRole();

            this.orgId = this.$route.query.orgId;

            //获取机构所在的省
            this.getProvince();
            
            // 获取机构类型
            this.getOrgType();

            //
            this.defaultConfiguration();
        },
        mounted() {
            
            this.wangEdit();
            this.dataEdit();
        },

        methods: {
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
                  	var str=html.toString();
								var num=str.indexOf('<!--[if gte mso 9]>')
	              var endnum=str.indexOf("<![endif]-->")
								var newstr = str.substring(num + 1,endnum)
								var a=str.split(newstr).join("")
                    this.ruleForm.desc = a
                };
                editor.customConfig.zIndex = 1;
                editor.create();
                this.editor = editor;

            },
            dataEdit(orgId) {
             if(!!this.orgId){
                if(!!orgId){
                  var data = {
                    id: orgId
                  }
                }else{
                  var data = {
                    id: this.orgId
                  }
                }

                model.getDetail(data, (res => {

                  console.log("机构详情==res==", res);

                  if (res.status == 200) {
                    let detailData = res.data;
                    this.ruleForm.name = detailData.name;
                    this.ruleForm.desc = detailData.description;
                    this.editor.txt.html(this.ruleForm.desc);
                    this.ruleForm.type = detailData.orgType;
                    this.ruleForm.imageUrl = detailData.logo;
                    this.ruleForm.logo = detailData.logo;
                    this.ruleForm.province = detailData.orgCityName
                    this.ProvinceId = detailData.zoneId;
                    this.ruleForm.vipSwitch = detailData.organizationAccount.vip;
                    this.ruleForm.attachmentSize = Math.ceil(detailData.organizationAccount.studentDocSize/1024/1024);
                    this.ruleForm.videoSize = Math.ceil(detailData.organizationAccount.studentVideoSize/1024/1024);
                    this.ruleForm.onlineCourse = detailData.organizationAccount.onlineCourseCount;
                    this.ruleForm.take = detailData.organizationAccount.onlineSelectCourse;
                    this.ruleForm.storageSize = Math.ceil(detailData.organizationAccount.storageSpace/1024/1024/1024);
                    this.ruleForm.Members = detailData.organizationAccount.studentCount == -1 ? "" : detailData.organizationAccount.studentCount;
                    this.ruleForm.noLimit = detailData.organizationAccount.studentCount == -1;
                    this.ruleForm.liveExperience = (detailData.organizationAccount.liveTime/60/60).toFixed(2);
                    if(detailData.organizationAccount.vip){
                      let startDate = detailData.organizationAccount.startDate ? detailData.organizationAccount.startDate : "";
                      let endDate = detailData.organizationAccount.endDate ? detailData.organizationAccount.endDate : "";
                      this.ruleForm.vipDateRange = [startDate,endDate];
                    }
                    
                    // 对省份信息进行遍历操作获取到当前所在的省
                    for (const key in this.Province) {
                      if ( key == detailData.zoneId) {
                        this.ruleForm.province= this.Province[key]  
                        console.log(this.Province[key])               
                      }
                    }               
                  } else {
                    this.$message.error(res.message);
                  }
                }))

                console.log("机构详情==data==", this.ruleForm);
             }
            },
            selAvatar (event) {
              // 获取本地图片的地址
              let _this = this;
              let extend = event.target.value.substr(event.target.value.lastIndexOf(".") + 1).toLowerCase();
              // console.log("value",event.target.files);
              if (extend == "jpg" || extend == "png" || extend == "gif" || extend == "jpeg") {
                let files = event.target.files;
                
                this.orgLogoUpload(files,()=>{
                  let objUrl = event.target.files[0];
                  let windowURL = window.URL || window.webkitURL;
                  let imageUrl = windowURL.createObjectURL(objUrl);
                  _this.ruleForm.imageUrl = imageUrl;
                  _this.ruleForm.file = files[0];
                })
                
                // document.getElementById("avatarOrg").src = imageUrl;
              }

            },
            submitForm(formName) {
              this.$refs[formName].validate((valid) => {
                if (valid) {
                  this.detailData();

                } else {
                  console.log('error submit!!');
                  return false;
                }
              });
            },
            detailData(){
              //console.log(this.Province)  // 大集合
              //console.log(this.ruleForm.province)  //根据省份拿到其中的id值
              for (const key in this.Province) {
                  if(this.Province[key]==this.ruleForm.province){
                    this.ProvinceId=key;
                    // console.log(this.ProvinceId)
                  }          
              }
              var data = {
                  name:this.ruleForm.name,
                  id:this.orgId,
                  logo : this.ruleForm.logo,   
                  orgType: this.ruleForm.type,
                  description:this.ruleForm.desc,
                  zoneId:this.ProvinceId,   //省份id
                  organizationAccount : {
                  vip : this.ruleForm.vipSwitch,               // 是否为vip
                  studentDocSize : this.ruleForm.attachmentSize*1024*1024,   // 学员附件--->文档类(b)
                  studentVideoSize : this.ruleForm.videoSize*1024*1024,      // 学员附件--->视频类(b)
                  onlineCourseCount : this.ruleForm.onlineCourse,            // 网络课程必修
                  onlineSelectCourse : this.ruleForm.take,       // 网络选修课开关
                  storageSpace : this.ruleForm.storageSize*1024*1024*1024,       // 存储空间大小(b)
                  studentCount : this.ruleForm.noLimit ? -1 : this.ruleForm.Members,   // 成员数量限制 不限制（-1）
                  liveTime : this.ruleForm.liveExperience*60*60   // 直播体验时长
                }
              }
              if(this.ruleForm.vipSwitch){
                data.organizationAccount.startDate = this.ruleForm.vipDateRange[0];
                data.organizationAccount.endDate = this.ruleForm.vipDateRange[1];
              };
              // console.log("修改机构", data);
              model.orgUpdate(data, ( res => {
                // console.log(res.data)
                if( res.status == 200) {
                  this.$message.success("保存成功");
                  if(!!res.data&&!!res.data.logo){
                    var obj = {
                      logo : res.data.logo,
                      name : res.data.name,
                    }
                    //bus.$emit("changeLogo",obj);
                    console.log("派发log" +obj);
                    this.$store.dispatch("changeLogo",obj);

                  }


                } else {
                  this.$message.error(res.message);
                }
              }))
            },
            // 获取机构类型
            getOrgType() {
              model.getOrgType({}, (res => {
                console.log("机构类型 ", res);
                if(res.status == 200) {
                  // console.log("机构类型", res.data);
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
                        console.log("省份", res.data);
                        this.Province = res.data;
                    } else {
                        this.$message.error(res.message);
                    }
                }))
            },
            //vip开关
            vipChange(){
              if(this.ruleForm.vipSwitch){
                this.ruleForm = Object.assign(this.ruleForm,this.vipConfig)
              }else{
                this.ruleForm = Object.assign(this.ruleForm,this.freeConfig)
              }
            },
            memberChange(){
              if(this.ruleForm.noLimit){
                this.ruleForm.Members = "";
              }
            },
            // 接口获取默认配置
            defaultConfiguration(){
              model.defaultConfiguration({},res=>{
                res.data.forEach((item,index)=>{
                  let configObj = {
                    attachmentSize : Math.ceil(Number(item.studentDocSize)/1024/1024),
                    videoSize : Math.ceil(Number(item.studentVideoSize)/1024/1024),
                    onlineCourse:item.onlineCourseCount,
                    take : item.onlineSelectCourse,
                    storageSize : Math.ceil(item.storageSpace/1024/1024/1024),
                    Members : item.studentCount == -1 ? "" : item.studentCount,
                    noLimit : item.studentCount == -1,
                    liveExperience : "100.00",
                  };
                  console.log(configObj);
                  if(item.vip){
                    this.vipConfig = configObj;
                  }else{
                    configObj.liveExperience = "10.00";
                    this.freeConfig = configObj;
                  }
                })
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
                    this.ruleForm.logo = decodeURI(result.res.requestUrls[0]).split('?')[0];
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
            },
            // 格式化秒
            formatSeconds(value) {
                let secondTime = parseInt( value ); // 秒
                let minuteTime = 0; // 分
                let hourTime = 0; // 小时
                if(secondTime == NaN) return "";
                if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
                    //获取分钟，除以60取整数，得到整数分钟
                    minuteTime = parseInt( secondTime / 60 );
                    //获取秒数，秒数取佘，得到整数秒数
                    secondTime = parseInt( secondTime % 60 );
                    //如果分钟大于60，将分钟转换成小时
                    if(minuteTime > 60) {
                        //获取小时，获取分钟除以60，得到整数小时
                        hourTime = parseInt( minuteTime / 60 );
                        //获取小时后取佘的分，获取分钟除以60取佘的分
                        minuteTime = parseInt( minuteTime % 60 );
                    }
                }
                let result = secondTime!=0?(secondTime + "秒"):"";
    
                if( minuteTime > 0 ) {
                    result = minuteTime + "分" + result;
                }
                if( hourTime > 0 ) {
                    result = hourTime + "小时" + result;
                }
                return result;
            },

            dateFocus(){
              console.log(111);
              this.$refs.ruleForm.clearValidate("vipDateRange")
            }
        },

        components: {
            Goback
        }

    }
</script>
<style scoped="" lang="less">
    @import "../../assets/less/btn-search.less";
    @import "../../assets/reset-element-ui/item.css";
    @import "../../assets/reset-element-ui/form.css";

    .w-wang {
        .text {
            width: 600px;
            height: 250px;
            border: 1px solid #F2F0F0;
        }
        .toolbar {
            width: 600px;
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
    .deschtml {
        line-height: 1.5em;
    }
  #worgList {
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 0 3px #eee;
    padding:72px 0 30px 0;
  }
  #waddClass{
    width: 710px;
    margin: 0 auto;
  }
  .avatar-uploader {
  .avatar {
    display: inline-block;
    background-color: #fbfdff;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
  // cursor: pointer;
    position: relative;
    overflow: hidden;
    text-align: center;

  }
 
  .el-icon-plus {
    margin-top: 40px;
    margin-top: 34px;
    font-size: 18px;
    color: #999;
  }
  .avatar {
    width: 88px;
    height: 88px;
  }
  .sel2,
  .sel1 {
    position: absolute;
    display: inline-block;
    width: 95px;
    height: 30px;
    background-color: #43bdb3;
    font-size: 14px;
    color: #35a69d;
    color: #fff;
    line-height: 30px;
    text-align: center;
  }
  .sel1 {
    opacity: 0;
  }
  .sel2 {
    margin-left: 10px;
  >i{
    font-size: 12px;
  }
  }
  }
  .noEdit-ruleForm img{
    width: 60px;
    height: 60px;
    border-radius: 50%;
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
      .el-input__inner{
        width: 100%;
      }
    }
    .el-form-item__content{
      text-align: right;
    }
  }
  .inputExperience{
    width: 230px;
    .el-input__inner{
      width: 100%;
    }
  }
  .el-date-editor.el-range-editor.el-input__inner.el-date-editor--daterange{
    width: 400px;
  }
  .el-date-editor .el-range-separator{
    width: 8%;
  }
  .attachForm{
    .el-form-item__error{
      left: 156px;
    }
  }
  .attachForm.attchVideo{
    .el-form-item__error{
      right: 0px;
    }
  }
    
  .onlineForm{
    .el-form-item__error{
      left: 234px;
    }
  }
  .storageForm{
    .el-form-item__error{
      left: 330px;
    }
  }
  .membersForm{
    .el-form-item__error{
      left: 330px;
    }
  }
</style>
