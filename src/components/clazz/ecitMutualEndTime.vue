<style scoped lang="less">
	@import "../../assets/reset-element-ui/form.css";

</style>
<style lang="less">
    .reviewHomeWorkEndTimeError.el-form-item.is-error{
        margin-bottom: 40px;
	}
	.editMutualTime{
		.mutualIntro{
			.el-form-item__label,.el-form-item__content p{
				line-height: 30px;
			}
		}
	}
</style>

<template>
	<div class="wsetTime">
		<el-dialog  class="dialog-form editMutualTime" title="时间设置"
		:visible.sync="dialogSetTimeMutual"
		:close-on-click-modal="false"
		:before-close="close">
		<el-form :model="ruleSetTime" :rules="rules" ref="ruleSetTime">
			<el-form-item label="作业标题：" :label-width="labelWidth">
				<p>{{title}}</p>
			</el-form-item>
			<el-form-item label="作业说明：" :label-width="labelWidth" class="mutualIntro">
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
			<el-form-item label="作业提交截止时间：" :label-width="labelWidth" prop="endTime">
				<el-date-picker
				v-model="ruleSetTime.endTime"
				type="date"
				placeholder="永久"
				:picker-options="pickerOptions0">
			    </el-date-picker>
		   </el-form-item>
           <el-form-item label="评阅截止时间：" :label-width="labelWidth" prop="reviewHomeWorkEndTime" class="reviewHomeWorkEndTimeError">
				<el-date-picker
				v-model="ruleSetTime.reviewHomeWorkEndTime"
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
    import model from 'model/activity/mutual'
	export default {
		data () {
            let validateEndTime = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请选择作业提交截止日期'));
                } else {
                    callback();
                }
            };
            let validateEndTimeReview = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请选择评阅截止日期'));
                } else if (value <=this.ruleSetTime.endTime) {
                    callback(new Error('评阅截止日期必须大于作业提交截止日期!'));
                } else {
                    callback();
                }
            };
			return {
				pickerOptions0: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7;
					}
				},
				ruleSetTime: {
                    endTime: '',
                    reviewHomeWorkEndTime:""
                    
				},
				rules: {
					endTime:[
                        { required: true, validator: validateEndTime,}
                    ],
                    reviewHomeWorkEndTime:[
                        { required: true, validator: validateEndTimeReview,}
                    ]
				},
				labelWidth: "170px",
				title: '',
                content: "",
                beginTime:""
			}
		},
		props: ['dialogSetTimeMutual', 'activityId'],
		created() {

			if(!!this.activityId) {
				this.getDisDetail();
			}
		},
		methods: {
			close () {
				this.$emit('update:dialogSetTimeMutual', false);
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
                            this.ruleSetTime.endTime = new Date(res.data.endTime); 
                            this.ruleSetTime.reviewHomeWorkEndTime = new Date(res.data.reviewHomeWorkEndTime);
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
                this.$refs["ruleSetTime"].validate((valid) => {
					if (valid) {
						let setDate = "";
                        if(this.ruleSetTime.endTime) {
                            let d = new Date(this.ruleSetTime.endTime);
                            setDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
                        }
                        let setReviewDate = "";
                        if(this.ruleSetTime.reviewHomeWorkEndTime) {
                            let d = new Date(this.ruleSetTime.reviewHomeWorkEndTime);
                            setReviewDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
                        }

                        let data = {
                            endTime: setDate,
                            reviewHomeWorkEndTime:setReviewDate,
                            activityId: this.activityId,
                            beginTime:this.beginTime
                        }

                        model.setMutualEndtime(data, (res=> {
                            if(res.status == 200) {
                                this.$emit("updateCont", data);
                                this.open2();
                                this.close();
                            } else {
                                this.$message.error(res.message);
                            }
                        }));
						
					} else {
						console.log('error submit!!');
						return false;
					}
				});
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
