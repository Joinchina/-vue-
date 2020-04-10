<template>
	<div id="wadminOrg">
		<table-list 
			role="ORGADMIN"
			@edit="showEdit"></table-list>

		<!-- 编辑机构管理员 -->
		<edit-org
			:dialogEditOrg.sync="editOrg"
			:userId = "rowUserId"
			:orgId = "orgId"
			role = "ORGADMIN"
			></edit-org>
	</div>
</template>
<script>

	import editOrg from 'components/user/edit_org'
	import tableList from 'components/user/admin/table_list'

	export default {
		data() {
			return {
				editOrg: false,		// 编辑机构弹出框
				rowUserId:"",
				orgId:"",
				
			}
		},

		created() {

		},
		methods: {
			showEdit(userId) {
				this.editOrg = true;
				this.rowUserId = userId;
				// console.log("uuuuuuu",userId);
			},
			
		},

		components: {
			editOrg,
			tableList
		}


	}

</script>
<style scoped lang="less">

	
</style>