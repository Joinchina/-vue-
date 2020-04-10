<template>
	<div id="wadminProfessor">
		<table-list 
			role="PROFESSOR"
			@edit="showEdit"></table-list>

		<!-- 编辑专家 -->
		<edit-professor
			:dialogEditProfessor.sync="editProfessor"
			:userId = "rowUserId"
			:orgId = "orgId"
			role = "PROFESSOR"
			></edit-professor>
	</div>
</template>
<script>
	import editProfessor from 'components/user/edit_professor'
	import tableList from 'components/user/admin/table_list'

	export default {
		data() {
			return {
				editProfessor: false,		// 编辑机构弹出框
				rowUserId:"",
				orgId:"",
				
			}
		},

		created() {

		},
		methods: {
			showEdit(userId) {
				this.editProfessor = true;
				this.rowUserId = userId;
				// console.log("uuuuuuu",userId);
			},
			
		},

		components: {
			editProfessor,
			tableList
		}


	}

</script>