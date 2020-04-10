<template>
	<div id="wadminClass">
		<table-list 
			role="CLAZZMANAGER"
			@edit="showEdit"></table-list>

		<!-- 编辑机构管理员 -->
		<edit-class
			:dialogEditClass.sync="editClass"
			:userId = "rowUserId"
			:orgId = "orgId"
			role = "CLAZZMANAGER"
			></edit-class>
	</div>
</template>
<script>
	import editClass from 'components/user/edit_class'
	import tableList from 'components/user/admin/table_list'

	export default {
		data() {
			return {
				editClass: false,		// 编辑机构弹出框
				rowUserId:"",
				orgId:"",
				
			}
		},

		created() {

		},
		methods: {
			showEdit(userId) {
				this.editClass = true;
				this.rowUserId = userId;
				// console.log("uuuuuuu",userId);
			},
			
		},

		components: {
			editClass,
			tableList
		}


	}

</script>