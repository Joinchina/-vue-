<template>
	<div>
		<div class="pro-menu" >
			<div class="search">
				<input type="text"
				v-model="searchQuery"
				placeholder="课程名" v-on:input="searchData(items2)" /><i class="el-icon-search"
				@click.stop="searchData(items2)"
				></i>
			</div>
			<ul class="menu-list">
				<li v-for="(item,index) in items" :key="index" :class="{'active':item.active}" @click="setstyle(item,index),passevent(item,index)">
					<i  class="icon-point-white"></i>
					<span>{{item.name}}</span>
				</li>
			</ul>
			<div class="create-pro" v-show="addproject">
					<button class="btn-add" type="button" >创建项目</button>
			</div>
		</div>
	</div>
</template>
<script>
import { getStore } from "../../global/session.js";
export default {
	data() {
		return {
			searchQuery: "", //输入的搜索内容
			items: this.dataList, //列表数组
			items2: this.dataList, //遍历后的数组
			addproject: this.addject, //创建项目是否启用
			setheight: 150 //再没有创建项目是设置ul的高度
		};
	},
	props: {
		dataList: {
			type: Array,
			required: true,
			default: ["空白"]
		},
		addject: {
			type: Boolean,
			required: true,
			default: false
		}
	},
	mounted() {
		this.offtop();
		this.changesize();
	},
	updated() {
		this.offtop();
		this.changesize();
	},
	methods: {
		setstyle(i, n) {
			this.items.forEach(i => {
				this.$set(i, "active", false);
			});
			this.$set(this.items[n], "active", true);
		},
		searchData(items2) {
			let searchQuery = this.searchQuery && this.searchQuery.toLowerCase();
			searchQuery = searchQuery.trim();
			let data = items2;
			if (searchQuery) {
				data = data.filter(function(row) {
					return Object.keys(row).some(function() {
						return (
							String(row["name"])
								.toLowerCase()
								.indexOf(searchQuery) > -1
						);
					});
				});
				if (data.length == 0) {
					this.items = [{ name: "暂无数据" }];
					return;
				}
				this.items = data;
				this.items.forEach((item, index) => {
					this.$set(item, "active", false);
				});
				this.$set(this.items[0], "active", true);
			} else {
				this.items = this.items2;
				this.items.forEach((item, index) => {
					this.$set(item, "active", false);
				});
				this.$set(this.items[0], "active", true);
			}
		},
		changesize() {
			window.addEventListener("resize", this.size);
			this.size = () => {
				this.offtop();
			};
		},
		offtop() {
			let getinfo = getStore("info");
			if (getinfo !== null) {
				this.$set(this.items[getinfo.number], "active", true);
			} else {
				this.$set(this.items[0], "active", true);
			}

			//获取当前元素距离顶部的距离
			let offsettop = 282;
			//获取当前浏览器可视区的高
			let cliheight = $(window).height();
			if (this.addproject == false) {
				this.setheight = 54;
			} else {
				this.setheight = 150;
			}
			let btnheight=0;
			if(this.addject==true){
			btnheight=0;
			}else{
			btnheight=76;
			}
			//设置列表的默认高度
			$(".menu-list").css("height",(cliheight - this.setheight - offsettop+btnheight) + "px");
			//获取滚动轴滚动的距离
			this.scroll_ = () => {
				let scrolltop = $(document).scrollTop(); //滚动的距离
				if (scrolltop >= offsettop) {
					//为导航列表增加浮动
					$(".pro-menu").css({ position: "fixed", top: 0 });
					//计算导航列表的高度
					$(".menu-list").css("height", cliheight - this.setheight +btnheight+ "px");
				} else {
					$(".pro-menu").css({ position: "static" });
					//  $(".menu-list").css("height",(cliheight-150-offsettop)+"px")
					//设置列表的滚动时的高度
					$(".menu-list").css(
						"height",
						cliheight - this.setheight - offsettop + scrolltop +btnheight+ "px"
					);
				}
			};
			window.addEventListener("scroll", this.scroll_);
		},
		// 子组件操控父组件
		passevent(d, n) {
			this.$emit("parentEvent", d, n);
		}
	},
	destroyed() {
		window.removeEventListener("scroll", this.scroll_);
		window.removeEventListener("resize", this.size);
		this.offtop=()=>{
          return
        }
	}
};
</script>
<style lang="less" scoped>
@img: "../../assets/img/item";
@import "../../assets/less/icon.less";
@import "../../assets/reset-element-ui/form.css";
@borderColor: #f0f0f0;
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
	width: 8px;
	height: 8px;
	background-color: #37323e;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
	// -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	border-radius: 6px;
	background-color: #37323e;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	background-color: #ffffff;
}
.pro-menu {
	float: left;
	width: 230px;
	background-color: #37323e;
	border-top-left-radius: 4px;
	border-top-right-radius: 4px;
	padding-top: 20px;
	color: #fff;
	position: relative;
	margin-bottom: -99923px;
	// padding-bottom: 99999px;
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
		> i {
			position: absolute;
			right: 0;
			top: 0;
			width: 34px;
			height: 34px;
			line-height: 34px;
			background-color: #636069;
			border-radius: 0 6px 6px 0;
			text-align: center;
			color: #fff;
			border: 0;
		}
		> input {
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
		overflow-y: auto;
		li {
			font-size: 14px;
			height: 46px;
			line-height: 46px;
			padding: 0 20px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			cursor: pointer;
			> i {
				vertical-align: middle;
				margin-right: 12px;
			}
			&:hover,
			&.active {
				background-color: #35a69d;
			}
		}
	}
	.create-pro {
		position: fixed;
		bottom: 1px;
		width: 230px;
		height: 76px;
		padding-top: 17px;
		background-color: #464452;

		> .btn-add {
			color: #fff;
			display: block;
			margin: 0 auto;
			border: 0 none;
			width: 155px;
			height: 41px;
			background: url("@{img}/btn_create.png") center center no-repeat;
			background-size: 100% 100%;
			text-align: center;
			padding-left: 15px;
			font-size: 16px;
			line-height: 41px;
			cursor: pointer;
		}
	}
}
.clazz-list-comp {
	margin-left: 250px;
	// min-height:677px;
}
</style>
