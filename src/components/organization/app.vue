<template>
	<div>
		<section class="handle clearfix">
            <Goback passtitle="APP启动屏" ></Goback>
        </section>
        <div id="wapp" class="wrapper">
			<form action="">
			<dl class="clearfix">
				<dt class="subtitle">是否开启APP启动屏:</dt>
				<dd class="explain">
					<el-switch
					  v-model="open"
					  active-text=""
					  inactive-text=""
					  @change="saveBootDiagram">
					</el-switch>

					开关
					<span class="remark">（APP启动屏开启后，学员在登录师训宝APP时，能看到上传的启动图。关闭后则无法看到）</span>
				</dd>
			</dl>
			<dl class="clearfix">
				<dt class="subtitle">APP启动屏:</dt>
				<dd class="pic-box">
					<img v-if="imageUrl" class="pic" :src="imageUrl" alt="">
					<div v-else class="upload-card">
						<i class="el-icon-plus"></i>
					</div>
					<!-- <label v-else class="" for="appFile">
						<i class="el-icon-plus"></i>

						<input type="file" name="file" id="appFile" class="upload" accept="image/png,image/jpeg" @change="showAppPic($event)">
					</label> -->
				</dd>
				<dd>
					<label class="btn-green-line" for="appFile">
						添加
						<input type="file" name="file" id="appFile" class="upload" accept="image/png,image/jpeg" @change="showAppPic($event)">
					</label>
					<!-- <button class="btn-green-line" type="button">添加</button> -->
					<p class="remark">图片保存尺寸为720*1280<br/>支持格式为jpg, png</p>
					<button type="button" class="btn-green" @click="uploadPic">
					<i class="icon-issue-white"></i>
					上传图片
					</button>
				</dd>
			</dl>
			</form>
		</div>
	</div>
	
</template>
<script>
	import model from 'model/organization/app'
	import { getCurRole } from '@/filters/userVerify'
	import { mapGetters, mapActions } from 'vuex'
	import Goback from 'base/goback/goback'

	export default {

		computed:{
      		...mapGetters(['showOrgObj'])
    	},

    	watch:{

	      showOrgObj(cur,old){

	         this.organizationId = cur.identification;

	         if(cur.role == 'ORGADMIN') {
		        this.getBootDiagram(this.organizationId);
		     }
	      },

	    },

		data () {
			return {
				role: getCurRole(),
				open: false,
				imageUrl: "",
				file: "",
				organizationId: "",

			}
		},
		created () {

		    this.organizationId = this.$route.query.orgId;

		    // 执行app启动屏
		    if(this.role == 'ADMIN' || this.role == 'ORGADMIN') {
		      	this.getBootDiagram();
		    }
		},
		methods:{

			getBootDiagram (orgId) {
		        if(!!this.organizationId) {

		          if(!!orgId){
		            var data = {
		              id: orgId
		            }
		          }else{
		            var data = {
		              id: this.organizationId
		            }
		          }

		          model.getBootDiagram(data, (res => {
		            if (res.status == 200) {
		              this.open = res.data.open;
		              this.imageUrl = res.data.imageUrl;
		            } else {
		              this.$message.error(res.message);
		            }
		          }));
		        }
			},
			showAppPic(event) {
				let _this = this;
				let extend= event.target.value.substr(event.target.value.lastIndexOf(".") + 1).toLowerCase();
				if (extend == "jpg" || extend == "png" || extend == "jpeg") {
		          	_this.file = event.target.files[0];
		          	let objUrl = event.target.files[0];
		          	let windowURL = window.URL || window.webkitURL;
		          	let imageUrl = windowURL.createObjectURL(objUrl);
		          	_this.imageUrl = imageUrl

		        }
			},
			// 上传图片
			uploadPic () {
				if(!!this.file) {
					let data = {
						file: this.file,
						organizationId: this.organizationId,
						open: this.open
					}


					model.uploadPic (data, ( res => {
						// console.log("uploadPic" ,res);
						if( res.status == 200) {
							this.$message({
						          message: '上传成功！',
						          type: 'success'
						    });
							this.imageUrl = res.data.imageUrl;

						} else {
							this.$message.error(res.message);
						}
					}));
				} else {
					this.$message.error("请先添加图片！");
				}
			},
			// APP 启动屏开关
			saveBootDiagram() {
				let data = {
					open: this.open,
					organizationId: this.organizationId,

				}
				// console.log("data" ,data);
				model.saveBootDiagram(data, ( res => {

					if (res.status == 200) {
						// console.log("open", this.res);
						// this.$message.success('发布成功！');
					} else {
						this.$message.error(res.message);
					}
				}));
			}


		},

		components: {
            Goback
        }
	}
</script>
<style scoped lang="less">
	@import "../../assets/less/btn-search.less";
	@import "../../assets/less/icon.less";

	#wapp {
		background-color: #fff;
	    border: 1px solid #f0f0f0;
	    border-radius: 6px;
	    box-shadow: 0 0 2px 3px #f0f0f0;
	    padding: 55px 28px;
		dl {
			margin-bottom: 40px;
		}
		dt {
			float: left;
			width: 160px;
			text-align: right;
			margin-right: 24px;
		}
		dd {
			float: left;
		}
	    .subtitle {

	    	font-size: 16px;
	    }
	    .explain {
	    	font-size: 18px;
	    }
	    .remark {
	    	font-size: 16px;
	    	color: #999;
	    	line-height: 1.6em;
	    }
		.pic-box {
			font-size: 16px;
			color: #999;
		}

		.pic {
			display: inline-block;
			width: 230px;
			height: 330px;
			box-sizing: border-box;
			border-radius: 6px;
			vertical-align: top;
			margin-right: 30px;


		}
		.upload-card {
			display: inline-block;
			width: 230px;
			height: 330px;
			background-color: #fbfbff;
			border: 2px dashed #c0ccda;
			border-radius: 6px;
			box-sizing: border-box;

			vertical-align: top;
			text-align: center;
			margin-right: 30px;

			.el-icon-plus {
				margin-top: 140px;
				margin-bottom: 10px;
				font-size: 30px;
				color: #8c939d;
			}

		}
		.upload {
			opacity: 0;
		}
		.btn-green-line {
			width: 92px;
		    padding: 0;
		    height: 32px;
		    line-height: 30px;
		    text-align: center;
			margin-bottom: 30px;
		}
		.btn-green {
			margin-top: 174px;
			&::after{
				width: 0;
				height: 0;
			}
		}
		.icon-issue-white {
			vertical-align: -1px;
		}
	}
</style>
