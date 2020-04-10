<template>
	<div id="waddClass">
		<el-dialog class="dialog-form" title="新增题目"
			:visible.sync = "dialogAddtopic"
			:close-on-click-modal="false"
			:before-close="close"
			
            @open="open">
			<el-form :model="ruleAddTopic" :rules="rules" ref="ruleAddTopic" v-loading="loading"
               element-loading-text="拼命加载中">
				<el-form-item label="Q" :label-width="labelWidth" prop="name">
					<el-input 
					v-model.trim="ruleAddTopic.name"
					placeholder="请输入题目(500字以内)" 
					auto-complete="off">
					</el-input>
				</el-form-item>

				<el-form-item :label-width="labelWidth">
				      	<el-radio-group v-model="radio1" @change="radioValue(1)">
						    <el-radio :label="1">单选题</el-radio>
						    <el-radio :label="2">多选题</el-radio>
						    <el-radio :label="3">简答题</el-radio>
					    </el-radio-group>
					    <el-radio-group v-model="radio2" @change="radioValue(2)" class="ml50">
						    <el-radio :label="4">必答</el-radio>
						    <el-radio :label="5">选答</el-radio>
					    </el-radio-group>
				    </el-radio-group>
				</el-form-item>

				<!--选择题-->
				<div v-show = "questionFlag">
					<el-form-item 
						:label="dataArray[index]['name']" 
						:label-width="labelWidth"
						v-for="(item,index) in dataDefaultArray" :key="index"
						:prop="item.name"
						>
						<div>
							<el-input 
							auto-complete="off"
							v-model.trim="item.value"
							placeholder="请输入选项(50字以内)" 
							max-length = "51"
							@click.native="!onlyten&&addNewQuestion(index)">
							</el-input>
							<!-- {{item}} -->
							<span @click="!onlyone&&removeNewQuestion(index)"  class="del"><img src="/static/page/assets/pages/img/vote/naire_2.png"></span>
						</div>
					</el-form-item>
					<!-- <div class="explain">选项中直接回车就增加下个选项</div> -->
				</div>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="!loading &&submitForm('ruleAddTopic')" >确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import model from 'model/comtpoc/comtopic'
	import API from '@/global/resource'
	import { getToken } from '@/filters/userVerify'
	export default{
		props:["dialogAddtopic","type","level"],
		created(){

		},
		data(){
			return{
				dataDefaultArray:[
					{name:"A",value:""},
					{name:"B",value:""},
					{name:"C",value:""},
					{name:"D",value:""}
				],
				dataArray:[
					{name:"A",value:""},
					{name:"B",value:""},
					{name:"C",value:""},
					{name:"D",value:""},
					{name:"E",value:""},
					{name:"F",value:""},
					{name:"G",value:""},
					{name:"H",value:""},
					{name:"I",value:""},
					{name:"J",value:""}
				],
				ruleAddTopic: {
					name: ""
				},

				radio1:1,
				radio2:4,
				radioSelect:"SELECT",
				radioType:true,
				questionFlag:true,
				value:"",
				inputVals:[],
				onlyten:false,
				onlyone:false,

				loading:false,
				labelWidth:"120px",
				rules: {
					name: [
						{ required: true, message: '请填写题目', trigger: 'blur'},
						{ max: 500, message: '题目不能超过500字'}
					],
				},
			}
		},
		methods:{

			open(){
				//this.loading = false;
				
				//清空数据
				this.dataDefaultArray = [
					{name:"A",value:""},
					{name:"B",value:""},
					{name:"C",value:""},
					{name:"D",value:""}
				];
				this.inputVals = [];
				this.radio1 = 1;
				this.radio2 = 4;

				this.radioSelect = "SELECT";
				this.radioType = true;
				this.ruleAddTopic.name = "";

				this.questionFlag = true;

			},

			close(){
				this.$emit('update:dialogAddtopic', false);
			},

			submitForm(formName) {

				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.dataDefaultArray.forEach((item,index)=>{
							if(item.value != ""){
								this.inputVals.push(item.value);
							}
						
						})
						//console.log(this.inputVals);

						
						//console.log(this.radio1);
						if(this.radio1 != 3){

							//两个相同答案的不能提交
							let simple = this.comonNoComit(this.inputVals);
							if(simple){
								this.$message({
									showClose:true,
									message:"当前问题至少需要设置两个不同的选项",
									type:"warning"
								})
								this.inputVals = [];
								return;
							}

							//至少填写两个选项
							if(this.inputVals.length < 2){
								this.$message({
									showClose:true,
									message:"当前问题至少需要设置两个不同的选项",
									type:"warning"
								})
								this.inputVals = [];
								return;
							}

						}
						this.addTopicList();
						
						
						
					} else {
						console.log('error submit!!');
						return false;
					}
				})
			},

			comonNoComit(array){
				//创建一个对象
				var obj = {};
				for(var i in array){

					if(obj[array[i]] ){
						return true;
					}
					obj[array[i]] = true;
				}
				return false;
			},

			addTopicList(){
				
				this.$message({
						type: 'success',
						message: '题目添加成功',
						duration: 1000
				});
				let questions = {
					question:this.ruleAddTopic.name,
					required:this.radioType,
					type:this.radioSelect,
					selections:this.inputVals
				}
				this.$emit("saveOneQuestion",questions);
				this.close();

			},

			addNewQuestion(index){
				//console.log("keyups");
				this.onlyone = false;
				if(this.dataDefaultArray.length == 10){
					this.$message({
						showClose:true,
						message:"最多只能添加10条",
						type:"warning"
					})
					this.onlyten = true;
					return;
				}
				if(index == this.dataDefaultArray.length-1){

					
					this.dataDefaultArray.push({
						name:this.dataArray[index+1]["name"],
						value:this.dataArray[index+1]["value"]
					});

				}
			},

			removeNewQuestion(index){
				this.onlyten = false;
				if(this.dataDefaultArray.length == 2){
					this.$message({
						showClose:true,
						message:"至少有两条数据",
						type:"warning"
					})
					this.onlyone = true;
					return;
				}
				this.dataDefaultArray.splice(index,1);

			
				

			},


			radioValue(type){
				if(type == 1){
					this.radioSelect = this.radio1;
				}else{
					this.radioType = this.radio2;
				}
				this.formatSelect();
				this.formatType();
			},
			formatSelect(){

				switch(this.radioSelect){
					case 1:
					this.radioSelect = "SELECT";
					this.questionFlag = true;
					break;

					case 2:
					this.radioSelect = "MUILTSELECT";
					this.questionFlag = true;
					break;

					case 3:
					this.radioSelect = "SUBJECTIVE";
					this.questionFlag = false;
					break;

					default:
				}
			},
			formatType(){
				switch(this.radioType){
					case 4:
					this.radioType = true;
					break;

					case 5:
					this.radioType = false;
					break;

					default:
				}
			}


		},

	}
</script>
<style scopped lang="less">
	.el-input{
		width: 95%;
	}
	.del{
		cursor: pointer;
	}
	.ml50{
		padding-left: 150px;
	}
	.explain{
		color: #666;
		background: url('/static/page/assets/pages/img/vote/naire_12.png') no-repeat left center;
		padding-left: 23px;
		margin-left: 118px;
	}
	.dialog-form .el-form-item{
		margin-bottom: 20px!important;
	}
</style>