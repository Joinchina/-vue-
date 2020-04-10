<template>
	<div class="search">
		<input type="text" :sdata ="sdata" ref="searchQuery" v-model="searchQuery" :placeholder="placeholder" /><i class="el-icon-search" @click.stop="searchData()"></i>
	</div>	
</template>
<script>
	export default {
		props: {
			placeholder: {
				type: String,
				default: ''
			},
			sdata: {
		        type: Array,
		        default: function () {
		        	return []
		        }
		    }
			
		},
		data() {
			return {
				searchQuery:""
			}
		},
		created() {
			console.log('dddddd', this.sdata);
		},
		computed: {
			initData(){
				return this.sdata;
			}
		},
		methods: {
			searchData() {
				let searchQuery = this.searchQuery && this.searchQuery.toLowerCase();
					searchQuery = searchQuery.trim();
				// let data2 = this.clazzList;
				let data = this.initData;
				let item;
				console.log("searchQuery",data);
				if(searchQuery) {
					data = data.filter(function(row) {
						return Object.keys(row).some(function() {
							return String(row["name"]).toLowerCase().indexOf(searchQuery) > -1
						})
					})
					item = data;
				} else {
					item = this.sdata;
				}

				this.$emit('select', item)
				console.log("kkkkkkk",item);
		        // return data;

		    }
		}
	}
</script>
<style scoped lang="less">
	@import "../../assets/less/btn-search.less";
</style>