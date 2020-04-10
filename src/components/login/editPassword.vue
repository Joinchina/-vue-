<template>
	<div class="wrapper">
        <header  class="header">
        	<button  @click="modifyWord = true" class="btn-edit-word">
	            <i class="icon-edit-word"></i>
	            一健修改新密码
          	</button>
        </header>
        <div class="clear"></div>
        <div class="wtab-cont" id="worgList">
			<el-table class=""
				:empty-text = "loadText"
				:data = "getListArray"
				stripe>
				<el-table-column
					prop="username"
					label="账号"
					width="250">
				</el-table-column>
				<el-table-column
					prop="organizationName"
					label="所属机构"
					width="250"
					>
				</el-table-column>
				<el-table-column
					prop="projectName"
					label="所属项目"
					width="250">
				</el-table-column>
				<el-table-column
					prop="clazzName"
					label="所属班级">
				</el-table-column>

			</el-table>

		</div>

		<!-- 创建专家 -->
	    <modify
	      :dialogModifyWord.sync="modifyWord"></modify>
    </div>
</template>
<script>
	import model from '@/model/login/login';
	import storage from '@/global/storage';
	import modify from '@/components/login/modify';
	export default{
		data(){
			return{
				getListArray:[],
				loadText:"",
				modifyWord:false
			}
		},
		created(){
			this.getList();
		},
		methods:{
			getList(){
				let userId = Number(storage.get("exp_userId"));
				console.log(typeof userId);
				let data = {
					userId:userId
				}
				model.userListByPhone(data,(res=>{
					this.getListArray = res.data;
					if(this.getListArray.length == 0){
						this.loadText = this.$globalParam.dataEmpty;
						return;
					}
				}))
			}
		},
		components:{
			modify
		}
	}
</script>
<style lang="less" scoped>
	@import "../../assets/less/icon.less";
	@import "../../assets/reset-element-ui/user-table.css";
	.header{
		float: right;
		max-width: 1190px;
		margin-top: 20px;
		margin-bottom: 15px;
	}
	#worgList{
		background-color: #fff;
	    border: 1px solid #f0f0f0;
	    border-radius: 6px;
	    box-shadow: -2px 0 3px #f0f0f0,
	    2px 0 3px #f0f0f0,
	      0 -2px 3px #f0f0f0,
	    0 2px 3px #f0f0f0;
	    padding:16px 30px;
	}
	.icon-edit-word{
		vertical-align: text-bottom;
	}
</style>