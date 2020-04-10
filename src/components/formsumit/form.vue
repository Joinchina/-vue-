<template>
	<div>
		  <form id="exportClazzExport" :action="urls" enctype="multipart/form-data" :method="methods">
			    <input type="hidden" :name = "index" :value="item" v-for = "(item,index) in data">
      </form>
	</div>
</template>
<script>
export default {
	
  props: ["urls", "methods", "data"],

  created() {
    //console.log(this.data);
  },

		data(){
			return{

			}
		},
		methods:{
			submitData(){
				console.log("提交",this.data);
				setTimeout(function(){
    				$("#exportClazzExport").submit();
    			},50)
			}
		}
	}

</script>
<style>
</style>