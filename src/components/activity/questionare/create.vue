<template>
	<div>
		<!--问卷-->
		<question :courseId="courseId" @createQuestion = "createQuestion" :courseShow = "courseShowFlag"></question>


	</div>
</template>
<script>
	import Question from '@/base/question/question'; 
	import Model from '@/model/activity/result';
	import Course from '@/model/clazz/course';
	import { delTip } from '@/global/open'
	export default{
		data(){
			return{
				obj:{},

				courseShowFlag:false
			}
		},
		computed:{
			clazzId(){
				return this.$route.query.clazzId;
			},
			type(){
				return this.$route.query.type;
			},
			courseId(){
				return this.$route.query.courseId;
			}
		},

		created(){

			//班级下创建问卷 -- 所属课程可选
			if(this.type == 'clazz'){
				this.courseShowFlag = true;
				this.courseList();
			}
		},

		mounted(){
			$(".content").QuestionObj({
		      animate:true,
		      editor:false,
		      //默认一条数据选择为value为0
		      sectionNum:0,
		      addAlmostNum:40
		    });
			// //进行离开校验
			// console.log($.fn.tipsLeftWindow);
			$.fn.tipsLeftWindow();
			// $.fn.selectcret();
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
			createQuestion(val){
				console.log("ques-list", val)
				this.obj = val;
				this.save();
			},
			save(){
				//courseId不存在，即班级首页创建问卷
				if(!this.courseId){
					var courseId = $("#belongCourse option:selected").attr("id");
				}else{
					var courseId = this.courseId;
				}
				console.log(courseId);
				let dataParse = {
					courseId:courseId,
					type:"QUESTIONNAIRE",
					clazzId:this.clazzId
				}
				for(var i in this.obj){
					dataParse[i] = this.obj[i];
				}
				console.log('data');
				console.log(dataParse);
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

							//跳转至项目列表
							if(this.type == 'task'){
								this.$router.push({
									path:"/course/task",
									query:{
										clazzId:this.clazzId
									}
								})

							//跳转至课程列表
							}else if(this.type == 'detail'){

								this.$router.push({
									path:"/course/detail",
									query:{
										clazzId:this.clazzId,
										courseId:this.courseId
									}
								})

							//跳转至班级首页问卷列表
							}else{

								this.$router.push({
									path:"/clazz/index/questionaire",
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