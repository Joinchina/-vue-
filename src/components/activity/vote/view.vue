<style scoped lang="less">
	@import "../../../assets/less/activity.less";
	#wview {
		.btn {
			font-size: 16px;
		}
	}
	  .x-article{
       position: relative;

  }
	.realname{
	position: absolute;
	top:0px;
	right: 0;
	width:68px; 
	height: 58px; 
    background:url("../../../assets/img/activity/shibg.png");
	span{
	  color:#ffffff;
	  font-size:16px;
	  display: block;
	  float:right;
	  margin:4px 4px 0 0;
  }
  }
  .selectda{
	  color: #f00
  }
</style>
<template>
	<div id="wview">
		<!-- main -->
    	<main class="x-view" id="quesView">

			<nav class="subnav clearfix">
				<!-- <a class="back" href="javascript:history.back();"><i class="icon-back"></i>返回</a> -->
				<Goback :passtitle="title"  ></Goback>
	
				<!-- <span class="right">
					<a  class="" data-toggle="modal" data-target="#qrcode_dialog" href="javascript:;" ><i class="icon-qrcode"></i>查看{{typeName}}二维码</a>
				</span> -->
				<span class="right">
					<el-button @click="dialogQrcode = true">
						<i class="icon-qrcode"></i>
						查看{{typeName}}二维码
					</el-button>
				</span>
				
			</nav>
			
			<article class="x-article">
				<div class="realname" v-show="type=='QUESTIONNAIRE'">
					<span v-if="selectcolor==true">实名</span>
					<span v-else>匿名</span>
				</div>
				<div class="header">
					<h1>{{title}}</h1>
					<!-- 投票 -->
					<template v-if="type =='VOTE' ">
					<p class="summary" ><i class="icon-course"></i>所属课程：{{courseName}}</p>
					<p class="summary" ><i class="icon-ques-num"></i>题目：共{{quesNum}}道题</p>
					</template>
					<!-- 问卷 -->
					<template v-if="type == 'QUESTIONNAIRE'">
					<p class="summary" >问卷说明：{{description}}</p>
					<p class="summary" ><i class="icon-course"></i>所属课程：{{courseName}}</p>
					<p class="summary">
						<span class="mg-r30"><i class="icon-time"></i>截止时间：{{endTime ? endTime : '永久'}}</span>
						<span ><i class="icon-ques-num"></i>题目：共{{quesNum}}道题</span>
					</p>
					</template>
				</div>
				
				<section class="x-ques">
					<template v-for="(item, index) in quesList">	
					<dl v-if="item.type == 'SELECT'">
						<dt>
							<h2>
								<span class="q" >Q{{index+1}}.</span>{{item.question}}
								<span class="type" v-if="type == 'QUESTIONNAIRE' " >
								（单选题）（{{item.required ? '必答' : '选答'}}）
								</span>
								<span class="type" v-else="type == 'EVALUATION' " >
								（单选题）（{{item.required ? '必答' : '选答'}}）
								</span>
							</h2>
						</dt>
						<dd v-for="(sel, index) in item.selections">
							<i class="icon-radio"></i>
							<label for="" >{{selList[index]}} {{sel}}</label>
						</dd>
						
					</dl>

					<dl v-else-if="item.type == 'MUILTSELECT'">
						<dt>
							<h2>
								<span class="q" >Q{{index+1}}.</span>{{item.question}}
								<span class="type" v-if="type == 'QUESTIONNAIRE' " >
								（多选题）（{{item.required ? '必答' : '选答'}}）
								</span>
								<span class="type" v-else="type == 'EVALUATION' " >
								（多选题）（{{item.required ? '必答' : '选答'}}）
								</span>
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
								<span class="q" >Q{{index+1}}.</span>{{item.question}}
								<span class="type" v-if="type == 'QUESTIONNAIRE' " >
								（问答题）（{{item.required ? '必答' : '选答'}}）
								</span>
								<span class="type" v-if="type == 'EVALUATION' " >
								（问答题）（{{item.required ? '必答' : '选答'}}）
								</span>
							</h2>
						</dt>
						<dd>
							<textarea readonly="readonly" class="text" name="" id="" ></textarea>
						</dd>
						
					</dl>
					
					</template>
					
				</section>
			</article>
			
			<!-- 二维码弹出框 -->
	       
			<el-dialog id="qrcode_dialog" :visible.sync="dialogQrcode"
				:close-on-click-modal="false">
				<div class="cont">
		        	<!-- 图片二维码 -->
		          	<p>
		          		<img class="img-code" id="url" :src="qrcodeUrl" alt="">
	          		</p>
	          		<!-- 提示信息-->
	          		<ul class="qrcode-msg">
		          		<li >标题：{{title}}</li>
		          		<li >课程：{{courseName}}</li>
		          		<li >班级：{{clazzName}}</li>
		          		<li v-if="!!endTime" >截止日期：{{endTime}}</li>
	          		</ul>
			    </div>
			    <div slot="footer" class="btn-box"> 
			    	<el-button type="primary" class="btn" @click="downLoad">保存</el-button>
			    </div>
			</el-dialog>

		</main>
    	<!-- /main -->
	</div>
</template>
<script>
	import { getToken } from '@/filters/userVerify'
	import API from '@/global/resource'
	import model from 'model/activity/paperview'
	import Goback from 'base/goback/goback'
	export default {
		data () {
			return {
				selectcolor:true,  //实名匿名状态
				paperId:"",   //页面id
				title:"",     //文件标题
				type:"",	// 文件类型
				typeName: "",	//类型名称
				courseName:"",   // 课程名称,
				clazzName:"",   // 班级名称
				quesNum:"", // 问题数量
				endTime:"",  // 结束时间
				description:"",  // 问题描述
				quesList:[],   // 问题列表
				selList:["A","B","C","D","E","F","G","H","I","J"],
				qrcodeUrl:"",
				paperType:{
					"EVALUATION":"评价",
					"INTROSPECTION":"反思",
					"VOTE":"投票",
					"QUESTIONNAIRE":"问卷",
					
				},
				dialogQrcode: false
			}
			
		},
		computed: {
			clazzId() {
				return this.$route.query.clazzId;
			}
		},
		created:function() {
			this.getData();
		},
		methods: {
			getData: function() {
				this.paperId = this.$route.query.paperId;

				let data = {
					paperId: this.paperId
				}

				model.getQuesView (data, (res => {
					console.log("getQuesView", res);
					if(res.status == 200) {
						this.selectcolor=res.data.realNameFlag;
						this.clazzName = res.data.clazzName;
						this.title = res.data.title;
						this.courseName = res.data.courseName;
						this.quesNum = res.data.questionCount;
						this.quesList = res.data.questions;
						this.type = res.data.type;
						this.typeName = this.paperType[res.data.type];
						this.endTime = res.data.endTime;
						this.description = res.data.description;
						this.qrcodeUrl = res.data.qrcodeUrl;
					} else {
						this.$message.error(res.message);
					}
				}));
			},

			downLoad () {
				window.open(API.urls.qrcodeDownLoad+"?paperId="+this.paperId+"&token="+getToken())
			}
			
		},

		components: {
			Goback
		}
	}
</script>