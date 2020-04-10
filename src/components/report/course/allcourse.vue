<template>
	<div class="allcourse">
		 <!-- 没有课程时 -->
	    <empty v-if="emptyFlag"
	    :tip="tip"></empty>
	    <!-- /没有课程时 -->
		
		<div class="w-content clearfix" v-else >
			<!-- <div class="course-menu">
				<div class="search">
			        <input type="text"
			        	placeholder="课程名称" 
			        	v-model="searchQuery" 
			        	v-on:input="searchData(courseList)" />
			        	<i class="el-icon-search" @click.stop="searchData(courseList)"></i>
			     </div>
			     <ul class="menu-list">
			        <li v-for="item in courseList2">
			        	<router-link :to="{path: '/report/course/creport', query: {clazzId:clazzId,courseId: item.id}}" exact>
							<i  class="icon-point-white"></i>
							{{item.name}}
			        	</router-link>
			        </li>
					
			    </ul>
			</div> -->
			<Scroll :dataList="courseList" :addject="false" v-if="courseList.length" v-on:parentEvent="parentEvent"></Scroll>
			<!-- right -->
			<router-view  class="w-course"></router-view>
		</div>
	</div>
</template>
<script>
	import Empty from 'base/empty/empty'
	import course from 'model/report/course'
	import Scroll from 'base/modal/scroll'
	import {setStore,getStore} from '../../../global/session.js'
	export default {
		data() {
			return {
				tip: '还没有创建过课程哦~~~',	// 空页面提示信息
				courseList: [],				// 课程列表
				emptyFlag: false,
			}
		},
		computed: {
			clazzId() {
				return this.$route.query.clazzId;
			}
		},
		created() {
			this.getCourseList();
			this.getinfo();
		},
		methods: {
			getCourseList() {
				let data = {
					clazzId: this.clazzId
				}
				course.getCourseList(data,(res => {
					// console.log("课程列表", res);
					if(res.status == 200 ) {
						this.courseList = res.data;
						if(this.courseList.length == 0) {
							this.emptyFlag = true;
						} else {
							this.emptyFlag = false;
						}
					} else {
						this.$message.error(res.message);
					}
				}));
			},
			// 接收子组件传递来的数据并操作数据
			parentEvent(d,n){
				// 设置页面存储
				let data={
					number:n,
					courseId:d.id,
					clazzId:d.clazzId,
				}
				setStore('info',data);
				this.$router.push({path: '/report/course/creport', query: {clazzId:this.clazzId,courseId: d.id}});

			},    
			getinfo(){
 				// 获取页面存储的信息实现刷新定位和路由跳转			
				let getinfo=getStore('info');
				if(getinfo!==null){
					this.$router.push({path: '/report/course/creport?clazzId='+getinfo.clazzId+'&courseId='+getinfo.courseId+''});
				}
			}
		},
		destroyed(){
			window.sessionStorage.clear();
		},
		components: {
			Empty,
			Scroll,
		}
	}
</script>
<style scoped lang="less">
@import "../../../assets/less/icon.less";
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar
{
	width: 8px;
	height: 8px;
  background-color: #37323e;
}
 
/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track
{
	// -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	border-radius: 6px;
  background-color: #37323e;
}
 
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb
{
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: #ffffff;
}
.course-menu {
	float: left;
    width: 230px;
    background-color: #37323e;
    border-radius: 4px;
    padding-top: 20px;
    color: #fff;
    margin-bottom: -99923px;
    //padding-bottom: 99999px;
    height: auto;

    .search {
    	position: relative;
      	display: block;
      	margin: 0 auto 20px;
      	width: 200px;
      	height: 34px;
      	border-radius: 6px;
      	background-color: #5b5761;
      	float: none;
      	border: 0;
      	>i {
	        position: absolute;
	        right: 0;
	        top: 0;
	        width: 34px;
	        height: 34px;
	        line-height: 34px;
	        background-color: #636069;
	        border-radius:0 6px 6px 0;
	        text-align: center;
	        color: #fff;
	        border: 0;
	    }
	    >input {
	        display: block;
	        width: 166px;
	        height: 100%;
	        border: 0;
	        background-color: transparent;
	        padding: 0 8px;
	        color: #fff;
	    }
	    input::-webkit-input-placeholder,
	    textarea::-webkit-input-placeholder {
	        color: #fff;
	    }
	    input:-moz-placeholder,
	    textarea:-moz-placeholder {
	        color: #fff;
	    }
	    input::-moz-placeholder,
	    textarea::-moz-placeholder {
	        color: #fff;
	    }
	    input:-ms-input-placeholder,
	    textarea:-ms-input-placeholder {
	        color: #fff;
	    }
    }

    .menu-list {
      	width: 100%;
 overflow-y: scroll;
      	li {
	        font-size: 14px;
	        height: 46px;
	        line-height: 46px;
	        white-space: nowrap;
	        overflow: hidden;
	        text-overflow: ellipsis;
	        cursor: pointer;
	        color: #fff;
	        a {
	        	padding: 0 20px;
	        	display: block;
	        	color: #fff;
	        	overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
	        	&:hover,&.router-link-exact-active {
					background-color: #35a69d;
				}
	        }
	        >i {
	        	display: inline-block;
	            vertical-align: middle;
	            margin-right: 12px;
	        }
	        &:hover {
	            background-color: #35a69d;
	        }
      	}
    }
}
.w-course {
	float: right;
	width: 940px;
	margin-left: 20px;
}

</style>