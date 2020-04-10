<style scoped lang="less">
	#waddSucc {
		img {
			display: block;
			width: 136px;
			height: 121px;
			margin: 0 auto;
		}
		.tip {
			font-size: 20px;
			color: #35a69d;
			line-height: 1.6em;
			margin-bottom: 30px;
		}
		dt {
			text-align: center;
		}
		dl {

			overflow: hidden;
			
		}
		dd {
			display: block;
			margin: 0 auto;
			width: 400px;
			font-size: 16px;
			color: #333;
			line-height: 1.6em;
			text-align: left;
			margin-left: 200px; 
		}
	}
</style>
<template>
	<div id="waddSucc">
		<el-dialog class="dialog-form" 
			:title="title"
			:visible.sync="dialogAddSucc" 
			:close-on-click-modal="false"
			:before-close="close">
			
			<dl>
				<dt>
					<img src="../../assets/img/common/pic-succ.png" alt="">
					<h1 class="tip">新增成功</h1>
				</dt>
				<dd>
					姓名：{{name}}
				</dd>
				<dd>
					账号：{{username}}
				</dd>
				<dd>
					默认密码：{{userPassword}}
				</dd>
			</dl>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="close">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import model from 'model/user/user_manage'

	export default {
		data() {
			return {
				
				
			}	
		},

		props: ['dialogAddSucc','title','username','name','userPassword'],

		methods: {
			close() {
				this.$emit('update:dialogAddSucc', false);
			}
		}
	}
</script>