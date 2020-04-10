<template>
	<div>
		<!--问卷-->
		<question @createQuestion = "createQuestion" :courseShow = "courseShowFlag" level="template"></question>
	</div>
</template>

<script>
	import Question from '@/base/question/question';
	import Model from '@/model/questemp/questemp';
	import { delTip } from '@/global/open'
	export default{
		data(){
			return{
				obj:{},

				courseShowFlag:false,

				//区分当前模板admin or 机构 or 班级
				type:""


			}
		},

		created(){
			console.log("clazz" + this.clazzId);

			console.log("org" + this.orgId);
		},

		computed:{
			level(){
				return this.$route.query.level;
			},

			orgId(){
				return this.$route.query.orgId;
			},

			clazzId(){
				return this.$route.query.clazzId;
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
			$.fn.tipsLeftWindow();
		},

		methods:{
			createQuestion(val){
				this.obj = val;

				if(this.level){
					this.type = "admin";
					console.log("admin")
				}else if(this.orgId && this.clazzId){
					this.type = "clazz";
					console.log("clazz");
				}else{
					this.type = "org";
					console.log("org");
				}


			
				if(this.type == "admin"){
					this.save();
				}else{
					this.save2();
				}
				
			},

			save(){
				let dataParse = {

					type:"QUESTIONNAIRE",
					level:this.level
				}
				for(var i in this.obj){
					dataParse[i] = this.obj[i];
				}


				let str = "发布模板后，机构下班级均可以调用，是否确认发布此模板？";
				delTip(this, str, this.publishAll,dataParse);

			},

			save2(){
				let dataParse = {

					type:"QUESTIONNAIRE",
					organizationId:this.orgId,
					level:"ORGANIZATION"
				}
				for(var i in this.obj){
					dataParse[i] = this.obj[i];
				}


				let str = "发布模板后，机构下班级均可以调用，是否确认发布此模板？";
				delTip(this, str, this.publishAll,dataParse);
			},

			publishAll(dataParse){
				
				let data = JSON.stringify(dataParse);

				Model.postCreateTemp(data,(res=>{

					if(res.status == 200){
						
						if(this.type == "admin"){

							this.$router.push({
								path:"/comtopic/questemp/list"
							})

						}else if(this.type == 'org'){
							console.log("机构首页爽肤水");
							this.$router.push({
								path:"/org/repository/queslist",
								query:{
									orgId:this.orgId
								}
							})
							
						}else{

							this.$router.push({
								path:"/evaltemp/questemp/list",
								query:{
									orgId:this.orgId,
									clazzId:this.clazzId
								}
							})
						}
							
						

					}else{
						this.$message.error(res.message)
					}
				}))
			},


		},

		components:{
			Question
		}
	}
</script>