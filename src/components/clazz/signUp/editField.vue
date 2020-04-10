<template>
	<div>
		<!-- 创建班级 -->
	    <el-dialog v-loading="loading" class="dialog-form w-wang editFieldsPop" title="编辑报名字段" :visible.sync="dialogField" :close-on-click-modal=false :before-close="closeCreate" @open="open">
	        <fieldEle ref="fieldEle" :setInfo="setInfo"></fieldEle>
	        
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saceEdit">确定</el-button>
                <el-button  @click="closeCreate">取消</el-button>
            </div>
	    </el-dialog>
	    <!-- /创建班级 -->
	</div>
</template>
<script>
	import fieldEle from './field'

	export default {
	    data() {
		    return {
                loading: false,
		        
		    }
	    },

	    props: ['dialogField','setInfo',"totalCounts"],
	   	mounted() {
			   
	   	},
	    methods: {
		    open() {

		        
				
		    },
		    saceEdit(){
				this.$confirm('您的报名计划已经有'+this.totalCounts+'份回收数据，增加、删除字段，会导致用户已经填写的信息丢失或者信息空白。确定要继续编辑吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.loading=true;
					this.$refs.fieldEle.setFields(true,()=>{
						
						setTimeout(()=>{
							this.$emit('updateInfo');
							this.$emit('updateInfofiled');
							this.loading=false;
							this.$emit('update:dialogField', false);
						},1000)
						
					})
				}).catch(() => {});
                
            },

		    closeCreate () {
		    	this.$emit('update:dialogField', false);
		    },
	     

        },
        components:{
            fieldEle,
        },

	}
</script>
<style scoped lang="less">
  	@import "../../../assets/reset-element-ui/form.css";
  	.w-wang {
      	.text {
         	width: 100%;
          	height: 200px;
          	border: 1px solid #F2F0F0;
      	}
      	.toolbar {
          	width: 100%;
          	background: #FCFDFF;
          	border: 1px solid #F2F0F0;
          	height: 50px;
      	}
      	.w-e-toolbar{
          	.w-e-menu{
              	padding: 17px 10px;
          	}
      	} 
  	}
  	.line{
        float:left;
        margin: 0 10px;
        color: #a3b1c5;
    }
    .sign-time{
        float: left;
    }
    .sign-time-r{
        padding-left: 8px;
    }
</style>

<style>
	.editFieldsPop .el-dialog{
		max-width: 780px;
	}
</style>
