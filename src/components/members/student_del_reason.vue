<template>
  <div class="j-del-reason">
      <el-dialog class="dialog-form" title="删除原因"
                 :visible.sync="dialogDelStudent"
                 :close-on-click-modal="false"
                 :before-close="close"
                 @open="open">

         <!--删除原因-->
          <div class="reason">
	          <div class="errorMsg" style="display: none">请选择加分原因</div>
	          <ul class="clearfix reason-ul">
	            <li 
	            	v-for="(item,index) in reasonArray"
	            	:class="{active:curIndex === index}" 
	            	@click="checkedTab(index)">
	                {{item.name}}
	            </li>
	          </ul>

	          <div class="remarks">
		          <el-input
					  type="textarea"
					  :autosize="{ minRows: 2, maxRows: 2 }"
					  placeholder="请输入内容"
					  v-model="textarea">
				  </el-input>
			  </div>


      	  </div>
          <div slot="footer" class="dialog-footer">
	          <el-button type="primary" @click="submitForm()">删除</el-button>
	          <el-button @click="close">关闭</el-button>
          </div>
      </el-dialog>
  </div>
</template>
<script>
  import model from 'model/clazz/integral'
  import bus from "@/global/bus";
  import members from '@/model/members/members';
  import userManager from '@/model/user/user_manage';
  export default {

  	props:["dialogDelStudent","userId"],

    data(){
	    return {
	    	textarea:"",

	    	curIndex:"",
	    	curCode:"",

	    	reasonArray:[],
	    	// reasonArray:[
	    	// 	{
	    	// 		value:"替换",
	    	// 		code:"tihuan"
	    	// 	},
	    	// 	{
	    	// 		value:"请假",
	    	// 		code:"qingjia"
	    	// 	},
	    	// 	{
	    	// 		value:"未报到",
	    	// 		code:"weibaodao"
	    	// 	},
	    	// 	{
	    	// 		value:"信息错误",
	    	// 		code:"xinxicuowu"
	    	// 	},
	    	// 	{
	    	// 		value:"其他",
	    	// 		code:"qita"
	    	// 	},
	    	// ]
	    }
    },
    watch:{
    	userId(){
    		this.studentDeletedReasonList();
    	}
    },
    created(){
    	this.studentDeletedReasonList();
    },
    methods: {
    	open(){


    	},

    	//获取删除原因
    	studentDeletedReasonList(){
    		let data = {

    		}
    		members.studentDeletedReasonList(data,(res=>{
    			console.log(55555);
    			if(res.status == 200){
    				this.reasonArray = res.data;

    			}else{
    				this.$message.error(res.message)
    			}
    		}))
    	},

    	checkedTab(index){
    		this.curIndex = index;

    		this.curCode = this.reasonArray[index]["code"];

    	},
		close(){
			 this.$emit('update:dialogDelStudent', false);
		},
		submitForm(){

			if(this.curCode == ""){
				this.$message.error("请选择删除原因");
				return;
			}

			if(this.textarea.length > 50){
				this.$message.error("最多50字");
				return;
			}

			let data = {
				id:this.userId,
				reason:this.curCode,
				remark:this.textarea
			}

			userManager.deleteUser(data,(res =>{
				if(res.status == 200){


					this.$message({
						message: '删除成功',
						type: 'success'
					});

					this.$emit("delStudent");

					//清空数据
					this.reasonArray = [];
		    		this.textarea = "";
			    	this.curIndex = "";
			    	this.curCode = "";

			    	this.close();

				}else{

					this.$message.error(res.message);

				}
			}))
			

		}
    }
  }
</script>
<style scoped="" lang="less">
.j-del-reason{
	.reason{
		width: 50%;
		margin: 0 auto;
	}
	.reason-ul{
	    margin-bottom: 8px;
	    margin-top:18px;
	    	li{
	    		float: left;
				margin-right: 26px;
				margin-bottom: 16px;
				border:1px solid #90cec9;
				width: 114px;
				color:#333;
				text-align: center;
				font-size: 14px;
				border-radius: 4px;
				background: #fcfcfc;
				line-height: 42px;
				height: 42px;
				cursor:pointer;
				display: inline-block;
				&:hover{

		    		background:#5fa9f6;
		  			border:1px solid #3f99f6;
		  			color: #fff;

	    		}
	    		
	    	}
	    	.active{

		  		   background:#5fa9f6;
		  		   border:1px solid #3f99f6;
		  		   color: #fff;
			}
		
		}
		.remarks{
			width: 92%;
		}
}


</style>
