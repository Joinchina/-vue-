<style scoped lang="less">
	@import "../../../assets/reset-element-ui/form.css";

</style>
<template>
	<div class="wsetTime">
		<el-dialog  class="dialog-form" title="时间设置"
		:visible.sync="dialogSetTimehomework"
		:close-on-click-modal="false"
		:before-close="close">
		<el-form :model="ruleSetTime" :rules="rules" ref="ruleSetTime">
			<el-form-item label="作业标题：" :label-width="labelWidth">
				<p>{{title}}</p>
			</el-form-item>
			<el-form-item label="作业说明：" :label-width="labelWidth">
				<p>{{content}}</p>
			</el-form-item>
			<el-form-item label="开始时间：" :label-width="labelWidth">
                <!-- <el-date-picker
				v-model="beginTime"
				type="date"
				:placeholder="beginTime"
				:disabled=true
				>
			    </el-date-picker> -->
				<p>{{beginTime}}</p>
			</el-form-item>
			<el-form-item label="截止时间：" :label-width="labelWidth" >
				<el-date-picker
				v-model="ruleSetTime.date"
				type="date"
				placeholder="永久"
				:picker-options="pickerOptions0">
			    </el-date-picker>
		   </el-form-item>
		   <el-form-item label="" :label-width="labelWidth" style="margin-top:-30px;color:#999999">
				<p>注意：进行中的作业只能修改截止时间</p>
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
				labelWidth: "130px",
				title: '',
                content: "",
                beginTime:""
			}
		},
		props: ['dialogSetTimehomework', 'activityId'],
		created() {

			if(!!this.activityId) {
				this.getDisDetail();
			}
		},
		methods: {
			close () {
				this.$emit('update:dialogSetTimehomework', false);
            },
            // 获取数据
			getDisDetail(){
				//console.log("activityId-dis",this.activityId);
				let data = {
					activityId: this.activityId
				}
				model.getDisDetail(data, ( res => {
					// console.log("getDisDetail",res)
					if(res.status == 200) {
						this.title = res.data.title;
                        this.content = res.data.content;
                        this.beginTime=res.data.beginTime;
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

            // 设置结束时间
			setDate() {
				let setDate = "";
				if(this.ruleSetTime.date) {
					let d = new Date(this.ruleSetTime.date);
					setDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
				}

				let data = {
					endTime: setDate,
                    activityId: this.activityId,
                    beginTime:this.beginTime
				}

				model.setworkEndtime(data, (res=> {
					if(res.status == 200) {
						this.$emit("updateCont", data);
						this.open2();
						this.close();
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			open2(){
				this.$message({
				message: '恭喜你，作业结束时间更新成功',
				type: 'success'
				});
			}
		},

		watch: {
			activityId: 'getDisDetail'
		}

	}
</script>
