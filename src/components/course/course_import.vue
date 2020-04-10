<template>
	<div class="course-import">
		<el-dialog class="dialog-form dialog-temp" title="导入课程"
               :visible.sync = "dialogImportCourse"
               :close-on-click-modal="false"
               :before-close="close">
	      	<!--content_start-->
	      	<div class="import-course import-temp" id="el-upload" v-loading="loading"  element-loading-text="拼命加载中">
		        <p>
		        	<span class="">导入课程前请下载模板，按模板导入</span>
		        	<span class=""><a :href="templateExcel" class="link">模板下载</a></span>
		        </p>
		        <div class="upload clearfix">
		          	<span class=" choose-file">文件选择</span>
		          	<input type="file" @change="getFile($event)" id="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" slot="trigger" size="small" class="sel1" >
		          	<label for="file" class="sel2 link">选择文件</label>
		          	<span class="" style="margin-left: 130px;"
		                id="fileText"
		                :alt="fileTextContent"
		                :title="fileTextContent">
		          	</span>
		        </div>
				
				<!-- <div class="require" id="errorMsg"></div> -->
		        <div class="btn-upload">
		           <button @click="submitUpload" class="btn-green-upload">立即上传</button>
		        </div>

		        <!-- 提示 -->
	        	<dl class="note">
	        		<dt>重要提示</dt>
	        		<dd>1. 课程批量导入前请确保专家都已创建成功</dd>
	        		<dd>2. 仅支持单日课程批量导入</dd>
	        	</dl>

	        </div>
	        <!--content_end-->

	        <div slot="footer" class="dialog-footer">
	        	<!-- <button @click="submitUpload" class="btn-green-square">确定</button> -->
	        	<el-button @click="close">关闭</el-button>
	        </div>
	    </el-dialog>
	</div>
</template>
<script>
	import API from '@/global/resource';
	import { getToken } from '@/filters/userVerify';
	import model from 'model/course/course'

	export default {
		data() {
			return {
				loading: false,
				templateExcel: API.urls.courseExportTemplate,
				fileTextContent: '',	// 文件名称
				file: '',	// 文件

			}
		},
		props: ['dialogImportCourse', 'clazzId'],
		methods: {
			getFile(event) {
				console.log("event", event);
				this.file = event.target.files[0];
				this.fileTextContent = event.target.value.substr(event.target.value.lastIndexOf("\\") + 1).toLowerCase();
				$("#fileText").addClass("name");
				$("#fileText").text(this.fileTextContent);
				//判断上传格式
		        let extend = event.target.value.substr(event.target.value.lastIndexOf(".") + 1).toLowerCase();
		        if(extend == "xlsx" || extend == "xls"){
		          //不需要执行
		        }else{
		          	this.$message.error("导入数据文件只能是excel");
		          	$("#fileText").text("");
		          	$("#file").val("");
		          	$("#fileText").removeClass("name");
		          	return;
		        }
			},
			close() {
				this.$emit('update:dialogImportCourse', false);
				$("#fileText").text("");
	          	$("#file").val("");
	          	$("#fileText").removeClass("name");
	          	this.file = "";
	          	this.fileTextContent = "";
			},
			submitUpload() {
				const fileVal = $("#file").val();
				if(fileVal == "") {
					this.$message.error("请选择上传文件");
					return;
				}
				this.loading = true;
				let data = {
					file: this.file,
					clazzId: this.clazzId
				}
				console.log("data===", data)
				model.courseImport(data, (res => {
					console.log("上传文件返回", res);
					if(res.status == 200) {
						this.loading = false;
						this.close();
						// 更新专家列表
						this.$emit("updateList")

						let succ = res.data.success;
						let exportFlag = res.data.exportFlag;
						if(exportFlag) {
							// 有导入失败的条数
							let fail = res.data.fail;
							let link = res.data.url;
							this.succPop(succ, fail, link)
						} else {
							// 全部导入成功
							this.succPop(succ)
						}
						
						
					} else {
						this.$message.error(res.message);
						this.loading = false;
					}
				}))
			},

			succPop(succ, fail, link) {
				// 有失败条数 warning 无失败条数 success
				let type="", str="", buttonText="";
				if(fail) {
					type = 'warning';
					str = succ + '条数据导入成功，'+fail+'条失败，请下载失败文件';
					buttonText = '下载失败文件'
				} else {
					type = 'success';
					str = succ + '条数据导入成功';
					buttonText = '确定'
				}
				this.$alert(str, '提示', {
					confirmButtonText: buttonText,
					type: type,
					callback: action => {
						if(link) {
							this.exportProfessorFail(link);
						}
						console.log("下载模板");
					}
				});
			},
			exportProfessorFail(link) {
				
				window.open(API.urls.courseImportFail+"?excelUrl="+link+"&token="+getToken());
			}

		}

	}
</script>
<style scoped lang="less">
	@import "../../assets/reset-element-ui/user-table.css";
	@import "../../assets/css/import_temp.css";
	.import-course{
	    
		.note {
			border-top: 1px solid #ededed;
			margin-top: 50px;
    		padding-top: 23px;
			dt {
				font-size: 16px;
				color: #e93639;
				margin-bottom: 8px;
			}
			dd {
				font-size: 16px;
				color: #666;
				line-height: 1.6em;
			}
		}
		
	}
	

</style>