<template>
	<div class="passwordBox">
		<div :class="{'heardbox-org':flag1,'heardbox-project':flag2,'heardbox-clazz':flag3}">
			<v-head>
				<el-dropdown trigger="click" @command="operaterCommand">
	              <span class="el-dropdown-link">
	                  <i class="el-icon-arrow-down el-icon--right"></i>
	              </span>
	              <slot></slot>
	              <el-dropdown-menu slot="dropdown"  class="passwordEdit">
	                <el-dropdown-item command="edit"><i class="icon-edit-word"></i>修改密码</el-dropdown-item>
	                <el-dropdown-item command="exit"><i class="icon-exit"></i>退出</el-dropdown-item>
	              </el-dropdown-menu>
          		</el-dropdown>
			</v-head>
			
		</div>
		<edit-password></edit-password>
	</div>
</template>
<script type="text/javascript">
	import editPassword from 'components/login/editPassword';
	import vHead from 'components/header/header';
	import {exitSys } from "../../filters/userVerify"
	export default{
		computed:{
			type(){
				return this.$route.query.type;
			}
		},
		created(){
			if(this.type == "org"){
				this.flag1 = true;
			}
			if(this.type == "project"){
				this.flag2 = true;
			}
			if(this.type == "clazz"){
				this.flag3 = true;
			}
			
		},
		data(){
			return{
				flag1:false,
				flag2:false,
				flag3:false
			}
		},
		methods:{
			operaterCommand(command){
		      if(command == "edit"){
		          this.$router.push({
		                  path:"/project/password?type=org"
		          })
		      }
		      if(command == "exit"){
		           exitSys();
		      }
        	}
		},
		components:{
			vHead,
			editPassword
		}

	}
</script>
<style type="text/css" lang="less">
@import "../../assets/reset-element-ui/password.css";
.heardbox-project{
    width:100%;
    height: 118px;
    background-image: url('../../assets/img/common/banner_2.png');
    background-repeat: no-repeat;
    background-position: center top;
    background-size: cover;
}
.heardbox-clazz{
    width:100%;
    height: 118px;
    background-image: url('../../assets/img/common/banner_3.png');
    background-repeat: no-repeat;
    background-position: center top;
    background-size: cover;
}
.heardbox-org{
    width:100%;
    height: 118px;
    background-image: url('../../assets/img/common/banner_1.png');
    background-repeat: no-repeat;
    background-position: center top;
    background-size:cover;
    img{
      width: 130px;
      display: block;
      margin: 0 auto;
      margin-top: 25px;
    }
}
.el-icon-arrow-down:before{
      content:"\E60B"!important;
      color: #fff;
      width: 9px;
      height: 7px;
  }
.el-dropdown-menu{
	background: rgba(0,0,0,0.5)!important;
	border: none;
} 
.el-popper[x-placement^=bottom] .popper__arrow::after{
	border-bottom-color:rgba(0,0,0,0.7)!important;
	top: 0px!important;
}
</style>