<template>
	<div class="w-view">
		<section class="handle clearfix">
			
			<Goback passtitle="模板预览" ></Goback>
		</section>
		
		
		<section class="w-ques round-layout">
			<div class="title-line"><h2 class="title">{{det.title}}</h2></div>
			<p class="summary">问卷说明：{{det.summary ? det.summary : '暂无'}}</p>
			<p class="summary" ><i class="icon-ques-num"></i>题目：共<span class="red">{{quesList.length}}</span>道题 <span class="orange">{{ det.realNameFlag ? '实名制问卷' : '匿名问卷'}}</span></p> 
			
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

		</section>
	</div>
</template>
<script>
	import Questemp from 'model/questemp/questemp'
	import Goback from 'base/goback/goback'

	export default {
		data() {
			return {
				det: {},	// 详情
				quesList: [],	// 题数组
				selList:["A","B","C","D","E","F","G","H","I","J"],
			}
		},
		computed: {
			id() {
				return this.$route.query.id;
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

			}
		},
		components: {
			Goback
		}
	}
</script>
<style scoped lang="less">
@import "../../assets/less/icon.less";
@import "../../assets/less/btn-search.less";
@import "../../assets/less/activity.less";
.handle {
	width: 1190px;
	margin: 15px auto;
}
.right {
	font-size: 18px;
	color: #FD7E23;
}
.orange {
	color: #FD7E23;
	margin-left: 10px;
}
.w-ques {
	width: 1190px;
	box-sizing: border-box;
	margin: 0 auto;
	padding: 20px 30px 30px;
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
	.x-ques {
		border-top: 1px solid  #E3E3E3;
		margin-top: 25px;
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
}
</style>