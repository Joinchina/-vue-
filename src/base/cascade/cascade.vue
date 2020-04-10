<template>
	<div>
		<div class="j-cas-menus clearfix">

			<section>

				<!--左侧menu-->
				<ul class = "menu-left">
					<li :class="{'active':curIndex == index}" v-for="(item,index) in dataArray" :key="index" @click="tab(item,index)">
						<span class="j-width">
							<i :class="{'icon-net-yes':item.isSelect}"></i>
							{{item.schoolStageName}}
						</span>
						<i class="el-icon-arrow-right"></i>
					</li>
				</ul>

				<!--右侧选中-->
				<div class = "menu-rg">
					<section v-for = "(item,index) in dataArray" :key="index" v-if="curIndex == index" >
						<el-checkbox 
					    		:label="subject.subjectCode"
					    		v-model="subject.isSelect" 
					    		name="type"
					    		v-for="(subject,index2) in item.subjectList" 
					    		:key="index2"
								:checked="subject.isSelect?true:false"
					    		:alt="subject.subjectName"
					    		:title="subject.subjectName">
					    		{{subject.subjectName}}
					    </el-checkbox>
				   </section>
		<!-- 		   <input type="button" value="添加" @click="add" name=""> -->
				</div>

			</section>


		</div>
	</div>
</template>
<script>
	export default{

		props:["dataArray"],


		data(){
			return{
				curIndex:0,
			}
		},

		created(){
		},


		watch:{
			dataArray:{
				handler(newVal,oldVal){
					
					
					newVal.forEach((item,index)=>{
						var i = 0;
						item.subjectList.forEach((sub,z)=>{

							//如果当前选中一个为true,菜单为true
							if(sub.isSelect == true){
								item.isSelect = true;
								return false;
							}

							if(sub.isSelect == false){
								i++;
							}

						})

						if(i == item.subjectList.length){
							item.isSelect = false;
						}

					})

					this.$emit("range",newVal)
				},
				deep:true
			}


		},

		methods:{

			tab(item,index){
				this.curIndex = index;
			},

			
			
		},

	}
</script>
<style scoped lang="less">
	@import "../../assets/reset-element-ui/form-reset.css";
	@import "../../assets/less/icon.less";
	.j-cas-menus{
		border:1px solid #dcdfe6;
		border-radius: 5px;
		box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
		text-align: left;
		width: 420px;
		box-sizing: border-box;
		.menu-left{
			float: left;
			width: 120px;
			border-right: 1px solid #dcdfe6;
			box-sizing: border-box;
			.j-width{
				width: 95px;
				overflow: hidden;
				height: 40px;
				display: inline-block;
			}
			li{
				height: 44px;
				line-height: 44px;
				font-size:15px;
				color: #333;
				text-align: center;
				&:hover{
					background: #009791;
					color: #009791;
					background: #f5f7fa;
				}
				.el-icon-arrow-right{
					vertical-align: middle;
					float: right;
					margin-top: 15px;
					margin-right: 8px;
				}
				
			}
			.active{
				color: #009791;
				background:#f5f7fa;
				.el-icon-arrow-right{
					&:before{
						color: #009791;
					}
				}
				.icon-net-yes{
					margin-right: 6px;
				}

			}
			
		}
		.menu-rg{
			float: left;
			padding-top: 20px;
			padding-left: 15px;
			width: 293px;
			box-sizing: border-box;
			.el-checkbox{
				width: 50%;
				text-overflow: ellipsis;
				overflow: hidden;
				word-wrap: break-word;
				color: #333;
				padding-bottom: 5px;
				font-size: 15px;

			}
		}
	}
	.el-checkbox+.el-checkbox{
		margin-left: 0!important;
	}

</style>