<template>
	<div>
		<!-- 创建班级 -->
	    <el-dialog v-loading="loading" class="dialog-form w-wang" title="编辑报名信息" :visible.sync="dialogBasicInfo" :close-on-click-modal=false :before-close="closeCreate" @open="open">
	      	<basicInfo ref="basicInfo" :setInfo="setInfo"></basicInfo>
	        
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saceEdit">确定</el-button>
                <el-button  @click="closeCreate">取消</el-button>
            </div>
	    </el-dialog>
	    <!-- /创建班级 -->
	</div>
</template>
<script>
	import basicInfo from './info'

	export default {
	    data() {
		    return {
                loading: false,
		        
		    }
	    },

	    props: ['dialogBasicInfo','setInfo'],
	   	mounted() {
			   
	   	},
	    methods: {
		    open() {

		        
				
		    },
		    saceEdit(){
                // this.loading=true;
                this.$refs.basicInfo.submitForm(()=>{
                    // this.loading=false;/
                    this.$emit('update:dialogBasicInfo', false);
                    this.$emit('updateInfo');
                })
            },

		    closeCreate () {
		    	this.$emit('update:dialogBasicInfo', false);
		    },
	     

        },
        components:{
            basicInfo,
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