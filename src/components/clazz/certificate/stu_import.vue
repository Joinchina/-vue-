<template>
	<div class="">
		<el-dialog class="dialog-form dialog-temp" title="导入学员信息"
               :visible.sync = "dialogImportStu"
               :close-on-click-modal="false"
               :before-close="close">
	      	<!--content_start-->
	      	<div class="import-stu import-temp" id="el-upload" v-loading="loading"  element-loading-text="拼命加载中">
		        <p>
		        	<span class="">导入用户前请下载用户信息模板，按模板导入</span>
		        	<span class="" ><a href="javascript:;"  class="link" @click="downloadTemp()">下载导入模版.Excel</a></span>
		        	<span class="pad16"><a target="_blank" :href="templateEg" :download="templateEg"  class="link">下载证书样例</a></span>
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
				
				<div class="btn-upload">
		           <button @click="submitUpload" class="btn-green-upload">立即上传</button>
		        </div>

	        </div>
	        <!--content_end-->

	        <div slot="footer" class="dialog-footer">
	        	<el-button @click="close">关闭</el-button>
	        	<!-- <button @click="submitUpload" class="btn-green-square">确定</button> -->
	        </div>
	    </el-dialog>

	    <!-- 导入结果 -->
	    <import-res
	    	:dialogImportRes.sync = "resFlag"
	    	:res="importRes">
	    </import-res>
	</div>
</template>
<script>
	import cert from 'model/clazz/certificate'
	import API from '@/global/resource'
	import { getToken } from '@/filters/userVerify'
	import importRes from 'components/clazz/certificate/import_res'

	export default {
		data() {
			return {
				loading: false,
				fileTextContent: '',	// 文件名称
				file: '',	// 文件
				templateEg: API.urls.certTempSample,		//下载导入模板Excel
				certSample: '',				// 证书样例路径
				importRes: '',		//导入结果
				resFlag: false,		// 导入结果弹出框

			}
		},
		props: ['dialogImportStu', 'clazzId'],
		methods: {
			// 下载导入模板
			downloadTemp() {
				window.open(API.urls.clazzCertDownTemp+"?clazzId="+this.clazzId+"&token="+getToken());
			},
			getFile(event) {
				// console.log("event", event);
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
				this.$emit('update:dialogImportStu', false);
				$("#fileText").text("");
	          	$("#file").val("");
	          	$("#fileText").removeClass("name");
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
				cert.clazzCertImportUser(data, (res => {
					
					console.log("上传文件返回", res);
					if(res.status == 200) {
						this.loading = false;
						this.close();
						// 更新证书列表
						this.$emit("updateList")
						this.resFlag = true;
						this.importRes = res.data;
						
						
						
					} else {
						this.$message.error(res.message);
						this.loading = false;
					}
				}))
			},

		},
		components: {
			importRes
		}
	}


</script>
<style scoped lang="less">
	@import "../../../assets/reset-element-ui/form.css";
	@import "../../../assets/css/import_temp.css";
	
</style>