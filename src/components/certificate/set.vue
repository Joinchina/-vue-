<template>
	<div class="set-certificate">
		
		<Goback passtitle="证书设置" ></Goback>

		<template v-if="!item">
			<v-save 
				:orgId="orgId"
				@saveSucc="getCertificate"></v-save>
		</template>

		<template v-else>
			<v-view 
				:cert="item"
				:orgId="orgId"></v-view>
		</template>
		
	</div>
</template>
<script>
import vSave from 'components/certificate/save'
import vView from 'components/certificate/view'
import certificate from 'model/certificate/certificate'
import Goback from 'base/goback/goback'

export default {
	data () {
		return {
			item: ""
		}
	},
	computed: {
		orgId() {
			return this.$route.query.orgId;
		}
	},
	created () {

	},
	mounted () {
		this.getCertificate();

	},
	methods: {
		getCertificate() {
			let data = {
				organizationId: this.orgId,
			}

			certificate.getOrgCert(data, (res => {
				console.log("获取证书", res);
				if(res.status == 200) {
					this.item = res.data;
				} else if(res.status == 206){
					// 未设置
					this.item = "";
				} else if(res.status == 205){
					this.$message.error(res.message);
				}
			}))
		}
	},
	components: {
		vSave,
		vView,
		Goback
	}
}
</script>
<style scoped lang="less">
	@import "../../assets/less/btn-search.less";
</style>