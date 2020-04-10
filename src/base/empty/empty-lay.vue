<template>
<!--
弹出层 空页面
 -->
	<div id="wempty">
		<img class="img-empty" src="../../assets/img/common/empty-lay.png" alt="这里什么都没有">
		<p class="infor" v-html="tip"></p>
		<a href="javascript:;" class="btn-close" v-if="btntext" @click="handleAdd(funcadd)">{{btntext}}</a>

	</div>
</template>
<script>

	export default {
		data() {
			return {
				funcadd: true
			}
		},
		props: ['tip', 'btntext'],


	    created() {

	    },
		methods: {
			handleAdd(funcadd) {
				this.$emit('add', funcadd)
			}
		}

	}
</script>
<style scoped lang="less">
	#wempty {
		background-color: #fff;
		width: 100%;
		margin: 0 auto;
		padding: 60px 0;
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
		
	}
</style>
