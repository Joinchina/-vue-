<template>
<!--
您还没有项目，赶紧添加项目吧
您还没有任何项目，联系管理员给你添加项目吧
项目下还没有班级，赶紧创建班级吧
您还没有任何班级，联系管理员给你添加班级吧
您还没有任何课程，联系班主任给你添加课程吧
 -->
	<div id="wempty">
		<img class="img-empty" src="../../assets/img/common/empty.png" alt="这里什么都没有">
		<p class="infor" v-html="tip"></p>
		<a href="javascript:;" class="btn-create" v-if="btntext" @click="handleAdd(funcadd)">{{btntext}}</a>



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
			padding: 12px 30px;
			border-radius: 5px;
			background-color: #ecf6f5;
			border: 1px solid #319c95;
			font-size: 16px;
			color: #319c95;
		}
	}
</style>
