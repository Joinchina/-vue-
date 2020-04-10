<style scoped lang="less">
	@import "../../assets/reset-element-ui/form.css";
	@import "../../assets/less/icon.less";
	@import "../../assets/less/activity.less";

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
  	width: 108px;
  	height: 30px;
  	background-color: #f2fbfa;
  	border:1px solid #82cac3;
  	color: #333;
  	font-size: 14px;
  	line-height: 30px;
  	text-align: center;
  	border-radius: 3px;
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
.avatar-uploader img{
	margin-right: 10px;
	margin-bottom: 10px;
}
.avatar-uploader li{
	float:left;
	position: relative;
}
.avatar-uploader .error{
	position: absolute;
	right: 0px;
	top: -5px;
}
.dialog-form .selectStudent{
	border: 1px solid #bfcbd9;
	padding:10px 5px 10px 20px;
	margin-top: 10px;
	border-radius: 3px;
	max-height:150px ;
	overflow-y:auto;
}
.dialog-form .selectStudent li{
	float: left;
	line-height: 25px;
	color: #5d6a7c;
	padding-right: 15px;
}
.el-transfer-panel .el-transfer-panel__header{
	color: #35a69d!important;
}
.word{	
	margin-left: 120px;
	float: left;
	position: relative;
	width: 300px;
	font-size: 14px;
	color: #c0c4cc;
}
#sel2{
	    position: absolute;
    display: inline-block;
    width: 108px;
    height: 30px;
    background-color: #f2fbfa;
    border: 1px solid #82cac3;
    color: #333;
    font-size: 14px;
    line-height: 30px;
    text-align: center;
	border-radius: 3px;
	margin-left: 0px;
}
.fileerror{
	position: absolute;
	top: 40px;
	left: 0px;
	width: 460px;
	font-size:14px;
	color: #ff3333;
	display: none;
}
</style>
<style lang="less">
    .CcreateMutual{
        .avatar-uploader .el-form-item__content {
            margin-left: 170px!important;
        }
        .el-select{
            width: 220px;
        }
    }
</style>
<template>

	<div id="weditWork" class="CcreateMutual">

		<el-dialog class="dialog-form" title="编辑学员互评作业"
			:visible.sync="dialogEditMutual"
			:close-on-click-modal="false"
			:before-close="close"
			:lock-scroll="true"
			@open="open">

			<el-form :model="ruleForm" :rules="rules" ref="ruleForm"
				v-loading="loading"
				element-loading-text="拼命加载中">

				<el-form-item label="作业标题：" prop="title" :label-width="labelWidth">
					<el-input v-model.trim="ruleForm.title" placeholder="30字以内"></el-input>
				</el-form-item>
				<el-form-item label="作业说明：" prop="content" :label-width="labelWidth">
					<el-input type="textarea" v-model="ruleForm.content" placeholder="200字以内(选填)"></el-input>
				</el-form-item>

				<el-form-item :label-width="labelWidth"  prop="photo" class="avatar-uploader">
					<label for="fileName" class="sel2" style="margin-left:0px;"><span class="icon-dis-add"></span>添加照片</label>
					<input class="sel1 select-file" multiple="true" id="fileName" type="file" name="ruleForm.photo" accept="image/png,image/gif,image/jpeg"  @change="selAvatar($event)">

					<div style="margin-top:40px;margin-left:10px;">
						<ul v-if = "imageUrl.length != ''|| photoUrl.length != ''">
							<!-- 返回的图片 -->
							<li v-for="(item,index) in photoUrl" :key="item.id">
								<img :src="item.transUrl" class="avatar" style="width:150px;height: 150px;">
								<span class="icon-dis-error error" @click="delPhoto(index,item.id)"></span>
							</li>
							<!-- 上传的图片 -->
							<li v-for="(item,index) in imageUrl" :key="index">
								<img :src="item" class="avatar" style="width:150px;height: 150px;">
								<span class="icon-dis-error error" @click="deletePic(index,$event)"></span>
							</li>
						</ul>
					</div>
				</el-form-item>

				<el-form-item label="所属课程：" prop="course" :label-width="labelWidth">
                    <p>{{courseName}}</p>
				</el-form-item>

                <el-form-item label="开始日期：" :label-width="labelWidth">
                    <el-date-picker
                        v-model="ruleForm.beginTime"
                        type="date"
                        placeholder="立即开始"
						format="yyyy-MM-dd"
						value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions1">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="作业提交截止日期：" :label-width="labelWidth" prop="endTime">
                    <el-date-picker
                        v-model="ruleForm.endTime"
                        type="date"
                        placeholder="请选择"
						format="yyyy-MM-dd"
						value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions1">
                    </el-date-picker>
                </el-form-item>
				
				<el-form-item label="参与人：" prop="members" :label-width="labelWidth">
					<el-select v-model="ruleForm.members" placeholder="全体成员" disabled @change="membersChange">
						<el-option label="全体成员" value="all"></el-option>
						<el-option label="指定参与人" value="sel"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="选择成员：" prop="" v-show="specifyStudent" :label-width="labelWidth">
					<a href="javascript:void(0)" class="icon-dis-choose" @click="studentSelect = true">点击选择成员</a>
					<div class="selectStudent" v-if="selectData.length != 0">
						<ul class="clearfix" >
							<li v-for="(item,index) in selectData" :key="index">{{item.name}}（{{item.id}}）</li>
						</ul>
					</div>
				</el-form-item>
                <el-form-item label="学员评阅作业数：" prop="reviewHomeWorkCount" :label-width="labelWidth">
					<el-select v-model="ruleForm.reviewHomeWorkCount" @change="membersChange">
						<el-option label="2" value="2"></el-option>
						<el-option label="3" value="3"></el-option>
                        <el-option label="4" value="4"></el-option>
                        <el-option label="5" value="5"></el-option>
					</el-select>
				</el-form-item>
                <el-form-item label="评阅截止日期：" prop="reviewHomeWorkEndTime" :label-width="labelWidth">
                    <el-date-picker
                        v-model="ruleForm.reviewHomeWorkEndTime"
                        type="date"
                        placeholder="请选择"
						format="yyyy-MM-dd"
						value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions1">
                    </el-date-picker>
                </el-form-item>
				<!--新增作业附件-->
				<open-upload
					:fileNum = "fileNum"
                    :labelWidth="labelWidth"
					ref="openUploads" 
					:fileLists = "fileLists" 
					@fileList = "fileListAll"
                    @delIdsAttach="delIdsAttach">
					
				</open-upload>

			</el-form>
			<div slot="footer" class="dialog-footer">
		        <el-button type="primary" @click="!loading&&submitForm('ruleForm')">发布</el-button>
		        <el-button @click="close">关闭</el-button>
		    </div>
		</el-dialog>

		<!--选择学员_start-->
	    <student-select
	        :dialogStudentSelect.sync = "studentSelect"
            :groupTitles = "groupTitle"
	        @StudentSelectData="selectDataMthod"
	        :sel="sel"></student-select>
	    <!--选择学员_end-->

		<!-- 存储空间不足弹框 -->
		<overLimitPop 
			:overLimitDialog.sync = "overLimit" 
			:text = "'您所属机构的存储空间已达上限，新增培训数据无法存储'" 
			:footerText = "'增加存储空间'" 
			:param="'storage'"></overLimitPop>
	</div>
</template>
<script>
	import work from 'model/activity/homework'
	import studentSelect from 'components/activity/discuss/student_select'
  	import bus from '@/global/bus'
  	import { dateFormatStr,strFormatDate } from '@/global/open'
  	import { getCurRole } from '@/filters/userVerify'
	import openUpload from '@/base/upload/upload'
	import overLimitPop from "@/base/overLimitPop/index"

	export default {
		data() {
            let validateEndTime = (rule, value, callback) => {
				console.log(value)
				console.log(this.ruleForm.beginTime)
                if (value === '') {
                    callback(new Error('请选择作业提交截止日期'));
                } else if (value <this.ruleForm.beginTime) {
                    callback(new Error('作业提交截止日期必须大于开始日期!'));
                } else {
                    callback();
                }
            };
            let validateEndTimeReview = (rule, value, callback) => {
				console.log(value)
				console.log(this.ruleForm.endTime)
                if (value === '') {
                    callback(new Error('请选择评阅截止日期'));
                } else if (value <=this.ruleForm.endTime) {
                    callback(new Error('评阅截止日期必须大于作业提交截止日期!'));
                } else {
                    callback();
                }
            };
			return {
				pickerOptions1: {
					disabledDate(time) {
						return time.getTime() < Date.now()  - 8.64e7;
					}
				},
                groupTitle:["学员列表","已选学员列表"],
				imageUrl: [],
				photoUrl: [],				// 返回的图片
				num:"",
				selectData:[],				// 选择参与人集合

				specifyStudent: false,		// 是否制定参与人
				ids:[],
				ids2:[],					// 删除图片id 集合
				sel: [],			// 已选中参与人
				expertsName: '',
				expertsId: '',
				courseName: '',
				ruleForm: {
					title: '',
					content: '',
					photo: [],
					course: '',
					beginTime: '',
					endTime: '',
					members: 'all',
					openmode: 'TIMING',
					reviewHomeWorkCount: "2",      //评阅人数
                    reviewHomeWorkEndTime:''        //评阅截至时期

				},
				labelWidth: "170px",
				rules: {
					title: [
						{required: true, message: '请输入作业标题', trigger: 'blur'},
						{max: 30, message: '作业标题请输入30字以内', trigger: 'blur'}
					],
					content: [
						{ required: false, max:200, message: '作业说明请输入200字以内', trigger: 'change' }
					],
					course: [
						{ required: true, max:200, message: '请选择课程', trigger: 'change' }
                    ],
                    endTime:[
                        { required: true, validator: validateEndTime,}
                    ],
                    reviewHomeWorkEndTime:[
                        { required: true, validator: validateEndTimeReview,}
                    ]
				},
				studentSelect:false,
                loading: false,
				//file:"",
				//clazzId:"",
				//courseId2:"",
				//activityId2:"",


				fileLists:[],
				fileDelIds:[],
				fileNum:0,
				fileFlag:false,

				overLimit: false, 		// 存储空间弹框
			}
		},
		computed: {
			role() {
				return getCurRole();
			}
		},
		props:["dialogEditMutual","taskName","courseId", "defaultFlag", "activityId"],
		created() {
			// console.log('activityId----', this.activityId);
			if(this.activityId) {
				this.getWorkDetail();
			}

		},

		methods: {
			open() {

				//传入目前编辑当前数目
				this.fileFlag = false;

				this.getWorkDetail();
				this.loading = false;
			},

			resetAttach(){
				this.fileLists = [];
				this.fileNum = 0;
				this.fileDelIds = [];
				this.$refs.openUploads.resetVal();
			},

			delIdsAttach(ids){
				this.fileDelIds = ids;
			},

			fileListAll(val){
				this.fileLists = val;
			},
			close() {
				this.$emit('update:dialogEditMutual', false);
				this.resetForm('ruleForm');

				//上传附件清空
				this.resetAttach();

				// this.imageUrl = [];
				// document.getElementById("fileName2").value = "";
			},
			selectDataMthod(data){
		        this.selectData = data;
		        // 所选学员id 数组 已选过学员，从新选择
		        this.sel = [];
				this.selectData.forEach((item,index) => {
		          	this.sel.push(item["id"]);
		        });
		    },
		    // 获取课程详情
		    getWorkDetail() {
		    	let data = {
		    		activityId: this.activityId
		    	}
                // 获取作业数据
		    	work.getWorkDetail(data, (res => {
		    		console.log("getWorkDetail",res);
		    		if(res.status == 200) {
                       //document.getElementsByClassName("uploadname")[0].style.zIndex=0;
		    			this.ruleForm.title = res.data.title;
		    			this.ruleForm.content = res.data.content;

		    			this.courseName = res.data.courseName;

		    			let beginTime = res.data.beginTime ? strFormatDate(res.data.beginTime) : "",
		    				endTime = res.data.endTime ? strFormatDate(res.data.endTime) : "";
		    			this.ruleForm.beginTime = beginTime;
		    			this.ruleForm.endTime = endTime;
		    			this.ruleForm.openmode = res.data.openMode;		// 开放方式
                        this.ruleForm.course = res.data.courseId;
                        this.specifyStudent = res.data.specifyStudent;
                        this.ruleForm.reviewHomeWorkCount= res.data.reviewHomeWorkCount   //评阅人数
                        this.ruleForm.reviewHomeWorkEndTime=  res.data.reviewHomeWorkEndTime      //评阅截至时期

		    			this.expertsId = res.data.userId || "";
		    			this.photoUrl = res.data.pictureList || "";
		    			// 设置参与人
		    			this.selectData = [];  // 初始化数组
		    			this.sel = [];	// 初始化数组
		    			if(this.specifyStudent == true) {
		    				this.ruleForm.members = "sel";
		    				// 设置参与人列表
		    				res.data.userList.forEach((item,index,arr) => {
		    					this.selectData.push({id:item.id, name: item.name});
		    				});

		    				// 所选学员id 数组
							this.selectData.forEach((item,index) => {
					          	this.sel.push(item["id"]);
					        });
		    				// console.log("sel 参与人",this.sel);
		    			} else {
		    				this.ruleForm.members = "all";
		    			}
						// 获取服务器返回的照片数据
						// console.log(res.data.pictureList,"1")
						if(res.data.pictureList!=undefined && res.data.pictureList.length!=0){
							this.num=res.data.pictureList.length;
						}
						


						//编辑页面-附件展示页面
						if(res.data.publishhomeworkAttachmentList.length > 0){
							// this.fileList = 
							this.fileLists = res.data.publishhomeworkAttachmentList;
							this.fileNum = res.data.publishhomeworkAttachmentList.length;
							this.fileFlag = true;
						}
		    		} else {
		    			this.$message.error(res.message);
		    		}
		    	}));
		    },

		    // 获取课程下主讲人
		    getMainProfessor() {
		    	let data = {
		    		courseId: this.courseId
		    	}

		    	work.getMainProfessor(data, (res => {
		    		// console.log("getMainProfessor",res)
		    		if(res.status == 200) {
		    			this.expertsName = res.data.name;
		    			this.expertsId = res.data.id;
		    		} else {
		    			this.$message.error(res.message);
		    		}
		    	}));
		    },
		    selAvatar (event) {
		        if(this.num == 9){					
		          this.$message.error("最多只能添加9张图片");
				  return;				  
		        }
		        let _this = this;
		        let extend = event.target.value.substr(event.target.value.lastIndexOf(".") + 1).toLowerCase();
				if (extend == "jpg" || extend == "png" || extend == "gif" || extend == "jpeg") {
			        let objUrl = event.target.files[0];
			        //console.log("图片路径：",objUrl);
			        _this.ruleForm.photo.push(objUrl);
			        let windowURL = window.URL || window.webkitURL;
			        let imageUrl = windowURL.createObjectURL(objUrl);
					_this.imageUrl.push(imageUrl);
					 this.num++;
		        }
		       
                
		    },
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.editWork();
						
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
		        this.$refs[formName].resetFields();
		    },
			editWork() {
				let _this = this;
				// 是否制定参与人
				if(this.ruleForm.members == 'all') {
					this.specifyStudent = false;
				} else {
					this.specifyStudent = true;
				}
				// 所选学员id 数组
				this.selectData.forEach((item,index) => {
		          	this.ids.push(item["id"]);
		        });
				let beginTime = this.ruleForm.beginTime ? dateFormatStr(this.ruleForm.beginTime) : "";
                let	endTime = this.ruleForm.endTime ? dateFormatStr(this.ruleForm.endTime) : "";
                let	reviewHomeWorkEndTime = this.ruleForm.reviewHomeWorkEndTime ? dateFormatStr(this.ruleForm.reviewHomeWorkEndTime) : "";

                let  data = {
					title: this.ruleForm.title,
					content: this.ruleForm.content,
					activityId: this.activityId,
					courseId: this.courseId,
					beginTime: beginTime,
					endTime: endTime,
					specifyStudent: false,
					ids: this.ids,
					ids2: this.ids2,
					deleteAttachmentIds:this.fileDelIds,
                    openMode: "TIMING",
                    reviewHomeWorkCount: this.ruleForm.reviewHomeWorkCount,      //评阅人数
					reviewHomeWorkEndTime:reviewHomeWorkEndTime,        //评阅截至时期
					activityType: "REVIEWHOMEWORK",						//学员互评作业
					'errCallBack' : this.storeNotEnough,
				  }
                

				this.loading = true;

				work.editWork(data, (res => {
					if(res.status == 200) {
						// console.log(res)
						this.open2();
						this.close();
						this.$emit("updateList");							

						//页面置空			
						this.ids=[];
						this.ids2=[];

						//上传附件清空
						this.resetAttach();

						document.getElementById("fileName").value="";
						this.imageUrl = [];			

					} else {
						if(res.status == 423){
							this.overLimit = true;
						}else{
							this.$message.error(res.message);
						}
						this.loading = false;

						//上传附件清空
						this.resetAttach();
					}
				}), this.ruleForm.photo,this.fileLists)
			},

			membersChange() {
				if(this.ruleForm.members == "all"){
		          	this.specifyStudent = false;

		        }else{
		          	this.specifyStudent = true;
		        }
			},
			deletePic(index,event){
				this.num--;
				if(this.num == 0){
					this.num = 0;
				}
				this.imageUrl.splice(index,1);
				this.ruleForm.photo.splice(index,1);

				document.getElementById("fileName").value = "";


			},
			delPhoto(index, id) {
				this.num--;
				if(this.num == 0){
					this.num = 0;
				}
				this.photoUrl.splice(index,1);
				this.ids2.push(id);			// 要删除图片的id
				document.getElementById("fileName").value = "";
			},

			open2() {
				this.$message({
				message: '恭喜你，作业内容更新成功',
				type: 'success'
				});
			},

			// 存储空间不足
			storeNotEnough(error){
				console.log(error.response);
				this.loading = false;
				if(error.response.status == 423){
					this.overLimit = true;
				};
			},
		},
		components:{
	      	studentSelect,
			openUpload,
			overLimitPop,
	    }
	}
</script>
