<template>
	<div>
		 <!--header_start-面包屑-->
        <bread-crumb
          :clazzId="clazzId"
          :groupId="groupId"
          :leveDiscussChat="1"
        ></bread-crumb>
         <!--header_end-->
         <!--问答_start-->
	      <div class="answer_tit answer_left_none round-layout">
	        <h1>【讨论】&nbsp;{{groupTitle}}</h1>
	        <div class="detail">
	          <ul class="discuss-dis">
	            <li>
	              <span class="icon-describe"></span>
	              <span class="icon-con ">
	                <span class="detailContent">
	                  描述：无
	                </span>
	              </span>

	            </li>
	            <li>
	              <span class="icon-course" style="vertical-align: top"></span>
	              <span class="icon-con">课程：小组讨论</span>
	            </li>
	            <li>
	              <span class="icon-members"></span>
	              <span class="detailName icon-con">
	                成员:
	                <span v-if="!!userList && userList.length != 0"><span v-for="(item,index) in userList" style="padding-right: 10px;">{{item.userName}}</span></span>
	                <span v-else>全部成员</span>
	              </span>

	            </li>

	          </ul>

	        </div>
	      </div>
         <!--问答_end-->
        <!--学员问答_start-->
	    <div class="answer_tit margin16 round-layout">
	      <div class="answer_con">
	        <div class="title">
	        	<div class="right">
		        	<span class="btn-green" @click = "exportChatMessage">
		        		<i class="icon-export-white"></i>内容导出
					</span>
				</div>
	           <span class="icon"></span>小组消息记录 (共 {{totalElements}} 条)
	        </div>
	        <!--详情_start-->
	        <ul class="con answer-detail" v-if="!!userChat && userChat.length != 0">
	          <li class="clearfix border_none" v-for="(item,index) in userChat">
	            <div class="image" v-if="!!item.miniAvatar "><img :src="item.miniAvatar"/></div>
	            <div class="image" v-else><img src="../../../assets/img/activity/example2.png"/></div>
	            <div class="text text-none">
	              <h2 class="h2_padnone">{{item.name}}<span class="gray">{{item.optime}}</span></h2>
	              <p class="p_border" v-if="!!item.type && item.type == 'txt'"><span class="p_corner"></span>{{item.message}}</p>
	              <p class="p_border_img" v-else-if="!!item.type && item.type == 'img'">
	                <span class="p_corner"></span>
	                <img :src="item.url"/>
	              </p>
	            </div>
	          </li>
	        </ul>
	        <!--详情_end-->
	      </div>
	      <!--footer_start-->
	      <!--分页-->
	      <div class="pagination">
	        <el-pagination
	          @current-change ="handleCurrentChange"
	          :page-size="20"
	          layout="prev, pager, next"
	          :total="totalElements">
	        </el-pagination>
	      </div>
	      <div class="answer-footer">

	        <p>共{{totalElements}}条&nbsp;每页20条</p>
	      </div>
	      <!--footer_end-->
	    </div>
    	<!--学员问答_end-->
	</div>
</template>
<script type="text/javascript">
	import breadCrumb from 'components/course/breadcrumb';
	import model from '@/model/clazz/group';
	import { getToken } from '@/filters/userVerify'
    import API from '@/global/resource'
	export default{
		data(){
			return{
				groupTitle:"",
				userList:[],
				userChat:[],
				imId:"",
				groupId:"",
				activityId:"",
				clazzId:"",
				cur_page:1,
        		totalElements:0,
				size:20
			}
			
		},

		created(){
			this.imId = this.$route.query.imId;
			this.groupId = this.$route.query.groupId;
			this.clazzId = this.$route.query.clazzId;
			this.getList();
		},

		methods:{
			exportChatMessage(){
				if(this.totalElements > 0){
					if(!this.$store.getters.getOrgVipInfo.vip){
						this.$store.state.vipFuncPopFalg = true;
						return;
					}
					window.open(API.urls.exportWordChatMessage+"?groupId="+this.groupId+"&imId="+this.imId+"&token="+getToken());
				}
				
			},
			handleCurrentChange(val){
        		this.cur_page = val;
       			this.getList();
     	 	},
			getList(){
				  var data = {
				  	imId:this.imId,
				  	groupId:this.groupId,
			        clazzId:this.clazzId,
			        number:this.cur_page,
			        size:this.size
			        
			      }
			      model.groupChatMessage(data, (res => {
			        if(res.status == 200) {
			        	if(!!res.data.groupVo){
			        		this.groupTitle = res.data.groupVo.name;
			        		this.userList = res.data.groupVo.students;
			        		this.userChat = res.data.content;
			        		this.totalElements = res.data.totalElements;
			        		//导出内容按钮不许点击
			        		if(this.totalElements == 0){
			        			$(".btn-green").attr("style","cursor:not-allowed");
			        		}
			        	}
			        	
			        } else {
			          this.$message.error(res.message);
			        }
			      }));
			}
		},
		components:{
			breadCrumb
		}
	}
</script>
<style scoped="" lang = "less">
  @import "../../../assets/less/activity.less";
   .round-layout h1{
    box-shadow: none!important;
    border-bottom: none!important;
  }
  .answer-detail li .p_border_img{
    border:1px solid #c0e0e0;
    background: #f5fafa;
    border-radius: 3px;
    padding:15px 12px;
    color: #333;
    line-height: 25px;
    width: auto!important;
    position: relative;
    max-width: 100px;
    max-height:auto;
  }
  .answer-detail li .p_border_img img{
    width: 100%;
    height: 100%;
  }
  .icon-more{
    background: none;
    width: auto;
    height: auto;
  }
  .answer_tit h1{
    font-weight: 500;
    color: #333;
    padding-bottom: 20px!important;
  }
  .discuss-dis{
    padding-left: 10px;
  }
  .answer_tit .icon-con{
  	margin-top: 0;
  }
  .btn-green{
  	padding: 10px 20px;
  	font-size: 16px;
  }
  .btn-green i{
  	vertical-align: middle;
  	margin-right: 5px;
  }
</style>
