<template>
	<div class="refusePop">
		<!-- 创建班级 -->
	    <el-dialog v-loading="loading" class="dialog-form w-wang" title="请填写拒绝理由" :visible.sync="dialogRefuse" :close-on-click-modal=false :before-close="closeCreate" @open="open">
            <p class="hintText">确认拒绝后，学员将收到被拒绝的短信提醒</p>
	      	<el-form ref="numberValidateForm" label-width="50px">
                <el-form-item>
                    <el-radio v-model="refuseItem" label="非班级学员"></el-radio>
                </el-form-item>
                <el-form-item>
                    <el-radio v-model="refuseItem" label="学员信息有误"></el-radio>
                </el-form-item>
                <el-form-item>
                    <el-radio v-model="refuseItem" label="其他"></el-radio>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="refuseReason" type="textarea" :autosize='true'  placeholder="请填写拒绝理由" maxlength=100></el-input>
                    <span class="wordsCount">字数：<b>{{refuseReason.length}}</b>/100</span>
                </el-form-item>
	        </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveRefuse">确定</el-button>
                <el-button  @click="closeCreate">取消</el-button>
            </div>
	    </el-dialog>
	    <!-- /创建班级 -->
	</div>
</template>
<script>
	import basicInfo from './info'
    import signUpHttp from '@/model/clazz/signUp'
	export default {
	    data() {
		    return {
                loading: false,
                refuseItem:"",
                refuseReason:"",
		    }
	    },

	    props: ['dialogRefuse','tableSelect','refuseOne','refuseFlag'],
	   	mounted() {
			   
	   	},
	    methods: {
		    open() {
				console.log(this.refuseFlag);
		    },
		    saveRefuse(){
                this.loading=true;
                let data ={
                    clazzId:this.$route.query.clazzId,
                };
                if(Boolean(this.refuseReason.trim())){
                    data.reason = this.refuseReason.trim()
                }else{
                    data.reason = this.refuseItem
                }
                if(this.refuseFlag){
                    data.identification = this.refuseOne.identification;
                    signUpHttp.refuseSingle(data,(res)=>{
                        this.loading=false;
                        if(res.status==200){
                            this.closeCreate();
                            this.$emit('updateInfo');
                        }else{
                            this.$message.error(res.message);
                        }
                        
                    })
                }else{
                    data.ids=[];
                    this.tableSelect.forEach(item=>{
                        data.ids.push(item.identification);
                    })
                    signUpHttp.batchRefuse(data,(res)=>{
                        this.loading=false;
                        if(res.status==200){
                            this.closeCreate();
                            this.$emit('updateInfo');
                            this.$message.success('成功拒绝'+res.data+'名学员');
                        }else{
                            this.$message.error(res.message);
                        }
                        
                    })
                }
                
            },

		    closeCreate () {
                this.refuseItem="";
                this.refuseReason="";
                this.$emit('update:dialogRefuse', false);
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
    .hintText{
        font-size: 16px;
        color: #333333;
        text-indent: 50px;
        margin-bottom: 20px;
    }
    .wordsCount{
        font-size: 14px;
        color: #A3B1C5;
        position: absolute;
        bottom: 0px;
        left: 300px;
        b{
            font-weight: normal;
            color: #FEA668;
        }
    }
</style>
<style>
    .refusePop .el-form-item{
        margin-bottom: 0px;
    }
    .refusePop .dialog-form .el-textarea__inner,.refusePop .el-textarea{
        width: 400px;
        min-height: 120px !important;
    }
</style>
