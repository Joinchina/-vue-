<template>
	<div>
		
		<!--问卷-->
		<question @createQuestion = "createQuestion" 
				  :courseShow="courseShowFlag" 
				  :template="template" 
				  :type="type"
				  :switchmessage="switchdelg" 
				  :courseId="courseId2"
				  ref="endTimeDom"
				  :openModeE="openMode">
				  	
		</question>

	</div>
</template>
<script>
	import Question from '@/base/question/question'; 
	import Model from '@/model/activity/result';
	import Template from '@/model/questemp/questemp';
	import { delTip } from '@/global/open';

	//创建模板  -- 问卷
	import Course from '@/model/clazz/course';

	export default{
		data(){
			return{
				obj:{},

				courseShowFlag:true,

				defaultFlag:false,

				courseId:"",
				switchdelg:'',
				openMode: "",
			}
		},
		computed:{
			clazzId(){
				return this.$route.query.clazzId;
			},
			paperId(){
				return this.$route.query.paperId;
			},

			//模板库进行模板编辑
			template(){
				return this.$route.query.template;
			},

			type(){
				return this.$route.query.type;
			},

			courseId2(){
				return this.$route.query.courseId;
			}



			
		},

		mounted(){

			//模板库进行查询
			if(this.template){

				this.courseList();
				this.editorTemplate();


			}else{
				this.editor();
			}

			console.log("当前课程id" + this.courseId);
			

		},

		methods:{
			courseList(){

				let data = {
					clazzId:this.clazzId
				}


				Course.getCourseList(data,(res=>{
					var data = res.data;
					if(data.length > 0){
						var str = "";
						str +="<option id='default'>请选择</option>";
						for(var i = 0;i < data.length;i++){
							str += "<option id = '"+data[i].id+"'>"+data[i].name+"</option>";
						}
						$("#belongCourse").html(str);
					}
				}))
			},

			editorTemplate(){
				let data = {
					id:this.paperId
				}
				Template.getFindOne(data,(res=>{
					if(res.status == 200){
						this.editData(res.data);
					}else{
						this.$message.error(res.message);
					}
				}))
			},

			editor(){
				let data = {
					paperId:this.paperId
				}
				Model.questionnaireEdit(data,(res=>{
					console.log("编辑数据", res);
					if(res.status == 200){
						this.openMode = res.data.openMode || '';
						this.editData(res.data);
					}else{
						this.$message.error(res.message);
					}
				}))
			},

			editData(data){

				//标签索引
				var zmArray = ["A","B","C","D","E","F","G","H","I","J"];
				//问卷标题
				var title = data.title;
				//问卷描述
				var descripion = data.description;
				//所属课程
				var courseList = data.courseList;
				// 开放方式
				
				//课程id
                var courseIdDraft = data.courseId;
				//  实名匿名状态
				var realNameFlag = data.realNameFlag;
				this.switchdelg=realNameFlag;
				if(realNameFlag){

					$(".el-switch").addClass("is-checked");
					$(".el-switch").attr("aria-checked","true");

				}else{

					$(".el-switch").removeClass("is-checked");
					$(".el-switch").removeAttr("aria-checked","true");
				}


				//活动编辑问卷，后台返回课程列表

				if(!this.template){

					$("#belongCourse").html("");
					if(courseList != null && courseList != undefined){
						for(var i = 0; i < courseList.length;i++){
							var option = $("<option id = '"+courseList[i].id+"' type='"+courseList[i].defaultFlag+"'>"+courseList[i].name+"</option>");
							$("#belongCourse").append(option);
						}
					}
				}
				

				//所属课程
				var courseName = data.courseName;

				//截止时间
				var endTime = data.endTime;

				//问题集合
				var questions = data.questions;

				if(title != undefined && title != null){
					$("#title").val(title);
				}
				if(descripion != undefined && descripion != null){
					$("#questionDescripion").val(descripion);
				}
				if(courseName != undefined && courseName != null){
					$("#belongCourse").val(courseName);
				}
				this.$refs.endTimeDom.endTime = endTime;
				if(questions != null && questions != undefined){
					var str = "";
					var curClass = "multi_cur";
					var normalClass = "multi_nomal";
					for(var i = 0; i < questions.length;i++){
						str +='<section class="con item_width" id = "item_'+i+'">';
						str +='<input type="button" class = "btn_add2" id = "insertQuestion">';
						str +='<div class="qu_width">';
						str	+=	'<div class="pull-right">';
						str	+=		'<a href="javascript:void(0)" class="btn_delete delItem"></a>';
						str	+=		'<a href="javascript:void(0)" class="btn_moveup moveup">上移</a>';
						str	+=		'<a href="javascript:void(0)" class="btn_moveup mg_none movedown">下移</a>';
						str	+=	'</div>';
						str	+=	'<span class="index">Q<span class = "number">'+(i + 1)+'</span></span>';
						str	+=	'<div class="question"><input type="text" class="form-control rg_input_h titleChoose js-text" value = "'+questions[i].question+'" value="请输入选项（50字以内）" maxlengths="50"></div>';
						str	+= '</div>';
						str	+= '<div class="type">';
						str	+=	'<ul class="clearfix">';
						if(questions[i].type == "SELECT"){
							str	+=	'<li class="multi_cur type_one">单选题</li>';
							str	+=	'<li class="multi_nomal type_one">多选题</li>';
							str	+=	'<li class="multi_nomal six68_l type_one">问答题</li>';
						}else if(questions[i].type == "MUILTSELECT"){
							str	+=	'<li class="multi_nomal type_one">单选题</li>';
							str	+=	'<li class="multi_cur type_one">多选题</li>';
							str	+=	'<li class="multi_nomal six68_l type_one">问答题</li>';
						}else{
							str	+=	'<li class="multi_nomal type_one">单选题</li>';
							str	+=	'<li class="multi_nomal type_one">多选题</li>';
							str	+=	'<li class="multi_cur six68_l type_one">问答题</li>';
						}

						str	+=	'<li class="line"></li>';
						if(questions[i].required){
							str	+=	'<li class="n_cur six68_r type_two">必答</li>';
							str	+=	'<li class="n_nomal type_two">选答</li>';
						}else{
							str	+=	'<li class="n_nomal six68_r type_two">必答</li>';
							str	+=	'<li class="n_cur type_two">选答</li>';
						}

						str	+=	'</ul>';
						str	+= '</div>';
						for(var j = 0; j< questions[i].selections.length; j++){
							str	+=	'<dl class="clearfix">';
							str	+=	  '<dt><span class="letter">'+zmArray[j]+'</span></dt>';
							str	+=		'<dd class="qu_width_t"><input type="text" class="form-control  rg_input_h addInput js-text" value = "'+questions[i].selections[j]+'" placeholder="请输入选项（50字以内）" maxlengths="50"></dd>';
							str	+=		'<dd><input type="button" class = "del"></dd>';
							str	+=	'</dl>';
						}
						if(questions[i].type == "SUBJECTIVE"){
							while(questions[i].selections.length < 4){
								str	+=	'<dl class="clearfix" style = "display:none">';
								str	+=	  '<dt><span class="letter">'+zmArray[questions[i].selections.length]+'</span></dt>';
								str	+=		'<dd class="qu_width_t"><input type="text" class="form-control  rg_input_h addInput js-text" placeholder="请输入选项（50字以内）" maxlengths="50"></dd>';
								str	+=		'<dd><input type="button" class = "del"></dd>';
								str	+=	'</dl>';
								questions[i].selections.length++;
							}
						}else{
							while(questions[i].selections.length < 4){
								str	+=	'<dl class="clearfix">';
								str	+=	  '<dt><span class="letter">'+zmArray[questions[i].selections.length]+'</span></dt>';
								str	+=		'<dd class="qu_width_t"><input type="text" class="form-control  rg_input_h addInput js-text" placeholder="请输入选项（50字以内）" maxlengths="50"></dd>';
								str	+=		'<dd><input type="button" class = "del"></dd>';
								str	+=	'</dl>';
								questions[i].selections.length++;
							}
						}


						str	+= '</section>';
			   		}
			   	   $(".content").html(str);
				   	var datalLength = questions.length - 1;
				   	//创建问卷标题
				   	$(".content").QuestionObj({
						animate:true,
						editor:true,
						sectionNum:datalLength,
						addAlmostNum:40
					});
					//进行离开校验
					$.fn.tipsLeftWindow();
				}


			},

			createQuestion(val){

				this.obj = val;

				this.save();
			},

			save(){


				//课程id
				this.courseId = $("#belongCourse option:selected").attr("id");

				//班级内创建模板库-课程id
				if(!this.courseId){
					this.courseId = this.courseId2;
				}

				//区分跳转项目任务 or 课程列表
				this.defaultFlag = $("#belongCourse option:selected").attr("type");


				let dataParse = {
					courseId:this.courseId,
					type:"QUESTIONNAIRE",
					clazzId:this.clazzId
				}

				//使用模板库创建问卷不需要模板id,活动下编辑问卷需问卷id
				if(!this.template){
					dataParse.identification = this.paperId
				}


				for(var i in this.obj){
					dataParse[i] = this.obj[i];
				}

				//发布需确认是否能修改
				if(dataParse.status == 'PUBLISH'){
					
					let str = "发布后问卷不能修改，是否确认发布？";
					delTip(this, str, this.publishAll,dataParse);

				//草稿箱直接发布	
				}else{
					
					this.publishAll(dataParse);
				}
				


			},


			publishAll(dataParse){
				let data = JSON.stringify(dataParse);
				
				Model.questionnaireCreate(data,(res=>{
					if(res.status == 200){

						//草稿箱跳转
						if(res.data.status == 'DRAFT'){
							this.$router.push({
								path:"/questionare/draft",
								query:{
									clazzId:this.clazzId
								}
							})
						}

						//发布跳转
						if(res.data.status == 'PUBLISH'){

							console.log("type");
							console.log(this.type);
							//模板库创建问卷进行跳转
							if(this.type == "clazz"){
								this.$router.push({
									path:"/clazz/index/questionaire",
									query:{
										clazzId:this.clazzId
									}
								})
								return;
							}else if(this.type == 'task'){
								this.$router.push({
									path:"/course/task",
									query:{
										clazzId:this.clazzId
									}
								})
								return;
								
							}else if(this.type == 'detail'){
								this.$router.push({
									path:"/course/detail",
									query:{
										clazzId:this.clazzId,
										courseId:this.courseId
									}
								})
								return;
							}

							




							//班级活动编辑问卷进行跳转
							//跳转项目任务
							if(this.defaultFlag == "true"){

								console.log("进去task页面");
								this.$router.push({
									path:"/course/task",
									query:{
										clazzId:this.clazzId
									}
								})

							//跳转课程详情
							}else{

								console.log("进去detial页面");
								this.$router.push({
									path:"/course/detail",
									query:{
										clazzId:this.clazzId,
										courseId:this.courseId
									}
								})

							}
							
						}
						
					}else{
						this.$message.error(res.message);
					}
				}))
			}
		},

		components:{
			Question
		}
	}
</script>
<style scopped>
	@import '../../../assets/css/questionnaire.css';
</style>