<template>
	<div>
		<el-form-item label="添加作业附件：" :label-width="labelWidth"  prop="photo" class="avatar-uploader">
				<label for="fileName" class="sel3"><span class="icon-dis-add"></span>上传附件</label>
				<input 
					class="sel1 select-file" 
					multiple="true" 
					id="fileupload" 
					type="file" 
					name="ruleForm.photo" 
					accept="application/msword,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation"  
				@change="addFile($event)">	
				<span class="word">注意：只能上传PPT和word，且大小在5M以内</span>
				<div class="list">
					<ul>
						<li v-for="(item,index) in fileList">

							<img src="../../assets/img/icon/icon-ppt.png" alt="" v-if="item.type == 'PPT' || item.info == 'ppt'">
							<img src="../../assets/img/icon/icon-word2.png" alt="" v-else>

							<span :alt="item.name" :title="item.name">
								{{item.name}}
							</span>

							<span class="zm" v-if = "item.transStatus == 'INPROCESS'">转码中...</span>
                    		<span class="zm" v-if = "item.transStatus == 'FAILURE'">转码失败</span>

							<span class="error red" @click="delFile(index,item)"></span>
						</li>
					</ul>
				</div>
		</el-form-item>

	</div>
</template>
<script>
	export default{
		props:{
			fileLists:{
				type:Array,
				default:[]
			},
			fileNum:{
				type:Number,
				default:0
			},
			fileFlag:{
				type:Boolean,
				default:false
			},
			status:{
				type:String,
				default:""
			},
			labelWidth:{
				type:String,
				default:"130px"
			}
		},
		data(){
			return{
				// labelWidth:"130px",
				delIds:[],
				fileList:[],
				num:0
			}
		},
		watch:{
			fileLists:{
				handler(newVal,oldVal){
					console.log("files list ===", newVal);
					this.fileList = newVal;

					this.$emit("fileList",this.fileList)
				},
				deep:true
			},

			fileFlag(newVal){
				if(newVal){
					this.num = this.fileNum;
				}
			}
		},
		methods:{
			resetVal(){
				this.fileList = [];
				this.num = 0;
				this.delIds = [];
				document.getElementById("fileupload").value="";
			},
			addFile(event){
				let obj = {};
				let flag = false;
				let file =  event.target.files[0];
				let type = file.name.substring(file.name.lastIndexOf(".")+1,file.name.length);

				let maxSize = 1024 * 1024 * 5;
				let size = file.size;

				if(type == "doc" || type == "docx"){
					file.info = 'doc';
					flag = true;
				}else if(type == "ppt" || type == "pptx"){
					file.info = 'ppt';
					flag = true;
				}else{
					this.$message.error("请上传格式为word和ppt的文件");
					return;
				}

				//当前文件需小于5兆
				if(flag){
					if(size > maxSize){
						this.$message.error("您上传的文件过大，请重新上传");
						return;
					}
				}

				//最多只能添加5个附件
				if(this.num >= 5){
					this.$message.error("最多只能添加5个附件");
					return;
				}

				this.num++;

				this.fileList = this.fileLists;
				this.fileList.push(file);
				
			},

			delFile(index,item){

				//编辑状态作业删除附件
				if(item.id){
					this.delIds.push(item.id);
					this.$emit("delIdsAttach",this.delIds);
				}
				this.num--;

				//console.log('jian');
				//console.log(this.num);
				this.fileList = this.fileLists;
				this.fileList.splice(index,1);
				
				document.getElementById("fileupload").value=""	


			}
		}
	}
</script>
<style scoped lang="less">
  @import "../../assets/less/icon.less";
  .sel3,
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
  	top: 10px;
	left: 10px;
	cursor: pointer;
  }
  .list{
  	margin-top:10px;
  	margin-left:20px;
  	li{
  		list-style: none;
  		line-height: 30px;
  		padding: 5px 0;
  		width: 65%;
  		position: relative;
  		img{
  			vertical-align: top;
  		}
  		.zm {
		  color: #999;
		  padding-left: 15px;
		}
  		.error{
	  		display: inline-block;
	  		position: absolute;
	  		right: 10px;
	  		top: 12px;
	  		background: url('../../assets/img/icon/icon-del-circle.png') no-repeat;
	  		width: 24px;
	  		height: 24px;
	  		cursor: pointer;
	  	}
	  	.error:hover{
	  		background: url('../../assets/img/icon/icon-del-circle-blue.png') no-repeat;
	  		width: 24px;
	  		height: 24px;
  		}
  		span{
  			width: 80%;
  			display: inline-block;
  			white-space: nowrap;
  			overflow: hidden;
  			text-overflow: ellipsis;
  		}
  	}
  	
  }
  .word{	
		margin-left: 125px;
		font-size: 14px;
		color: #c0c4cc;
		padding-top: 7px;
		display: inline-block;
	}
  
</style>