<template>
	<div>
		<!--问卷-->
		<question @createQuestion = "createQuestion" :courseShow="courseShowFlag" :switchmessage="switchdelg"  level="template" ></question>
	</div>
</template>

<script>
	import Question from '@/base/question/question'; 
	import Model from '@/model/activity/result';
	import Template from '@/model/questemp/questemp';
	import { delTip } from '@/global/open';

	export default{
		data(){
			return{
				obj:{},

				courseShowFlag:true,

				defaultFlag:false,

				switchdelg:'',
			}
		},

		computed:{
			userId(){
				return this.$route.query.createUserId;
			},
			paperId(){
				return this.$route.query.id;
			}
		},

		mounted(){
			this.editor();
			
		},



		methods:{

			editor(){
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

			editData(data){
				
				//标签索引
				var zmArray = ["A","B","C","D","E","F","G","H","I","J"];
				//问卷标题
				var title = data.title;
				//问卷描述
				var descripion = data.description;
				//所属课程
				var courseList = data.courseList;
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

				$("#belongCourse").html("");
				if(courseList != null && courseList != undefined){
					for(var i = 0; i < courseList.length;i++){
						var option = $("<option id = '"+courseList[i].id+"' type='"+courseList[i].defaultFlag+"'>"+courseList[i].name+"</option>");
						$("#belongCourse").append(option);
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

				$("#endTime").val(endTime);

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
				
				this.edit();
			},

			edit(){
				//课程id
				this.courseId = $("#belongCourse option:selected").attr("id");

				//区分跳转项目任务 or 课程列表
				this.defaultFlag = $("#belongCourse option:selected").attr("type");


				let dataParse = {
					id:this.paperId,
					type:"QUESTIONNAIRE",
					createUserId:this.userId
				}

				for(var i in this.obj){
					dataParse[i] = this.obj[i];
				}

				this.publishAll(dataParse);
			},

			publishAll(dataParse){
				let data = JSON.stringify(dataParse);

				Template.postUpdateTemp(data,(res=>{
					if(res.status == 200){
						history.back(-1);
					}else{

					}
				}))
			}


		},

		components:{
			Question
		}
	}
</script>

