<template>
	<div class="content">
		<section class="handle clearfix">
			<Goback passtitle="日志任务要求" ></Goback>
			<p class="right">
				<button class="btn-green" type="button" @click="submitForm('ruleForm')">
					<i class="icon-issue"></i>
					发布
				</button>
			</p>
		</section>

		<section class="round-layout j-cont">
			<div class="j-title">
				<span class="left-line">日志任务要求</span>
			</div>

			<div class="box">

				<el-form :label-position="labelPosition" :rules="rules" label-width="80px" :model="ruleForm"  ref="ruleForm" class="record-form-edit">
					  <el-form-item prop="minCountLimit" label="日志篇数:">
					    <el-input v-model.number.trim="ruleForm.minCountLimit" ></el-input>
					  </el-form-item>
					  <el-form-item prop="word" label="最低字数要求:">
					    <el-select v-model="ruleForm.minWordLimit" placeholder="200">
					      <el-option label="200" value="200"></el-option>
					      <el-option label="300" value="300"></el-option>
					      <el-option label="400" value="400"></el-option>
					    </el-select>
					  </el-form-item>
					  <el-form-item prop="endDate" label="日期:">
					     <el-date-picker
				            v-model="currentEndDate"
				            value-format="yyyy-MM-dd"
				            type="date"
				            placeholder="永久"
				            :picker-options="pickerOptions0">
          				</el-date-picker>
					  </el-form-item>
				</el-form>

			</div>
		</section>

		<!--日志内容-->
		<section class="j-cont">

			<div class="j-title none">
				<span class="left-line">日志内容提纲</span>
				<p>提示:师训宝为了帮助学员更好撰写培训日志，参考了上万份日志要求，设计了如下日志内容提纲。</p>
				<ul class="list">
					<li v-for = "(item,index) in outline">
						{{item.content}}
					</li>
				</ul>
			</div>

		</section>
	</div>
</template>

<script>
	import Empty from '@/base/empty/empty'
	import model from '@/model/clazz/dailyrecord'
	import Goback from 'base/goback/goback'
	export default{
		data(){
			var numberLog = (rule, value, callback) => {
				console.log(value)
				if (value === "") {
					return callback(new Error('日志篇数不能为空'));
				}else{
					if(!Number.isInteger(value)){
						callback(new Error('请输入数字'));
					}else{
						callback();
					}
				}
      };
			return{
				pickerOptions0: {
			          disabledDate(time) {

			            return time.getTime() < Date.now();
			          }
        		},
				labelPosition: 'left',
				clazzId:"",

				outline:[],
				currentEndDate:"",
				ruleForm: {
		          minCountLimit: 0,
		          minWordLimit: 200,
		          endDate:"永久",
		        },
		        rules: {
		        	 minCountLimit: [
			            {validator: numberLog,trigger: 'blur'}
          			 ]
		        },
			}
		},
		computed:{
			
		},
		created(){
			this.clazzId = this.$route.query.clazzId;

			//获取任务要求
			this.getTaskData();

		},
		methods:{

			getTaskData(){

				let data = {
					clazzId:this.clazzId
				}
				model.getUserlogRule(data,(res) =>{

					if(res.status == 200){

						let data = res.data;

						this.ruleForm.minCountLimit = data.minCountLimit;
						this.ruleForm.minWordLimit = data.minWordLimit;
						this.currentEndDate = data.endDate ? data.endDate : '';
						this.outline = data.outline;


					}else{
						this.$message.error(res.message);
					}
				})
			},
			submitForm(formName){
				this.$refs[formName].validate((valid) => {

			          if (valid) {
			            console.log('submit!');
			            this.userLogUpdate();
			          } else {
			            console.log('error submit!!');
			            return false;
			          }
        		});
			},
			userLogUpdate(){

				let endDate = this.currentEndDate;
				let data = {
					clazzId:this.clazzId,
					minCountLimit:parseInt(this.ruleForm.minCountLimit),
					minWordLimit:parseInt(this.ruleForm.minWordLimit),
					endDate:endDate
				}
				console.log(data);
				model.getUserlogUpdate(data,(res)=>{
					if(res.status == 200){

						this.$message.success("发布成功");

						this.$router.push({
							path:"/clazz/dailyrecord/list",
							query:{
								clazzId:this.clazzId
							}
						})
					}else{
						this.$message.error(res.message)
					}
				})
			}
		},
		components:{
			Empty,
			Goback
		}

	}
</script>

<style lang="less" scoped="">
	@import "../../../assets/less/report.less";
	@import "../../../assets/less/icon.less";
	@import "../../../assets/reset-element-ui/form-reset.css";
	@import "../../../assets/less/btn-search.less";
	.btn-green{
			display: inline-block;
			font-size: 16px;
			line-height: 1em;
			color: #FFFFFF;
			letter-spacing: 0;
			background: #35A69D;
			padding: 10px 20px;
			&::after{
				display: none;
			}
    }
    .j-cont{
    	padding-left:20px;
    	padding-top: 5px;

    	.j-title{
    		padding: 20px 0;
    		border-bottom: 1px solid #e6e6e6;
    		.right{
    			float: right;
    			margin-top: 15px;
    			margin-right: 28px;
    			color: #FD7E23;
    			font-size: 18px;
    			display: inline-block;
    			i{
    				vertical-align: middle;
    			}
    		}
    		p{
    			color: #666;
    			margin: 14px 0 33px 20px;
    			font-size: 14px;
    		}
    	}
    	.none{
    		border-bottom: none;
    		.list{
    			margin-top: 28px;
    			margin-left: 28px;
    			
    			li{
    				color: #333;
    				margin-bottom: 24px;
    				font-size: 18px;
    			}
    		}
    	}
    	.left-line{
    		margin: 0 20px;
    	}
    	.box{
    		width: 40%;
    		margin-left: 20px;
    		padding: 30px 0;
    		li{
    			line-height: 40px;
    			color: #666;
    			padding: 0 13px;
    			font-size: 18px;
    		}
    	}
    	.stubox{
    		padding: 0 10px;

    		.every{
    			border-bottom: 1px solid #e6e6e6;
    			padding-top: 20px;
    			padding-bottom: 20px;
    			padding-left: 20px;
    			margin-bottom: 20px;
    			.logo{
	    				float: left;
	    				vertical-align: middle;
	    			}
	    			.con{
	    				float:left;
	    				padding-left: 17px;
	    				h2{
	    					color: #333;
	    					font-size: 18px;
	    				}
	    				p{
	    					color: #999;
	    					padding-top: 10px;
	    				}
	    			}
	    			.letter{
	    				margin-top: 21px;
	    				width: 40%;
	    				display: -webkit-box;
	    				overflow: hidden;
				        text-overflow:ellipsis;
				        display:-webkit-box;
				        -webkit-box-orient:vertical;
				        -webkit-line-clamp:3;
				        color: #666;
				        line-height: 22px;
	    		    }
    		}
    		
    	}
    }
</style>