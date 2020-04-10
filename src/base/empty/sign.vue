<template>
<!--
创建签到
 -->
	<div>
		<div  id="wempty">
			<img class="img-empty" src="../../assets/img/common/empty.png" alt="这里什么都没有">
			<p class="infor" v-html="tip"></p>
			<a href="javascript:;" class="btn-create" v-if="btntext" @click="handleAdd(funcadd)">
				<i class="icon-add"></i> {{btntext}}
			</a>
			<a href="javascript:;" class="btn-blue-light" @click="importSignF = true">
				<i class="icon-sign-import"></i> 导入签到
			</a>
		</div>

		 <!--导入签到-->
	    <import-sign
	      :clazzId = "clazzId"
	      :dialogImportSign.sync= "importSignF"
	      @updateImportSign = "receiveData"
	    >
      
    </import-sign>
	</div>
</template>
<script>
	import importSign from 'components/clazz/signin/import'
	import bus from  "@/global/bus"
	export default {
		data() {
			return {
				funcadd: true,

				importSignF:false
			}
		},
		props: ['tip', 'btntext',"clazzId"],


	    created() {

	    },
		methods: {
			handleAdd(funcadd) {
				this.$emit('add', funcadd)
			},

			receiveData(){
				//console.log("daoru chengcheng");
				 bus.$emit('dialogSignSuccessimport', "1");
			}
		},

		components:{
			importSign
		}

	}
</script>
<style scoped lang="less">
	#wempty {
		background-color: #fff;
		width: 100%;
		margin: 0 auto;
		padding: 100px 0;
		text-align: center;
		.img-empty,
		.infor,
		.btn-create {
			display: block;
			margin: 20px auto;
		}
		.infor {
			line-height: 1.8em;
		}
		.btn-create {
			display: inline-block;
			padding: 8px 11px;
			border-radius: 5px;
			background-color: #f6fbfb;
			border: 1px solid #93cac4;
			font-size: 16px;
			color: #319c95;
			margin-right: 10px;
		}
		.btn-create,.btn-blue-light{
			i{
				vertical-align: middle;
			}
		}
	}

</style>
