<template>
	<div id="wadminPro">
		<table-list 
			role="PROJECTADMIN"
			@edit="showEdit"></table-list>

		<!-- 编辑机构管理员 -->
		<edit-pro
			:dialogEditPro.sync="editPro"
			:userId = "rowUserId"
			:orgId = "orgId"
			role = "PROJECTADMIN"
			></edit-pro>
	</div>
</template>
<script>
	import editPro from 'components/user/edit_pro'
	import tableList from 'components/user/admin/table_list'

	export default {
		data() {
			return {
				editPro: false,		// 编辑机构弹出框
				rowUserId:"",
				orgId:"",
				
			}
		},

		created() {

		},
		methods: {
			showEdit(userId) {
				this.editPro = true;
				this.rowUserId = userId;
				// console.log("uuuuuuu",userId);
			},
			
		},

		components: {
			editPro,
			tableList
		}


	}

</script>