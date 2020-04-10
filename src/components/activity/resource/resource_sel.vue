<template>
	<div>
		<el-dialog class="dialog-form wsel-res"
			title="选择资源"
			filterable
			:visible.sync="dialogRes"
			:close-on-click-modal="false"
			:before-close="close"
			@open="open">
			<div class="res-sel">
				<el-transfer
					filterable
					filter-placeholder="请选择资源列表"
					v-model="value"
					:data="data"
					@change="handleChange"
					:titles="['资源列表', '已选资源列表']">
				</el-transfer>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm">确定</el-button>
        		<el-button @click="close">关闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import resource from 'model/resource/resource'
	export default {
		data() {
			return {
				confirmData:[],   // 选中的资源
				data: [],	//全部资源
				value: [],	//选中的value
			}
		},
		computed: {
			clazzId() {
				return this.$route.query.clazzId
			}
		},
		props:["dialogRes", "empty","sel"],
		mounted() {
			this.getResource();
		},
		methods: {
			open() {
				if(this.empty) {
					this.value = [];
				}
				this.confirmData = this.sel ? this.sel : this.confirmData;
				console.log("clazzId",this.clazzId);
			},
			close() {
				this.$emit('update:dialogRes', false);
			},
		    getResource() {
		    	let data = {
		    		clazzId: this.clazzId
		    	}
		    	resource.resRelateClazz(data, (res => {
		    		// console.log("资源列表",res)
		    		if(res.status == 200) {
		    			this.allRes(res.data)
		    		} else {
		    			this.$message.error(res.message);
		    		}
		    	}));
		    },
		    // 所有资源
		   	allRes(data) {
		   		data.forEach((item, index) => {
		   			this.data.push({
		   				label: item.name,
		   				key: item.id,
		   				type: item.type
		   			});
		   		});
		   	},
		   	handleChange(value, direction, movedKeys){
		    	console.log("handleChange-value" , value);
		    	console.log("handleChange-direction" , direction);
		    	console.log("handleChange-movedKeys" , movedKeys);
		    	// 选中的数据
		    	
		    	this.confirmData = [];
		    	this.data.map((item) => {
		    		value.map((key) => {
		    			if(item.key == key) {
			    			// console.log("value-key",  key);
			    			// console.log("data-item",  item);

			    			this.confirmData.push({
			    				id: item.key,
			    				name: item.label,
			    				type: item.type
			    			})
		    			}
		    		})
		    		
		    	});
		    	console.log("confirmData", this.confirmData);

		    },
		   	// 已选资源
		   	selRes() {

		   	},
			submitForm(){
		        //小组成员添加 - 选择成员
		       
		        this.$emit("resSelectData",this.confirmData);
		        this.confirmData = [];
		        this.close();
		    },
		}
	}
</script>
<style scoped lang="less">
	 @import "../../../assets/reset-element-ui/form.css";
	 .res-sel {
	 	width: auto;
	 	margin: 0 auto;
	 }
</style>