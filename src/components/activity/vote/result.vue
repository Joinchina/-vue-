<style scoped lang="less">
	@import "../../../assets/less/activity.less";
	@import "../../../assets/less/icon.less";

</style>
<template>
	<div>
		<main class="x-view" id="quesRes">
			<nav class="subnav clearfix">
				<!-- <a class="back" href="javascript:history.back();" v-if="goStatusS != 'false'">
					<i class="icon-back"></i>返回
				</a> -->
				<Goback :passtitle="title"  v-if="goStatusS != 'false'"></Goback>
				<span class="right">

					<el-button
						@click="overVote"
						id="overVote"
						class=""
						v-show="type == 'VOTE' && closePrivilege" >{{status == 'END' ? '已结束' : '结束投票'}}</el-button>

					<!-- <a href="javascript:;" @click="showExportPop = true" class="" >导出{{typeName}}</a> -->

					

					<button class="btn-blue-l" v-if="type == 'EVALUATION' || type == 'INTROSPECTION'" @click="temModifyTop(type)">
						<i class="icon-t-modify"></i>修改题目
					</button>
					<el-dropdown  placement="bottom-start" trigger="click" @command="handleCommand" >
						<span class=" btn-green">
							<i class="icon-export-white"></i>导出{{typeName}}
						</span>
            			<!--评价饼形导出-->
            		 <span class="btn-pie btn-green-line ml10" type="button"v-if="type == 'EVALUATION'" @click="pieStatistics">
					      <i class="icon-add"></i>
					      饼图统计数据
				    </span>
						<el-dropdown-menu class="down" slot="dropdown">
							<el-dropdown-item command="excel">原始数据-Excel</el-dropdown-item>
    						<el-dropdown-item command="pdf">统计结果-PDF</el-dropdown-item>
    						<el-dropdown-item command="word" v-if="type == 'EVALUATION'">统计结果-Word</el-dropdown-item>
    						<el-dropdown-item command="wordetail" v-if="type == 'EVALUATION'">统计结果-Word分学员版</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					
					<button class="btn-green-line ques-add" type="button" v-show="type == 'QUESTIONNAIRE'" @click="addQuestemp" v-if="role !== 'PROFESSOR'">
						<i class="icon-add"></i>添加至机构模板库
					</button>

					<router-link :to="{ path: '/activity/vote/fullScreen/', query:{activityId:activityId, paperId:paperId, paperKey:paperKey}}" class="btn-blue" target="_blank" v-show="endStatus !=='END'">
						<i class="icon-full-white"></i>大屏幕
					</router-link>

				</span>

			</nav>
			<article 
				class="x-article load-minheight"
				v-loading="loading"
			    :element-loading-text="$globalParam.loadText"
			    :element-loading-spinner="$globalParam.loadSpinner"
			    :element-loading-background="$globalParam.loadText">
                <div class="realname" v-show="type=='QUESTIONNAIRE'">
					<span v-if="selectcolor==true">实名</span>
					<span v-else>匿名</span>
				</div>
				<div class="header">
					<h1 >{{title}}</h1>
					
					<h2 >所属课程：{{courseName}}</h2>
					<h2 v-if="crumbType == 'task' && type == 'EVALUATION' || crumbType == 'task' &&  type == 'INTROSPECTION'">
						起止时间：{{beginTime}} ~ {{endTime}}
						<span class="set-time" @click="timeSet" v-if="setTimeFlag">
							<i class="icon-time-blue"></i>
							时间设置
						</span>
					</h2>
					<div class="link">
						<router-link :to="{ path: '/activity/vote/man', query: {clazzId:clazzId, paperId:paperId,selectcolor:selectcolor, activityId:activityId,courseType:courseType}}" class="btn-green-line">
							提交人数 <span>{{submitNum}}</span><em>/</em>{{totalNum}}<i
							class="icon-right"></i>
						</router-link>

						<router-link :to="{ path: '/activity/vote/view', query: {clazzId:clazzId, paperId:paperId }}" class="btn-green-line">
							题目总数 <span>{{quesNum}}</span><i
							class="icon-right"></i>
						</router-link>

						<!-- <a :href="'/questionpaper/submit/users.xhtml?paperId='+paperId"
							class="btn-green-line">提交人数 <span>{{submitNum}}</span><em>/</em>{{totalNum}}<i
							class="icon-right"></i></a>  -->
						<!-- <a
							:href="'/questionpaper/vote/view.xhtml?paperId='+paperId"
							class="btn-green-line">题目总数 <span>{{quesNum}}</span><i
							class="icon-right"></i></a> -->
					</div>

				</div>

				<section class="x-ques">
					<template v-for="(item, indexone) in quesList">
					<dl v-if="item.type == 'SELECT'">
						<dt>
							<h2>
								<span class="q" >Q{{indexone+1}}.</span>
								{{item.question}}
								<span class="type" v-if="type == 'QUESTIONNAIRE' " >
									（单选）（{{item.required ? '必答' : '选答'}}）
								</span>
							</h2>
						</dt>
						<dd class="clearfix" v-for="(optStat, index) in item.optionStatistics">
							<p class="tit-opt clearfix" >{{selList[index]}}
								{{optStat.optionContent}}</p>
							<div class="progress-out">
								<progress-bar
									:selected-counts = "optStat.selectedCounts"
									:bg-color="colorList[index]"
									:submit-num="submitNum"></progress-bar>

							</div>
							<div class="progress-num">
								<span class="blue"
										:style="'color:'+colorList[index]"
										>{{optStat.selectedCounts == 0 ? '0' : (optStat.selectedCounts / submitNum * 100) | mround }}%
									&bull;</span> {{optStat.selectedCounts}}人
							</div>
						</dd>

					</dl>
					<dl v-else-if="item.type == 'MUILTSELECT'">
						<dt>
							<h2>
								<span class="q" >Q{{indexone+1}}.</span>
								{{item.question}}
								<span class="type" v-if="type == 'QUESTIONNAIRE' " >
									（多选）（{{item.required ? '必答' : '选答'}}）
								</span>
							</h2>
						</dt>
						<dd class="clearfix" v-for="(optStat, index) in item.optionStatistics">
							<p class="tit-opt clearfix" >
								{{selList[index]}}
								{{optStat.optionContent}}
							</p>
							<div class="progress-out">
								<progress-bar
									:selected-counts = "optStat.selectedCounts"
									:bg-color="colorList[index]"
									:submit-num="submitNum"></progress-bar>

							</div>
							<div class="progress-num">
								<span class="blue"
										:style="'color:'+colorList[index]"
										 >{{optStat.selectedCounts == 0 ? '0' : (optStat.selectedCounts / submitNum * 100) | mround }}%
									&bull;</span> {{optStat.selectedCounts}}人
							</div>
						</dd>

					</dl>
					<dl v-else-if="item.type == 'SUBJECTIVE'">
						<dt>
							<h2>
								<span class="q" >Q{{indexone+1}}.</span>
								{{item.question}}
								<span class="type" v-if="type == 'QUESTIONNAIRE' " >
									（问答）（{{item.required ? '必答' : '选答'}}）
								</span>
							</h2>
						</dt>
						<dd class="">
							<div class="keyword" ref="keyword">
								<h2>关键词：</h2>
								<span v-for="(word,index) in item.keywords" :key="index" :style="{background:keywordColor[index%5],border:'1px solid '+keywordColor[index%5]+''}" @click="setWorkcolor(keywordColor[index%5],word,item.answers,indexone,index)">{{word}}</span>
							</div>
							<div class="textbox" >
								<p v-for="(answer, index) in item.answers" class="textWord">{{answer}}</p>
							</div>

						</dd>

					</dl>
					</template>
					<iframe :src="'../../../../static/page/questionadmin.html?activityId='+activityId+'&token='+token" frameborder="0" id="iframeId"></iframe>

				</section>
			</article>
		</main>

		<!-- 导出评价 -->
		<!-- <export-pop
			:exportPop.sync="showExportPop"
			type="evaluation"
			:paperId="paperId"></export-pop> -->

		<!--修改模板-->
		<import-template
		:dialogTemModify.sync="TemModify" 
		@updataEvalTems = "getDataWhile"
		:types="type"
		:title="title"
		:courseName = "courseName"
		:activityId = "activityId"
		:clazzId = "clazzId">
       </import-template>

       <!-- 起止时间设置 -->
		<er-time-set
		:dialogSetTime.sync="setTimeEr"
		:activityId = "activityId"
		@updateTime="updateTime">
		</er-time-set>
		<!--导出报告-->
		<forms-summit 
				:methods = "formObj.method"
				:urls = "formObj.urls"
				:data = "formObj.data"
				ref="postdata">
		</forms-summit>
	</div>
</template>
<script>
import model from 'model/activity/result'
import { getToken } from '@/filters/userVerify'
import API from '@/global/resource'
import progressBar from 'components/activity/progress_bar'
import importTemplate from 'components/activity/vote/modify'
// import exportPop from 'components/activity/export_pop'

import Questemp from 'model/questemp/questemp'
import { getCurRole } from '@/filters/userVerify'
import Goback from 'base/goback/goback'

import erTimeSet from 'components/course/er_time_set'
import formsSummit from 'components/formsumit/form'
export default {
	data () {
		return {
			selectcolor:true,
			activityId: "",
			paperId:"",
			paperKey:"",
			type:"",				// 结果类型
			typeName:"",
			closePrivilege:"",   // 是否有权限结束投票
			status:"",
			title:"",
			submitNum:"",
			totalNum:"",
			quesNum:"",
			quesList:"",
			selList:["A","B","C","D","E","F","G","H","I","J",'K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
			colorList:["#4fbeea", "#a9ca77", "#fec457", "#ff7d7a",
				"#23a565", "#f496aa", "#f4a260", "#cd6ced", "#f7b560", "#ed6cbe",
				"#4fbeea", "#a9ca77", "#fec457", "#ff7d7a",
				"#23a565", "#f496aa", "#f4a260", "#cd6ced", "#f7b560", "#ed6cbe",
				"#4fbeea", "#a9ca77", "#fec457", "#ff7d7a"],
			paperType:{
				"EVALUATION":"评价",
				"INTROSPECTION":"反思",
				"VOTE":"投票",
				"QUESTIONNAIRE":"问卷",

			},
			courseName:"",
	      beginTime:"",
	      endTime:"",
	      crumbTpe:"",
			endStatus: "",

			TemModify:false,
			loading:true,
			setTimeFlag: false,		// 是否显示时间设置
			setTimeEr:false, //起止时间设置
			keywordColor:['#DAFFEE','#FCEDAA','#EEEEEE','#FFE0DF','#EEEEEE'],//高频词的四种颜色
			keyCurWordColor:['#1CA37F','#FD7E23','#8E9BAE','#CF788D','#8E9BAE'],
			setkeyColor:'',
			token:"",
			clazzName:"",
			clazztitle:"",
			formObj:{
				method:"post",
				urls:API.urls.experttutu,
				data:{}
			},
			curIndex:-1,
		}
	},
	computed: {
		clazzId() {
			return this.$route.query.clazzId;
		},

		// 全部课程下的type
		courseType() {
			return this.$route.query.type;
		},
		courseId() {
			return this.$route.query.courseId;
		},
	    //区分课程详情 or 全部任务
	    crumbType(){

	      return this.$route.query.crumb;
	    },
	    //区分首页点击返回隐藏
		goStatusS(){
			if(!!this.$route.query.goStatus){
				return this.$route.query.goStatus;
			}
		},
		// 角色
		role() {
			return getCurRole();
		}
	},
	
	created(){
		this.activityId = this.$route.query.activityId;
		if(this.courseType) {
			this.getCourseData();
		} else {
			this.getData();
		}
		this.token=getToken()
	},
	mounted(){
	},
	filters: {
		mround: function(value) {
			if (!value) return ''
			value = Math.round(value)
			return value
		}
	},
	methods: {
		/**
		 * color为点击时设置的颜色
		 * value为点击时的关键字
		 * text为原始文本内容
		 * index为当前第几个题
		 * 如果setkeyColor==color则说明是点击的同一个
		 * 取消颜色反之，先取消颜色再增加新的颜色
		 */
		setWorkcolor(color,value,text,index,curIndex){
			console.log("itemAnswets======",text);
			console.log("word=======",value);
			let wordParent = document.getElementsByClassName("x-ques")[0].children[index].children[1].children[1].getElementsByTagName("p");
			if(this.curIndex == curIndex){
				this.curIndex = -1;
				for(var i = 0; i < wordParent.length; i++){
					wordParent[i].innerHTML=text[i];
					let values =  wordParent[i].innerHTML.split(value);
					wordParent[i].innerHTML = values.join("<span>" + value + '</span>');
				}
				
			}else{
				this.curIndex = curIndex;
				console.log("length=======",$(".keyword").eq(index).find("span").length);
				$(".keyword").eq(index).find("span").each((index,item)=>{
					console.log("item===",item);
					console.log("thislalalal",this.keywordColor[index%5]);
					$(item).attr({"style":"background:"+this.keywordColor[index % 5]+";color:#333;border:1px solid "+this.keywordColor[index%5]+""})
				})
				$(".keyword").eq(index).find("span").eq(curIndex).attr({"style":"background:"+this.keyCurWordColor[curIndex % 5]+";color:#fff;border:1px solid "+this.keyCurWordColor[curIndex % 5]+""});
				for(var i = 0; i < wordParent.length; i++){
					wordParent[i].innerHTML=text[i];
					let values =  wordParent[i].innerHTML.split(value);
					wordParent[i].innerHTML = values.join("<span style="+"background:#FCEDAA>" + value + '</span>');
				}
				
			}
		},		
		updateTime(data) {
			this.beginTime = data.bgTime;
			this.endTime = data.edTime;
		},
		timeSet(){
	        this.setTimeEr = true;
		},
		pieStatistics(){
		this.$router.push({ path:"/evaluation/static_pie",query:{clazzId:this.clazzId,paperId:this.paperId,crumb:this.crumbType}})
		},
    	getDataWhile(obj){
    		//课程下评价反思
    		//console.log("=========================");
    		if(obj.crumb == "undefined"){

    			this.$router.push("/activity/introspection/result?clazzId="+this.clazzId+"&type="+obj.type+"&courseId="+this.courseId);
    			this.getCourseData();

    		}else{

    			//项目下评价反思      
	    		if(obj.level == "CLAZZ"){

	    			this.$router.push("/activity/evaluation/result?clazzId="+this.clazzId+"&activityId="+obj.activityId+"&crumb=task");
	    			this.activityId = obj.activityId;
	    			this.getData();
	    		}else{

	    		   //课程下活动评价反思	
	    			this.$router.push("/activity/evaluation/result?clazzId="+this.clazzId+"&activityId="+obj.activityId+"&crumb=det");
	    			this.activityId = obj.activityId;
                    this.getData();
	    		}
    		}

    		
    	},
		// 全部课程下评价反思
		getCourseData() {
			let data = {
				type: this.courseType,
				courseId: this.courseId
			}
			model.getCourseEvalIntroRes(data, (res => {
				console.log("getCourseEvalIntroRes", res);
				if (res.status == 200) {

					this.loading = false;

					this.courseName = res.data.courseName;
					this.activityId = res.data.activityId
					this.type = res.data.type;
					console.log("全部课程下" + this.type);
					this.typeName = this.paperType[res.data.type];
					this.status = res.data.status;
					this.closePrivilege = res.data.closePrivilege;
					this.title = res.data.title;
					this.submitNum = res.data.submitNum;
					this.totalNum = res.data.totalNum;
					this.quesNum = res.data.questionCount;
					this.quesList = res.data.questions;
					this.paperId = res.data.questionPaperId;
					this.paperKey = res.data.activityId + "_" + new Date().getTime();
					this.endStatus = res.data.status;
				} else {

					this.loading = false;

					this.$message.error(res.message);
				}
			}));
		},
		getData(){

			let data = {
				activityId: this.activityId
			}

			model.getCourseActPaperRes( data, (res => {
				// console.log("getCourseActPaperRes",res);
				if (res.status == 200) {
                    console.log("wdq")
					this.loading = false;

					this.selectcolor=res.data.realNameFlag;
					this.courseName = res.data.courseName;

					console.log("项目任务下2" + this.courseName);
					this.activityId = res.data.activityId
					this.type = res.data.type;
					console.log("项目任务下" + this.type);
					this.typeName = this.paperType[res.data.type];
					this.status = res.data.status;
					this.closePrivilege = res.data.closePrivilege;
					this.title = res.data.title;
					this.clazzName=res.data.clazzName;
					this.submitNum = res.data.submitNum;
					this.totalNum = res.data.totalNum;
					this.quesNum = res.data.questionCount;
					this.quesList = res.data.questions;
					this.paperId = res.data.questionPaperId;
					this.paperKey = res.data.activityId + "_" + new Date().getTime();
					this.endStatus = res.data.status;
					//在项目任务下的评价反思中显示起止时间
					if(!!res.data.beginTime){
						this.beginTime = res.data.beginTime;
					}
					if(!!res.data.endTime){
						this.endTime = res.data.endTime;
					}else{
						this.endTime = "永久";
					}

					if(res.data.operationStatus) {
						this.setTimeFlag = true;
					} else {
						this.setTimeFlag = false;
					}

				} else {
					
					this.loading = false;

					this.$message.error(res.message);
				}
			}));


		},
		overVote() {

			let data = {
				paperId: this.paperId
			}
			// console.log("closeVotedata", this.paperId);
			model.closeVote (data, ( res => {
				// console.log("closeVote", res);
				if(res.status == 200) {
					document.getElementById('overVote').innerHTML = "已结束";
				} else {
					this.$message.error(res.message);
				}
			}));

		},
		// 导出
		handleCommand(command) {
			if(!this.$store.getters.getOrgVipInfo.vip){
				this.$store.state.vipFuncPopFalg = true;
				return;
			}
			if(command === 'excel') {
				window.open(API.urls.exportResExcel+"?paperId="+this.paperId+"&token="+getToken());
			}

			if(command === 'pdf') {
				// window.open(API.urls.exportResPDF+"?paperId="+this.paperId+"&token="+getToken());
				let _iframe = document.getElementById('iframeId').contentWindow;
				let myhtml =_iframe.document.getElementById('gethtml').innerHTML;					
				let data={
					fileName:this.clazzName+this.title,
					document:'<!DOCTYPE html>'+'<html>'+myhtml+'</html>',
					token:getToken()
				}
				this.formObj.data=data
				setTimeout(()=>{
							 this.$refs.postdata.submitData();							 
        },50)			
			}
			if(command === 'word') {
				window.open(API.urls.exportEvaluationWordTable+"?paperId="+this.paperId+"&token="+getToken());
			}

			if(command === 'wordetail') {
				window.open(API.urls.exportEvalWordDetail+"?paperId="+this.paperId+"&token="+getToken());
			}
		},
		//修改题目
		temModifyTop(){
			//this.type = this.type;
			// console.log(this.crumbs);
			this.TemModify= true;
	
		},

		// 添加至机构模板库
		addQuestemp() {
			let str = "添加至机构模板库后，机构内所有班级都可以引用此问卷的内容，省去重复创建的繁琐步骤。您还可以在模板库-问卷模板中对自己的模板进行修改。"

			this.$confirm(str, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
          		type: 'warning'
			}).then(() => {
				this.addQuesT();
			}).catch(()=> {
				this.$message({
					message: '已取消操作',
					type: 'warning'
				});
			})
		},

		addQuesT() {
			let data = {
				paperId: this.paperId
			}

			Questemp.postAddtoOrg(data, (res => {
				if(res.status == 200) {
					this.$message.success('加入模板库成功');
				} else {
					this.$message.error(res.message);
				}
			}));
		}
	},

	components: {
		progressBar,
		importTemplate,
		Goback,
		erTimeSet,
		formsSummit,
		// exportPop
	}
}
</script>
<style scoped="" lang="less">
#iframeId{
	position: fixed;
	top: 0;
	left: 0;
	z-index: -1;
}
  .btn-pie{
    color:#319c95!important;
    height: 37px!important;
    line-height: 37px!important;
    i{
      margin-right: 0!important;
    }
  }
  .x-article{
       position: relative;
		.set-time {
			font-size: 16px;
			color: #1077D7;
			cursor: pointer;
			>.icon-time-blue {
				margin-left: 20px;
				margin-right: 2px;
			}
		}
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

.x-view .subnav a.btn-blue {
	display: inline-block;
    font-size: 16px;
    color: #fff;
    padding: 10px 15px;
    // margin-right: 7px;
    margin-left: 7px;
}
.ques-add {
	width: auto;
	padding: 0 15px;
	color: #35a69d;
	margin-left: 7px;
}
.textWord{
	transition:background .8s;
}
.keyword{
	width: 100%;
	overflow: hidden;
	transition: all .6s;
	h2{
		float: left;
		font-size: 16px;
		color: #39467F;
	}
	span{
		border-top-right-radius: 30px;
		border-top-left-radius: 30px;
		border-bottom-right-radius: 30px;
		font-size: 14px;
		color: #333333;
		margin-right: 16px;
		padding: 0px 10px;
		cursor: pointer;
		transition: all .5s;
	}
}
</style>
