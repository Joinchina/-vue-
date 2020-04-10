<template>
	<div>

	    <el-dialog class="dialog-form j-dialog-form" title="时间设置"
               :visible.sync="dialogSetTime"
               :close-on-click-modal="false"
               :before-close="close"
               @open="open">

          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-loading="loading"
             element-loading-text="拼命加载中">

	        	<el-form-item label="签到日期：" :label-width="labelWidth" prop="signDate">
							<el-date-picker
								v-if="taskStatus == 'waiting'"
								v-model="ruleForm.signDate"
								type="date"
								placeholder="选择日期"
								value-format="yyyy-MM-dd"
								:picker-options="pickerOptions0"
								@change="changeData">
							</el-date-picker>
			    	<span v-else>{{ruleForm.signDate}}</span>
			    </el-form-item>

			    <el-form-item label="开始时间：" :label-width="labelWidth" prop="beginTime">
						<el-time-picker  
							v-if="taskStatus == 'waiting'"
							v-model="ruleForm.beginTime"
							:picker-options="pickerStart"
							format="HH:mm"
							value-format="HH:mm"
							placeholder="开始时间">
						</el-time-picker>
			    	<span v-else>{{ruleForm.beginTime}}</span>
			    </el-form-item>

			    <el-form-item label="结束时间：" :label-width="labelWidth" prop="endTime">
			    	<el-time-picker
		            prop="endTime"
		            v-model="ruleForm.endTime"
		            format="HH:mm"
		            :picker-options="pickerEnd"
		            placeholder="结束时间">
		          </el-time-picker>
			    </el-form-item>

			    <p>注意：已经开启的签到，只能修改结束时间</p>

			</el-form>
			 
			<div slot="footer" class="dialog-footer">

			    <el-button type="primary"  @click="!loading && submitForm('ruleForm')">确定</el-button>
			    <el-button @click="close">关闭</el-button>

    		</div>

        </el-dialog>

	</div>
</template>
<script>

	import model from 'model/clazz/signin'
	import {dateFormatTime} from '@/global/open'
    export default {

    	props:["dialogSetTime","beginTime","signDate","endTime","sSignId","taskStatus"],

    	data(){
				let validateBeginTime  = (rule, value, callback) => {
					if (!Boolean(value)) {
						callback(new Error('请选择开始时间'));
					} else if (new Date(this.ruleForm.signDate+" "+this.ruleForm.beginTime)<new Date()) {
						callback(new Error('开始时间必须大于或等于当前时间'));
					} else {
						this.selectableRangeM();
						callback();
					}
				};
    		return{

    			labelWidth:"120px",
    			loading:false,

    			ruleForm: {
		          // endTime:  new Date(2016, 9, 10, 15, 2),
								endTime : "",
								signDate : "",
								beginTime : "",
		        },
		        rules: {
							signDate :[
		            { required: true, message: '请选择签到日期', trigger: 'change' }
		          ],
							beginTime : [
		            { type: 'date', required: true, validator: validateBeginTime, trigger: 'change' }
		          ],
		          endTime : [
		            { type: 'date', required: true, message: '请选择结束时间', trigger: 'change' }
		          ],
        		},
						pickerStart:{
							selectableRange: '00:00:00 - 23:59:00'
						},
        		pickerEnd:{
          			selectableRange: '00:00:00 - 23:59:00'
						},
						pickerOptions0: {
							disabledDate (time) {
								return time.getTime() < Date.now() - 8.64e7;
							},
						},


    		}
    		
    	},

    	

    	created(){
    		
    	},

    	methods:{

	    	open() {

	        	this.loading = false;

						this.ruleForm.signDate = this.signDate;
						this.ruleForm.beginTime = this.beginTime;
	        	this.defaultTime();
						this.selectableRangeM();
						
						

	        },
    		close(){
    			this.$emit('update:dialogSetTime', false);
    		},

    		defaultTime(){

    			//console.log(this.endTime);
    			let time = this.endTime.split(":");
    			let hour = parseInt(time[0]);
    			let minute = parseInt(time[1]);
    			this.ruleForm.endTime = new Date(2016,9,10,hour,minute);
    			//console.log("结束时间 ==================");
    			//console.log(this.ruleForm.endTime);
    		},

    		selectableRangeM(){

    			//console.log("每次要执行");
    			let time = this.ruleForm.beginTime.split(":");
    			let hour = parseInt(time[0]);
    			let minute = parseInt(time[1])+1;
    			this.pickerEnd.selectableRange = hour + ":" + minute + ':00 - 23:59:00';

    			// console.log(this.pickerEnd.selectableRange);
    		},

    		submitForm(submitForm){
    			
    			//console.log(this.ruleForm.endTime);
    			this.loading = true;
    			let data = {
    				id:this.sSignId,
    				endTime:dateFormatTime(this.ruleForm.endTime)
					}
					if(this.taskStatus == 'waiting'){
						data.signDate = this.ruleForm.signDate;
						data.beginTime = this.ruleForm.beginTime;
						delete data.id;
						data.signId = this.sSignId;
					}

    			//console.log(data);
    			model.updateEndTime(data, (res => {

			          if(res.status == 200) {

			             this.loading = false;

			             this.$message({
					         message: '时间设置成功',
					         type: 'success'
				         });

			             this.$refs[submitForm].resetFields();

			             this.$emit("updateEndSign");
			             this.close();


			          } else {

			          	this.loading = false;

			            this.$message.error(res.message);
			          }

        	   }),this.taskStatus == 'waiting');

				},
				changeData(){
					this.$refs.ruleForm.validateField('beginTime');
				}
    	}
    }
</script>
<style scoped="" lang="less">
	.j-dialog-form p{
		font-size: 14px;
		color: #666;
		margin-left: 30px;
		// margin-top: -20px;
		margin-bottom: 30px;

	}
	.el-form-item{
		margin-top: 5px!important;

	}
</style>