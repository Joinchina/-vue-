<template>
	<div class="">
		<section class="handle clearfix">
			
			<Goback passtitle="系统维护通知" ></Goback>
		</section>

		<section class="w-system round-layout clearfix">
			<div class="left">
				<h2 class="title">系统维护通知</h2>
				<div class="notify" v-if="!curr">
					<el-form :model="textForm" ref="textForm">
						<el-form-item 
							prop="content"
							:rules="[
								{ required: true, message: '内容不能为空', trigger: 'blur'},
								{ max: 100, message: '100字以内',trigger: 'blur'}
							]">
							<el-input type="textarea" :rows="8" class="content" v-model.trim="textForm.content" auto-complete="off" placeholder="请填写维护通知内容（100字以内）..."></el-input>
						</el-form-item>

						<el-form-item>
							<el-button type="primary" @click="submitForm('textForm')">开启通知</el-button>
						</el-form-item>
					</el-form>
				</div>

				<div class="notify" v-if="curr">
					<div class="ing clearfix">
						<img class="wheel" src="../../../assets/img/comtopic/wheel.png" alt="">
						<img class="line" src="../../../assets/img/comtopic/line.png" alt="">
						<div class="remarks ">
							<h4>系统正在维护中</h4>
							<p>{{curr.content}}</p>
						</div>
					</div>
					<button type="button" class="btn-green" @click="close">关闭通知</button>
				</div>
				
				<!-- 维护历史 -->
				<h3 class="sub-title">维护历史：</h3>
				<ul class="past-records">
					<li v-for="item in items">
						<span class="time">{{item.createDate}}</span>
						<p class="cont">
							{{item.content}}
						</p>
					</li>
					
				</ul>
			</div>
			<div class="right">
				<h3 class="sub-title">操作说明：</h3>
				<img class="app" src="../../../assets/img/comtopic/app.png" alt="">
				<p class="explain">开启系统维护通知后，将在师训宝App管理端、学员端首页上方，循环播放文字通知。关闭后，此条消失。</p>
			</div>
		</section>
	</div>
</template>
<script>
	import System from "model/comtpoc/system"
	import Goback from 'base/goback/goback'
	export default {
		data() {
			return {
				curr: {},	//当前维护信息
				items: [],	// 历史维护信息
				textForm: {
					content: ""
				},
				id: "",		// 当前维护中 id
			}
		},
		mounted() {
			this.getDet();
		},
		methods: {
			getDet() {
				System.getSystem({}, (res => {
					console.log("系统维护 ", res)
					if(res.status == 200) {
						this.items = res.data.history;
						this.curr = res.data.ongoing || undefined;
						if(this.curr) {
							this.id = res.data.ongoing.id;
						}
						
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(!!valid) {
						console.log("valid", valid);
						this.postSystemPub();
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			postSystemPub() {
				let data = {
					content: this.textForm.content
				}

				System.postSystemPub(data, (res => {
					console.log("发布 ", res)
					if(res.status == 200) {
						this.getDet();
						this.textForm.content="";
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			close() {
				this.$confirm('要关闭系统维护通知吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.postSystemShut();
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消关闭！'
					});
				});
			},
			postSystemShut() {
				let data = {
					id: this.id
				}

				System.postSystemShut(data, (res => {
					console.log("关闭 ", res)
					if(res.status == 200) {
						this.$message.success('关闭成功！');
						this.getDet();
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
@import "../../../assets/less/btn-search.less";
.handle {
	margin-bottom: 15px;
}
.w-system {
	padding: 50px;
	box-sizing: border-box;
	.left,
	.right {
		width: 50%;
		float: left;
	}
	.title {
		font-size: 24px;
		color: #333333;
		letter-spacing: 0;
		line-height: 24px;
		margin-bottom: 24px;
	}
	.notify {
		width: 470px;
		text-align: center;
		margin-top: 20px;
		margin-bottom: 40px;
		.btn-green {
			font-size: 16px;
			padding: 10px 28px;
			line-height: 1em;
			margin: 20px auto;
		}
	}
	.content {
		width: 100%;
		height: 182px;
	}
	.sub-title {
		font-size: 16px;
		color: #333333;
		letter-spacing: 0;
		line-height: 16px;
		margin-bottom: 20px;
	}
	.ing {
		background: #FFFFFF;
		box-shadow: 1px 2px 12px 0 rgba(0,0,0,0.08);
		border-radius: 6px;
		border: 1px solid #E4E4E4;
		height: 182px;
		padding-top: 18px;

		img,
		.remarks {
			display: inline-block;

		}
		.wheel {
			margin-right: 20px;
		}
		.line {
			margin-right: 30px;
		}
		.remarks {
			width: 240px;
			vertical-align: middle;
			>h4 {
				font-size: 18px;
				color: #AB2424;
				margin-bottom: 15px;
			}
			>p {
				font-size: 14px;
				color: #666666;
				letter-spacing: 0;
				line-height: 20px;
			}
		}
	}
	.app {
		display:inline-block;
	}
	.explain {
		display: inline-block;
		width: 240px;
		vertical-align: top;
		margin-left: 30px;
		margin-top: 5px;
		font-size: 14px;
		line-height: 23px;
		color: #666;
	}

	.past-records {
		font-size: 14px;
		color: #666666;
		letter-spacing: 0;
		line-height: 18px;

		li {
			position: relative;

			&:before {
				position: absolute;
				top: 4px;
    			left: 150px;
				content: "";
				display:block;
				width: 0px;
				height: 100%;
				border-left: 1px solid #E4E4E4;
			}

			&:last-child {
				&:before {
					height: 0;
				}
			}

			&:after {
				position: absolute;
				top: 4px;
    			left: 148px;
				content: "";
				width: 5px;
				height: 5px;
				border-radius: 5px;
				background: #E4E4E4;
			}
			
			.time {
				display: inline-block;
				width: 134px;
				margin-right: 30px;
			}
			.cont {	
				display: inline-block;
				width: 300px;
				vertical-align: text-top;
				margin-bottom: 35px;
			}
		}
	}
}

</style>