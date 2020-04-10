<template>
	<div>
		<div class="title-line"><h2 class="title">{{det.title}}</h2></div>
		<p class="summary">问卷说明：{{det.summary ? det.summary : '暂无'}}</p>
		<p class="summary" ><i class="icon-ques-num"></i>题目：共<span class="red">{{quesList.length}}</span>道题  <span class="orange">{{ det.realNameFlag ? '实名制问卷' : '匿名问卷'}}</span></p>
		
		<div class="x-ques">
			<template v-for="(item, index) in quesList">

			<dl v-if="item.type == 'SELECT'">
				<dt>
					<h2>
						<span class="q">Q{{index+1}}.</span>
						{{item.question}}
						<span class="type">(单选题) ({{item.required ? '必答' : '选答'}})</span>
					</h2>
				</dt>
				<dd v-for="(sel, index) in item.selections">
					<i class="icon-radio"></i>
					<label for="">{{selList[index]}} {{sel}}</label>
				</dd>
				
			</dl>

			<dl  v-else-if="item.type == 'MUILTSELECT'">
				<dt>
					<h2>
						<span class="q" >Q{{index+1}}.</span>
						{{item.question}}
						<span class="type">(多选题) （{{item.required ? '必答' : '选答'}}）</span>
					</h2>
				</dt>
				<dd v-for="(sel, index) in item.selections">
					<i class="icon-checkbox"></i>
					<label for="" >{{selList[index]}}  {{sel}}</label>
				</dd>
				
			</dl>

			<dl v-else-if="item.type == 'SUBJECTIVE'">
				<dt>
					<h2>
						<span class="q">Q{{index+1}}.</span>
						{{item.question}}
						<span class="type">(问答题) （{{item.required ? '必答' : '选答'}}）</span>
					</h2>
				</dt>
				<dd>
					<textarea readonly="readonly" class="text" name="" id="" ></textarea>
				</dd>
				
			</dl>
			</template>
		</div>

		<p class="fixed">
			<button type="button" @click="goQues" class="btn-green">使用此模板创建问卷</button>
		</p>
	</div>
</template>
<script>
import Questemp from 'model/questemp/questemp';

export default {
	data() {
		return {
			det: {},	// 详情
			quesList: [],	// 题数组
			selList:["A","B","C","D","E","F","G","H","I","J"],
		}
	},
	computed: {
		orgId() {
			return this.$route.query.orgId
		},
		clazzId() {
			return this.$route.query.clazzId
		},
		courseId() {
			return this.$route.query.courseId
		},
		id() {
			return this.$route.query.id;
		},
		type() {
			return this.$route.query.type;
		}
	},
	mounted() {
		this.getDetails();
	},
	methods: {
		getDetails() {
			let data = {
				id: this.id
			}
			Questemp.getFindOne(data, (res => {
				console.log("view", res);
				if(res.status == 200) {
					this.det = res.data;
					this.quesList = res.data.questions;
				} else {
					this.$message.error(res.message);
				}
			}));

		},
		goQues() {
			// 添加使用次数
			let data = {
				id: this.id
			}
			Questemp.postUsedTimes(data, (res => {
				console.log("使用次数", res);
				if(res.status == 200) {
					// console.log("使用次数", res);
				} else {
					this.$message.error(res.message);
				}
			}));

			if(this.courseId) {
				this.$router.push({
					path:"/activity/questionare/edit",
					query: {
						clazzId: this.clazzId,
						courseId: this.courseId,
						paperId: this.id,
						type: this.type,
						template:"template"
					}
				})
			} else {
				this.$router.push({
					path:"/activity/questionare/edit",
					query: {
						clazzId: this.clazzId,
						paperId: this.id,
						type: this.type,
						template:"template"
					}
				})
			}
			
		}
	},
	watch: {
		'$route': 'getDetails'
	}
}
</script>
<style lang="less" scoped>
.w-cont {
	.title-line {
		padding-bottom: 15px;
		box-shadow: 0 4px 7px 1px rgba(0,0,0,0.02);
		margin-bottom: 15px;
	}
	.title {
		font-size: 20px;
		color: #333333;
		line-height: 1.2em;
		border-left: 3px solid #35A69D;
		padding-left: 15px;
	}
	.summary {
		font-size: 16px;
		color: #8A8A8A;line-height: 1.5em;
		margin-bottom: 5px;
	}
	.red {
		color: #00002E;
	}
	.orange {
		color: #FD7E23;
		margin-left: 10px;
	}
	.x-ques {
		border-top: 1px solid  #E3E3E3;
		margin-top: 25px;
		margin-bottom: 10px
	}
	.icon-radio {
		display: inline-block;
	  	width: 21px;
	  	height: 22px;
	  	background: url("../../assets/img/activity/icon-radio.png") 0 0 no-repeat;
	}
	.icon-checkbox {
		display: inline-block;
	  	width: 19px;
	  	height: 19px;
	  	background: url("../../assets/img/activity/icon-checkbox.png") 0 0 no-repeat;
	}
	.text {
		width: 80%;
		height: 150px;
		border: 1px solid #e3e3e3;
		background-color: #fdfdfd;
		outline:none;
		line-height: 1.8em;
		padding: 5px 8px;
	}

	.fixed {
		position: fixed;
		bottom: 0;
		text-align: center;
		padding: 22px 0;
	    background: #fff;
	    height: 80px;
	    width: 850px;

		.btn-green {
			display: inline-block;
			font-size: 16px;
			padding: 10px 22px;
			&::after{
				display: none;
			}
		}
	}
}

.x-ques {
	label {
	  	font-weight: normal;
	}
	 dl {
	  	padding: 22px 0 10px;
	  	margin: 0;
	}
	h2 {
	  	font-size: 18px;
	  	font-weight: normal;
	 	margin: 0;
	}
	.q {
	  	font-size: 20px;
	  	color: #ff8521;
	  	margin-right: 10px;
	}
	dt {
	  	padding-bottom: 20px;
	}
	dd {
	  	font-size: 16px;
	  	line-height: 2em;
	  	margin-left: 42px;
	  	margin-bottom: 20px;
	  	.icon-checkbox,
	  	.icon-radio {
	  		margin-right: 10px;
  			vertical-align: middle;
	  	}
	}
	.text {
	  	width: 100%;
	  	height: 150px;
	  	border: 1px solid #e3e3e3;
	  	background-color: #fdfdfd;
	  	outline:none;
	  	line-height: 1.8em;
	  	padding: 5px 8px;
	}
	.res-opt {
	  	padding-bottom: 20px;
	}
	.tit-opt {
	  	line-height: 1.5em;
	  	margin:0 0 10px 0;
	}
	.textbox {
	  	width: 96%;
	  	height: 200px;
	  	overflow-y: auto;
	  	font-size: 16px;
	  	line-height: 1.5em;
	  	border: 1px solid #e3e3e3;
	  	background-color: #fdfdfd;
	  	padding: 18px 25px;
	}
}


</style>