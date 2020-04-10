<template>
  <div class="w-menu">
    <div class="w-content round-layout">
      <!--行列表-->
      <el-row :gutter="24" >

        <el-col :span="6" @click.native="routerLink('infor')">
          <div class="grid-content bg-purple" >
            <span class="icon-infor"/>
            <span class="text">
              机构简介
            </span>
          </div>
        </el-col>

        <el-col v-if="role == 'ADMIN' || role == 'ORGADMIN'" :span="6" @click.native="routerLink('app')">
          <div class="grid-content bg-purple" >
            <span class="icon-app"/>
            <span class="text">
              APP启动屏
            </span>
          </div>
        </el-col>

        <el-col v-if="role == 'ADMIN' || role == 'ORGADMIN'" :span="6" @click.native="routerLink('book')">
          <div class="grid-content bg-purple" >
            <span class="icon-book"/>
            <span class="text">
              证书设置
            </span>
          </div>
        </el-col>

      </el-row>
    </div>
  </div>
</template>
<script>
import { getCurRole } from '../../filters/userVerify'
import { mapGetters } from 'vuex'
import storage from '@/global/storage'

export default {
  data() {
    return {
      role: getCurRole(),
      orgId: this.$route.query.orgId
    }
  },
  computed: {
    // orgId() {
    // 	return this.$route.query.orgId;
    // },
    ...mapGetters(['showOrgObj'])
  },
  watch: {

	        showOrgObj(cur, old) {
	            console.log('机构管理 －　当前机构id', cur.identification)
	             this.orgId = cur.identification
	             this.role = cur.role || storage.get('exp_role')
	        }

	    },
  mounted() {
  },
  methods: {
    routerLink(type) {
      switch (type) {
        case 'infor':
          this.$router.push('/org/detail?orgId=' + this.orgId)
          break
        case 'app':
          this.$router.push('/app?orgId=' + this.orgId)
          break
        case 'book':
          this.$router.push('/org/certificate?orgId=' + this.orgId)
          break
      }
    }
  }
}
</script>
<style scoped lang="less">
.w-menu{
    .w-content{
      	padding:0 32px 70px 80px;

    }

	.bg-purple {
      	box-sizing: border-box;
      	background: #fff;
      	border: 0;
      	box-shadow:-3px 0 3px #e7f5f3, 3px 0 3px #e7f5f3, 0 -3px 3px #e7f5f3, 0 3px 3px #e7f5f3;
      	margin-bottom: 36px;
      	padding-left: 36px;

      	height: 89px;
      	line-height: 89px;
      	width: 216px;
      	cursor: pointer;
      	position: relative;

		.icon-infor,
		.icon-app,
		.icon-book {
			background: url("../../assets/img/moduleicon/icon-infor.png") no-repeat;
	        background-size: 100% 100%;
	        width: 44px;
	        height: 44px;
	        display: inline-block;
	        vertical-align: middle;
		}
		.icon-app {
			background: url("../../assets/img/moduleicon/icon-app.png") no-repeat;
			background-size: 100% 100%;
		}
		.icon-book {
			background: url("../../assets/img/moduleicon/icon-book.png") no-repeat;
			background-size: 100% 100%;
		}

      	.text{
	        font-size: 20px;
	        display: inline-block;
	        padding-left: 8px;
	        color: #666;
	        a {
		        color: #666;
		    }
      	}

  	}
}
.el-row {
	margin-top: 120px;
}
</style>
