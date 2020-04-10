<template>
	<div  class="wrapper" id="wuserList">

		<section class="w-content clearfix">
			<g-side></g-side>
			<router-view class="w-list"></router-view>
		</section>
		
		
	</div>
</template>

<style scoped lang="less">
	#wuserList {
		.w-content {
			width: 100%;
			
		}
		.w-list {
			float: right;
			width: calc(~"100% - 188px");
			// background-color: #fff;
			border-radius: 6px;
			position: relative;
			// box-shadow: 0 0 3px #eee;
			// padding: 16px 30px 40px;
		}
	}
	
</style>
<script>
	import gSide from './gside';
	export default{
		created(){

		},

		data(){
			return{

			}
		},
		methods:{

		},
		components:{
			gSide
		}
	}
</script>