<style scoped lang="less">
	#wselClass {
		
		.class-box {
			border: 0;
			padding: 0 20px;
		}
	}
</style>
<template>
	<div id="wselClass">
		<el-dialog class="dialog-form"
			title="选班"
			:visible.sync = "dialogSelClass"
			:close-on-click-modal="false"
			:before-close="close"
			@open="open"
			>
			
			<div class="class-box">
				<el-tree class="class-box"
					:data="classList"
					show-checkbox
					default-expand-all
					node-key="clazzId"
					ref="tree"
					:default-checked-keys="selKeys"
					
					:props="defaultProps">		
				</el-tree>

				
			</div>
			<div slot="footer" class="dialog-footer">
				
				<el-button type="primary" @click="selClass">确定</el-button>
				<el-button @click="close">关闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import model from 'model/user/user_manage'

	export default {
		data() {
			return {
				classList: [],
				defaultProps: {
					children: 'children',
          			label: 'label'
				},
				selKeys: []
				
			}
		},
		props: ['dialogSelClass', 'orgId', 'role', 'userId'],
		created(){

		},
		computed: {
			
		},
		methods: {
			open() {
				if(this.userId) {
					this.getClass();
				}
			},
			getCheckedKeys() {
	        	// console.log(this.$refs.tree.getCheckedKeys());
	      	},
			getClass () {
				

				let data = {
					organizationId: this.orgId,
					userId: this.userId
				}

				model.ClassSelect (data, ( res => {
					if (res.status == 200) {
						// console.log("ccccccc",res.data)
						
						res.data.forEach( (val) => {
							
							val.id = val.projectId;
							val.label = val.projectName;
							val.children = val.clazzList;
							val.clazzList.map(item => {
								item.id = item.clazzId;
								item.label = item.clazzName;

								if(item.isSelect) {
									this.selKeys.push(item.clazzId);
								}
							}) 

							

						});
						// console.log("selKeys",this.selKeys);
						this.classList = res.data;
						console.log("classList",this.classList);
						
						
					} else {
						this.$message.error(res.message);
					}
				}));

				
			},
			close () {
				// 清空上次选中的班级
				this.selKeys = [];
				this.$emit('update:dialogSelClass', false);

			},
			
			selClass() {
				let classIds = this.$refs.tree.getCheckedKeys();
				this.selKeys = [];

				classIds.forEach(val => {
					if(val) {
						this.selKeys.push(val);
					}
				});
				console.log("classIds",classIds);
				console.log("sel ", this.selKeys);
				
				let data = {
					userId: this.userId,
					ids: this.selKeys
				}
				// console.log("data selKeys",data);
				model.joinClass(data, ( res => {
					if(res.status == 200) {
						this.close();
						this.$emit("updateClassList");
						
					} else {
						this.$message.error(res.message);
					}
				}));
			},
		},
		// watch: {
		// 	userId: 'getClass'
		// }
	}
</script>