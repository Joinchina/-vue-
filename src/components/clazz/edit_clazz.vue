<template>
	<div class="w-wang">
		 <!-- 编辑班级 -->
	      <el-dialog 
	      	class="dialog-form" 
	      	title="编辑班级" 
	      	:visible.sync="dialogEditClass" 
	      	:close-on-click-modal=false 
	      	:before-close="closeEdit"
	      	@open="open">
	        <el-form :model="ruleClassForm2" :rules="rulesClass2" ref="ruleClassForm2">
	          <input type="hidden" v-model="ruleClassForm2.classId" value="">
	          <el-form-item label="班级名称：" :label-width="labelWidth" prop="name">
	            <el-input v-model.trim="ruleClassForm2.name" placeholder="请填写班级名称" auto-complete="off"></el-input>
	          </el-form-item>
            <el-form-item v-if="agencyFlag" label="项目编号：" :label-width="labelWidth" prop="projectCode">
              <el-input v-model.trim="ruleClassForm2.projectCode" placeholder="请填写项目编号" auto-complete="off"></el-input>
            </el-form-item>
	          <!--面授周期-->
	           <el-form-item label="面授周期：" :label-width="labelWidth" required>
	            <el-form-item prop="beginDate" class="sign-time">
	                      
                    <el-date-picker
                      type="date" 
                      value-format="yyyy-MM-dd"
                      placeholder="开始日期" 
                      v-model="ruleClassForm2.beginDate" 
                      style="width: 100%;">
                    </el-date-picker>
	                        
	            </el-form-item>
	            <div class="line">~</div>
	            <el-form-item prop="endDate" class="sign-time sign-time-r">
	                       
                    <el-date-picker
                      type="date" 
                      value-format="yyyy-MM-dd"
                      placeholder="结束日期" 
                      v-model="ruleClassForm2.endDate"
                      style="width: 100%;">
                    </el-date-picker>
	                          
	          </el-form-item> 
	         </el-form-item>

	          <el-form-item label="班级简介：" :label-width="labelWidth" prop="desc">
	            <!-- <el-input type="textarea" v-model="ruleClassForm2.desc"></el-input> -->
				<div id="edit_menuc2" class="toolbar"></div>
          		<div id="edit_contentc2" class="text"></div> 
	          </el-form-item>
	        </el-form>
	        <div slot="footer" class="dialog-footer">
	          <el-button type="primary" @click="saveEditClass('ruleClassForm2')">保存</el-button>
	          <el-button  @click="closeEdit">关闭</el-button>
	        </div>
	    </el-dialog>
	    <!-- /编辑班级 -->
	</div>
</template>
<script>
  import model from 'model/clazz/list'
  import orgModel from 'model/organization/list'
	import aliyunDir from 'model/organization/list'
  import E from 'wangeditor'
  import ailiyunUpload from 'model/aliyun/index'

	export default {
    data() {
      return {
        
        ruleClassForm2:{
          name:"",
          desc:"",
          classId:"",
          beginDate: '',
          endDate: '',
          projectCode:""
        },
        
        rulesClass2:{
          name:[
            { required: true, message: '请填写班级名称', trigger: 'blur'},
            { max: 50, message: '班级名称不能超过50字', trigger: 'blur' }
          ],
          desc: [
            { max: 20000, message: '班级简介不能超过20000字', trigger: 'blur'}
          ],
           beginDate: [
                { type: 'string', required: true, message: '请选择开始日期', trigger: 'change' }
          ],
          endDate: [
                { type: 'string', required: true, message: '请选择截止日期', trigger: 'change' }
          ],
        },
        labelWidth: "120px",

       
        loading: false,
         // 阿里云上传
        editorClazz2: {},
        percentage: 0,
        aliyunName: '',
        originalUrl: '',
        loadingText:0,
        agencyFlag:false,
      }
    },

    props: ['dialogEditClass','clazzId'],
    
    methods: {
      open() {
        
        this.editClass();
        this.$nextTick(() => {

          	if(this.editorClazz2.id) {
	            this.editorClazz2.txt.html("");
	        } else {
	        	this.wangEditc2();
	        }
        })
        let orgData = {id:this.$route.query.orgId?this.$route.query.orgId:JSON.parse(localStorage.orgId).identification}
					orgModel.getDetail(orgData,(res)=>{
						this.loading = false;
						if(res.status==200&&res.data.orgType=="AGENCY"){
							this.agencyFlag=true;
						}
					})
      },

      wangEditc2() {
	    let editorClazz2 = new E('#edit_menuc2', '#edit_contentc2')
	        
	        editorClazz2.customConfig.menus = [
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
	        editorClazz2.customConfig.customUploadImg = (files, insert) => {
	            // aliyun 上传图片
	            aliyunDir.getAliyunImg({}, (res => {
	                if(res.status == 200) {
	                    // aliyun 上传图片
                    this.percentage = 0;
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

	        editorClazz2.customConfig.onchange = (html) => {
	            this.ruleClassForm2.desc = html
	        };
	        editorClazz2.customConfig.zIndex = 1;
	        editorClazz2.create();
	        this.editorClazz2 = editorClazz2;

	    },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
     
      closeEdit () {
        this.$emit('update:dialogEditClass', false);
        this.resetForm('ruleClassForm2');
      },
      editClass () {
        
      
        let _this = this;
       
        let data = {
          id: this.clazzId
        }

        model.getClassInfor(data, ( res => {
          // console.log("班级编辑", res);
          if(res.status == 200) {
            this.ruleClassForm2.name = res.data.name;
            this.ruleClassForm2.desc = res.data.description;
            this.ruleClassForm2.classId = res.data.id;
            this.ruleClassForm2.beginDate = res.data.trainingBeginDate;
            this.ruleClassForm2.endDate = res.data.trainingEndDate;
            this.ruleClassForm2.projectCode = res.data.projectCode;
             this.editorClazz2.txt.html(this.ruleClassForm2.desc);
          } else {
            _this.$message.error(res.message);
          }
        }));
      },

      // 编辑班级
      saveEditClass (formName) {

        let _this = this;
        this.$refs[formName].validate((valid) => {
          if(valid) {
            // 保存编辑
            let data = {
              id: this.ruleClassForm2.classId,
              name: this.ruleClassForm2.name,
              description: this.ruleClassForm2.desc,
              trainingBeginDate:this.ruleClassForm2.beginDate,
              trainingEndDate:this.ruleClassForm2.endDate,
              projectCode:this.ruleClassForm2.projectCode
            }
            model.editClass(data, (res => {
              if(res.status == 200) {
                // _this.$router.go(0);
                _this.closeEdit();
                _this.$emit("updateProList");
                // _this.getListFromPro();
              } else {
                _this.$message.error(res.message);
              }
            }));
          } else {
            console.log('save class error submit!!');
            return false;
          }
        });
      },

      
    },

  }
</script>
<style scoped lang="less">
 	 @import "../../assets/reset-element-ui/form.css";
  	.line{
        float:left;
        margin: 0 10px;
        color: #a3b1c5;
    }
    .sign-time{
        float: left;
    }
    .sign-time-r{
        padding-left: 8px;
    }
</style>