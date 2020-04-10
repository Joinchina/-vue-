<style scoped lang="less">
	#wuserList {
		.w-content {
			width: 100%;
			
		}
		.w-list {
			float: right;
			width: calc(~"100% - 188px");
			background-color: #fff;
			border-radius: 6px;
			box-shadow: 0 0 3px #eee;
			padding: 16px 30px 40px;
		}
	}
	

</style>
<template>
	<div class="wrapper" id="wuserList">
		
		<section class="w-content clearfix">
			
			<user-menu></user-menu>
			
			<router-view class="w-list"></router-view>

		</section>
	</div>

</template>
<script>
	import userMenu from "components/user/user_menu"

	export default {
		data () {
			return {
				
				
			}
		},
		
		created() {
			
		},
		mounted() {
		},
		methods: {
		
		},
		components: {
			userMenu
		},
		watch: {
			
		}
	}
</script>

