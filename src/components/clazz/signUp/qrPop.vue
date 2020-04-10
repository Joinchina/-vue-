<template>
	<div>
		<!-- 创建班级 -->
	    <el-dialog v-loading="loading" class="dialog-form w-wang qrpop" title="报名二维码" :visible.sync="dialogSuccess" :close-on-click-modal=false :before-close="closeCreate" @open="open">
	      	<success ref="basicInfo" :setInfo="setInfo" :popView='true'></success>
	        
            
	    </el-dialog>
	    <!-- /创建班级 -->
	</div>
</template>
<script>
	import success from './success'

	export default {
	    data() {
		    return {
                loading: false,
		        
		    }
	    },

	    props: ['dialogSuccess','setInfo'],
	   	mounted() {
			   
	   	},
	    methods: {
		    open() {

		        
				
		    },
		    saceEdit(){
                this.$emit('update:dialogSuccess', false);
            },

		    closeCreate () {
		    	this.$emit('update:dialogSuccess', false);
		    },
	     

        },
        components:{
            success,
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
<style lang="less">
  .qrpop{
    .el-dialog__body {
      max-height: 600px;
    } 
  }
</style>