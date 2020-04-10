<template>
	<div id="wadminStu">
		<table-list 
			role="STUDENT"
			@edit="showEdit"></table-list>

		<!-- 编辑学员 -->
		<edit-stu
			:dialogEditClass.sync="editStu"
			:userId = "rowUserId"
			role = "STUDENT"
			></edit-stu>
	</div>
</template>
<script>
	import editStu from 'components/members/student_edit'
	import tableList from 'components/user/admin/table_list'

	export default {
		data() {
			return {
				editStu: false,		// 编辑机构弹出框
				rowUserId:"",
				orgId:"",
				
			}
		},

		created() {

		},
		methods: {
			showEdit(userId) {
				this.editStu = true;
				this.rowUserId = userId;
				// console.log("uuuuuuu",userId);
			},
			
		},

		components: {
			editStu,
			tableList
		}


	}

</script>