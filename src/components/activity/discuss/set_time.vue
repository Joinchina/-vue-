<style scoped lang="less">
	@import "../../../assets/reset-element-ui/form.css";
</style>
<template>
	<div class="wsetTime">
		<el-dialog  class="dialog-form" title="时间设置"
		:visible.sync="dialogEditTime"
		:close-on-click-modal="false"
		:before-close="close">
		<el-form :model="ruleSetTime" :rules="rules" ref="ruleSetTime">
			<el-form-item label="标题：" :label-width="labelWidth">
				<p>{{title}}</p>
			</el-form-item>
			<el-form-item label="说明：" :label-width="labelWidth">
				<p>{{content}}</p>
			</el-form-item>
			<el-form-item label="截止时间：" :label-width="labelWidth" prop="date">
				<el-date-picker
				v-model="ruleSetTime.date"
				type="date"
				placeholder="永久"
				:picker-options="pickerOptions0">
			</el-date-picker>
		</el-form-item>

	</el-form>
	<div slot="footer" class="dialog-footer">
		<el-button type="primary" @click="setDate">确定</el-button>
		<el-button @click="close">关闭</el-button>
	</div>
</el-dialog>
</div>
</template>
<script>
	import model from 'model/activity/discuss'
	export default {
		data () {
			return {
				pickerOptions0: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7;
					}
				},
				ruleSetTime: {
					date: ''
				},
				rules: {
					// date: [
					// { type: 'date', message: '请选择结束日期', trigger: 'change'}
					// ]
				},
				labelWidth: "120px",
				title: '',
				content: ""
			}
		},
		props: ['dialogEditTime', 'activityId'],
		created() {

			if(!!this.activityId) {
				this.getDisDetail();
			}
		},
		methods: {
			close () {
				this.$emit('update:dialogEditTime', false);
			},
			getDisDetail(){
				//console.log("activityId-dis",this.activityId);
				let data = {
					activityId: this.activityId
				}
				model.getDisDetail(data, ( res => {
					//console.log("getDisDetail",res)
					if(res.status == 200) {
						this.title = res.data.title;
						this.content = res.data.content;
						if(res.data.endTime) {
							this.ruleSetTime.date = new Date(res.data.endTime);
						} else {
							this.ruleSetTime.date = "";
						}

					} else {
						this.$message.error(res.message);
					}
				}));

			},


			setDate() {
				let setDate = "";
				if(this.ruleSetTime.date) {
					let d = new Date(this.ruleSetTime.date);
					setDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
				}

				let data = {
					endTime: setDate,
					activityId: this.activityId
				}

				model.setDisdussTime(data, (res=> {
					// console.log("setDisdussTime",res)
					if(res.status == 200) {
						this.close();
						// this.ruleSetTime.date = "";
						// this.$emit("updateList");
					} else {
						this.$message.error(res.message);
					}
				}));
			}
		},

		watch: {
			activityId: 'getDisDetail'
		}

	}
</script>
