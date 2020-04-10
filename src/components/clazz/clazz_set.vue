<style scoped lang="less">
	@import "../../assets/less/icon.less";
	#wclazzSet {
		.bread-box {
			position: relative;
			.btn-green,
			.btn-blue {
				display: inline-block;
				position: absolute;
				top:0;
				padding: 10px 30px;
				font-size: 15px;

				i {
					vertical-align: -2px;
				}
			}
			.wissue {
				right: 0;
			}
			
		}
		.wclazz-set {
			padding: 90px 0;
			.switch {
				float: left;
				width: 410px;
				height: 359px;
				line-height: 20px;
				text-align: center;
				font-size: 18px;
				padding-top: 170px;
				
				border-right: 1px solid #f2f2f2;
				.text {
					font-size: 18px;
					margin-left: 12px;
				}
			}
			.desc {
				float: left;
    			padding-left: 100px;
			}
			.notice {
				font-size: 15px;
				line-height: 2em;
				color: #666;
				margin-bottom: 15px;
			}
			.eg {
				font-size: 16px;

				li {
					float: left;
					margin-right: 90px;
					position: relative;

					&:first-child:after {
						position: absolute;
						margin-left: 18px;
						top: 50%;

						content: "";
						width: 57px;
						height: 20px;
						background: url("../../assets/img/icon/icon-ora-arrow.png") center center no-repeat;

					}
				}
				img {
					margin-top: 10px;
				}
			}
		}
	}
</style>
<template>
	<div id="wclazzSet">
		<div class="bread-box">
			<bread-crumb	
			:clazzId="clazzId"
			:crumbClazzSet = '1'
			></bread-crumb>

			<button type="button" class="btn-green wissue" @click="handleOn">
				<i class="icon-save"></i>
				保存
			</button>
		</div>

		<div class="wclazz-set round-layout clearfix">
			<p class="switch">	
				远程跟进开关：
				<el-switch
					v-model="remoteStudyStatus"
					active-text=""
					inactive-text="">
				</el-switch>
			</p>
			
			<div class="desc">
				<p class="notice">
					注意：远程跟进开关开启后，师训宝学员端APP—资源页面会出现“去远程学习”按钮，如下图<br/>
					学员点击“去远程学习”能够直接跳转到同学APP学习。
				</p>

				<ul class="eg clearfix">
					<li>
						<h3><i class="icon-ora1"></i>  开启前:</h3>
						<img src="../../assets/img/clazz/clazz-set1.png" alt="">
					</li>
					<li>
						<h3><i class="icon-ora2"></i>  开启后:</h3>
						<img src="../../assets/img/clazz/clazz-set2.png" alt="">
					</li>
				</ul>
			</div>
			
		</div>
	</div>
</template>

<script>
	import clazz from 'model/clazz/clazz'
	import breadCrumb from 'components/clazz/breadcrumb'
	

	export default {
		data () {
			return {
				remoteStudyStatus: false,	// 远程学习开关状态
			}
		},
		computed: {
			clazzId() {
				return this.$route.query.clazzId;
			}
		},
		created() {
			this.getClazz();
		},
		methods: {
			// 班级详情
			getClazz() {
				let data = {
					id: this.clazzId
				}

				clazz.getClassInfor(data, (res => {
					// console.log("班级信息",res);
					if(res.status == 200) {
						this.remoteStudyStatus = res.data.remoteStudyStatus;
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			handleOn() {
				let _this = this;
				this.$confirm('远程跟进设置保存成功','提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					_this.clazzRemoteSave();
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消保存',
						duration: 1000,
						onClose() {
							_this.cancelFn();
						}
					})
				});

			},
			cancelFn() {
				this.remoteStudyStatus = !this.remoteStudyStatus;
			},
			clazzRemoteSave() {
				let data = {
					clazzId: this.clazzId,
					remoteStudyStatus: this.remoteStudyStatus || false
				}

				clazz.clazzRemoteStatus(data, (res => {
					// console.log("班级设置",res);
					if(res.status == 200) {
						
					} else {
						this.$message.error(res.message);
					}
				}));
			}
		},
		components: {
			
			breadCrumb
		}
	}
</script>

