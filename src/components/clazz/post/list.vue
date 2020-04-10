<style scoped lang="less">
@import "../../../assets/less/icon.less";
@import "../../../assets/less/btn-search.less";
#wpostList {
  .bread-box {
    position: relative;
    margin-bottom: 15px;
    .btn-green {
      display: inline-block;
      position: absolute;
      top: 0;
      padding: 10px 20px;
      font-size: 16px;
    }
    .search {
      position: absolute;
      top: 0;
      right: 0;
      background-color: #fff;
    }
    .wexport {
      right: 250px;
    }
    .wexport-pic {
      right: 370px;
    }
    .date {
      position: absolute;
      top: 0;
      right: 0;
    }
  }

  .wtabs {
    border-bottom: 1px solid #e6e6e6;
    height: 72px;
    line-height: 66px;
    font-size: 20px;
    padding: 0 70px;
    li {
      display: inline-block;
      padding: 0 10px;
      margin-right: 56px;
      cursor: pointer;
      // border-bottom: 5px solid #fff;
      &.active {
        color: #35a69d;
        border-bottom: 5px solid #35a69d;
      }
    }
    span {
      font-size: 16px;
      color: #666;
    }
  }

  .wlist {
    padding: 0 25px;

    li {
      padding: 25px;
      border-bottom: 1px solid #e6e6e6;
    }

    .media {
      > img {
        float: left;
        width: 40px;
        height: 40px;
        border-radius: 40px;
        margin-right: 10px;
      }
      .name {
        font-size: 18px;
        color: #333;
        text-decoration: underline;
      }
      .tag-top {
        font-size: 14px;
        color: #fff;
        background-color: #ff7762;
        border-radius: 5px 0 5px 0;
        padding: 1px 6px;
        margin-left: 8px;
        vertical-align: text-top;
      }
      .time {
        font-size: 14px;
        color: #999;
      }
    }
    .cont {
      display: block;
      font-size: 18px;
      color: #333;
      margin: 15px 0;
      font-weight: 500;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      &:hover {
        color: #3182d9;
      }
    }
    .count {
      font-size: 16px;
      color: #999;
      vertical-align: middle;
      > span {
        display: inline-block;

        &:after {
          display: inline-block;
          content: "·";
          padding: 0 12px;
        }
      }
      .handle {
        float: right;
        color: #3182d9;
        cursor: pointer;
      }
      i {
        vertical-align: middle;
      }
      .separator {
        color: #999;
        padding: 0 10px;
      }
    }
  }
  .wpic-list {
    margin-right: -20px;
    padding: 25px 0 0 50px;
    li {
      position: relative;
      float: left;
      width: 200px;
      height: 200px;
      margin-right: 20px;
      margin-top: 20px;
      img {
        width: 200px;
        height: 200px;
        border-radius: 5px;
      }
      .playpicvideo{
        width: 36px;
        height: 36px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        cursor: pointer;
        z-index: 2;
        img{
          max-width: 100%;
          max-height: 100%;          
        }
      }
      .videotime{
        position: absolute;
        z-index: 2;
        left: 7px;
        bottom: 7px;
        font-size: 14px;
        color: #FFFFFF;
        background: rgba(0, 0, 0, 0.49);
        overflow: hidden;
        padding: 4px 10px;
        border-radius: 20px;
      }
    }
    .icon-del-white {
      position: absolute;
      bottom: 10px;
      right: 12px;
      cursor: pointer;
    }
    .notice{
      width: 100%;
      font-size: 14px;
      color: #666666;
      i{
          width: 14px;
          height: 14px;
          background: url('../../../assets/images/liveIcon/tool7.png') top left no-repeat;
          float: left;
          background-size: cover;
          margin-top: 4px;
          margin-right: 4px;
      }
    }
  }
  .page-sum {
    font-size: 14px;
    color: #666;
    text-align: right;
    padding-top: 15px;
    padding-right: 52px;
  }

  #postShowbigPic {
    max-width: 100%;
    max-height: 100%;
    display: block;
    margin: 0 auto;
  }
}
</style>
<template>
	<div id="wpostList">

		<div class="bread-box">
		<Goback :passtitle="passtitle" :path="gopath" :query="goquery"></Goback>

			<template v-if="nowIndex === 0">
				<div class="search">
					<input type="text" v-model="keyword" placeholder="贴子内容" @keyup.13="getList" /><i class="el-icon-search" @click.stop="getList"></i>
				</div>
				<button v-if="topicList.length > 0" class="btn-green wexport" type="button"  @click="exportExcel">
					<i class="icon-export-white"></i>
					导出
				</button>
			</template>

			<template v-if="nowIndex === 1" >

				<button v-if="topicPicList.length > 0" class="btn-green wexport-pic" type="button"  @click="exportPic">
					<i class="icon-export-white"></i>
					导出
				</button>

				<div class="date">
					<el-date-picker
						v-model="daterange"
						type="daterange"
						align="right"
						placeholder="选择日期范围"
						@change="getPicList"
						:picker-options="pickerOptions0">
					</el-date-picker>
				</div>
					
			</template>

	</div>

	<section class="wlist-box round-layout">
		<ul class="wtabs clearfix">
			<li v-for="(item, index) in tabsParam"
			@click="toggleTabs(index)"
			:class="{active:index==nowIndex}">{{item.name}}</li>
		</ul>

		<ul class="wlist" v-show="nowIndex===0" v-loading="loading"
        :element-loading-text='this.$globalParam.loadText'
        :element-loading-spinner='this.$globalParam.loadSpinner'
        :element-loading-background='this.$globalParam.loadBg'>
			<li v-for="item in topicList">
				<div class="media clearfix">
					<img v-if="item.miniAvatar" :src="item.miniAvatar" alt="头像">
					<img v-else src="../../../assets/img/common/avatar.png" alt="">
					<h3><a href="javascript:;" class="name" @click="handleShow(item.userId)">{{item.name}} </a><span class="tag-top" v-if="item.istop">置顶</span></h3>
					<p class="time">{{item.createDate}}</p>
				</div>
				<router-link :to="{ path: '/clazz/post/details', query: {clazzId: item.clazzId, postId: item.id} }" class="cont">{{item.content}}</router-link>
				<div class="count clearfix">
					<span>{{item.commentCount}} 评论</span>
					<span>{{item.likeCount}} 点赞</span>
					<span>{{item.collectCount}} 收藏</span>
					<p class="handle">
						<span class="action-top" @click="isTop(item.id, item.istop)">{{item.istop ? '取消置顶' : '置顶'}}</span> 
						<span class="separator">|</span>
						<span class="del" @click="handleDel(item.id)">
							<i class="icon-del-blue"></i>
							删除
						</span>
					</p>
				</div>
			</li>

		</ul>

		<ul class="wpic-list clearfix" v-show="nowIndex===1" v-loading="loading2"
        :element-loading-text='this.$globalParam.loadText'
        :element-loading-spinner='this.$globalParam.loadSpinner'
        :element-loading-background='this.$globalParam.loadBg'>
			<Li v-for="(item,index) in topicPicList" :key="item.id">
				<img :src="item.transUrl"  alt="" @click="showmodel(index)">
				<i class="icon-del-white" @click="handlePicDel(item.batchId)"></i>
			</Li>
		</ul>
    <ul class="wpic-list clearfix" v-show="nowIndex===2" v-loading="loading3"
        :element-loading-text='this.$globalParam.loadText'
        :element-loading-spinner='this.$globalParam.loadSpinner'
        :element-loading-background='this.$globalParam.loadBg'>
      <div class="notice">
        <i></i>注意视频不支持导出
      </div>  
			<Li v-for="(item,index) in topicvideoList" :key="item.id">
				<img :src="item.picTransUrl"  alt="" @click="showmodel(index)">
				<i class="icon-del-white" @click="deletePicvideo(item.batchId)"></i>
        <div class="playpicvideo" @click="playvideo(item.videoUrl)">
          <img src="../../../assets/img/clazz/play.png" alt="">
        </div>
        <div class="videotime">
          时长  {{item.videoTime | videotimefilter}}
        </div>
			</Li>
		</ul>
		<p class="page-sum">共 {{totalElements}} 条  每页20条</p>
		<!-- 分页 -->
		<div class="pagination">
			<el-pagination
			@current-change ="handleCurrentChange"
			layout="prev, pager, next"
			:page-size ="20"
			:total="totalElements">
		</el-pagination>
	</div>

</section>

	<!-- 图片预览组件 -->
	<imgView :passimg="img" ref="number"></imgView>
	<!-- 学员信息 -->
	<stu-msg 
		:dialogStuMsg.sync = 'stuShow'
		:stuId = 'stuId'>
  </stu-msg>
  <!-- 查看视频 -->
  <modal :show.sync = "viewVideoShow" contWidth = '80%' bgColor="transparent" :before-close="videoClose">
    <div slot="body" style="height:100%">
      <video :src="videourl" controls="controls"  width="100%" height="100%" id="myVideo">
      您的浏览器不支持video标签
      </video>
    </div>
  </modal>
</div>
</template>
<script>
import post from "model/clazz/post";
import breadCrumb from "components/clazz/breadcrumb";
import stuMsg from "components/clazz/stumsg";
import imgView from "@/base/modal/imgview";
import { getToken } from "@/filters/userVerify";
import API from "@/global/resource";
import { delTip } from "@/global/open";
import Modal from 'base/modal/modal'
import { dateFormatStr, strFormatDate } from "@/global/open";
import Goback from 'base/goback/goback';
export default {
  data() {
    return {
      passtitle:"帖子管理",
      keyword: "", // 搜索内容
      topicList: [], // 帖子列表
      topicPicList: [], // 图片列表
      gopath:"",
      goquery:"",
      tabsParam: [
        {
          name: "帖子列表"
        },
        {
          name: "帖子图片"
        },
        {
          name: "帖子视频"
        }
      ],
      cur_page: 1,
      nowIndex: 0,
      totalElements: 0,
      // startTime:'',
      // finishTime: '',
      daterange: [],
      pickerOptions0: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      stuShow: false, //显示弹出框
      stuId: "", // 学员id
      dialogPic: false, // 查看大图弹出框
      bigUrl: "", // 大图路径
      firstBigUrl: "",
      img: [],
      loading:true,
      loading2:true,
      loading3:true,
      topicvideoList:[],//帖子视频集合
      viewVideoShow:false,//视频查看
      videourl:'',//视频查看url
    };
  },
  created() {
    this.getList();
  },
  filters:{
    videotimefilter(val){
      if(val<10){
        return '00:0'+val
      }else{
        return '00:'+val
      }
    }
  },
  computed: {
    clazzId() {
      return this.$route.query.clazzId;
    },
    startTime() {
      return this.daterange[0] ? dateFormatStr(this.daterange[0]) : "";
    },
    finishTime() {
      return this.daterange[1] ? dateFormatStr(this.daterange[1]) : "";
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.cur_page = val;
      if (this.nowIndex == 1) {
        this.getPicList();
      }
      if (this.nowIndex == 0) {
        this.getList();
      }
      if(this.nowIndex==2){
        this.getVideolist()
      }
      // this.nowIndex ? this.getPicList() : this.getList();
    },
    toggleTabs(index) {
      this.nowIndex = index;
      if (this.nowIndex === 1) {
        this.getPicList();
      }
      if (this.nowIndex == 0) {
        this.getList();
      }
      if(this.nowIndex==2){
        this.getVideolist()
      }
      // console.log(index);
    },
    exportExcel() {
      if(!this.$store.getters.getOrgVipInfo.vip){
				this.$store.state.vipFuncPopFalg = true;
				return;
			}
      window.open(
        API.urls.topicExpList +
          "?clazzId=" +
          this.clazzId +
          "&token=" +
          getToken()
      );
    },
    exportPic() {
      if(!this.$store.getters.getOrgVipInfo.vip){
				this.$store.state.vipFuncPopFalg = true;
				return;
			}
      window.open(
        API.urls.topicExpPic +
          "?clazzId=" +
          this.clazzId +
          "&token=" +
          getToken()
      );
    },
    getList() {
      let data = {
        clazzId: this.clazzId,
        topicContent: this.keyword,
        number: this.cur_page,
        size: "20"
      };

      post.topicList(data, res => {
        // console.log('帖子列表', res);
        if (res.status == 200) {
          this.loading=false;
          this.topicList = res.data.content;
          this.totalElements = res.data.totalElements;
          this.gopath="/clazz/menu";
          this.goquery={"clazzId":this.clazzId};
        } else {
          this.$message.error(res.message);
        }
      });
    },
    isTop(postid, istop) {
      let data = {
        id: postid,
        top: !istop,
        clazzId:this.clazzId
      };

      post.topicTop(data, res => {
        // console.log("帖子置顶",res);
        if (res.status == 200) {
          this.getList();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    handleDel(id) {
      let str = "确定要删除该帖子吗？";
      delTip(this, str, this.topicDel, id);
    },
    topicDel(id) {
      let _this = this;
      let data = {
        id: id,
        clazzId:this.clazzId,
      };

      post.topicDel(data, res => {
        // console.log("删除帖子", res);
        if (res.status == 200) {
          this.$message({
            type: "success",
            message: "删除成功",
            duration: 1000,
            onClose() {
              _this.getList();
            }
          });
        } else {
          this.$message.error(res.message);
        }
      });
    },
    handleShow(stuId) {
      // console.log("学员id",stuId);
      this.stuId = stuId;
      this.stuShow = true;
    },
    getPicList() {
      let data = {
        clazzId: this.clazzId,
        startTime: this.startTime,
        finishTime: this.finishTime,
        number: this.cur_page,
        size: "20"
      };
      // console.log("日期时间",this.daterange);
      post.topicPicList(data, res => {
        console.log("图片列表", res);
        if (res.status == 200) {
          this.loading2=false;
          this.topicPicList = res.data.content;
          this.totalElements = res.data.totalElements;
          this.img = res.data.content;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //获取帖子的视频集合
    getVideolist(){
      let data = {
        clazzId: this.clazzId,
        startTime: this.startTime,
        finishTime: this.finishTime,
        number: this.cur_page,
        size: "20"
      };
      post.gettopicVideo(data, res => {
        console.log("视频列表", res);
        if(res.status==200){
          this.loading3=false;
          this.topicvideoList=res.data.content;
          this.totalElements = res.data.totalElements;
        }
        
      });
    },
    //删除帖子视频
    deletePicvideo(id){
      let str = "确定要删除吗？";
      delTip(this, str, this.deletevideo, id);
    },
    deletevideo(batchId){
      let _this = this;
      let data = {
        batchId: batchId,
        clazzId:this.clazzId,
      };

      post.deletePicvideo(data, res => {
        // console.log("删除帖子图片",res);
        if (res.status == 200) {
          this.$message({
            type: "success",
            message: "删除成功",
            duration: 1000,
            onClose() {
              _this.getVideolist();
            }
          });
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //贴子视频关闭
    videoClose() {
        document.getElementById("myVideo").pause();
        this.videourl = '';
        this.viewVideoShow=false
        
    },
    //帖子视频播放
    playvideo(val){
      this.videourl=val;
      this.viewVideoShow=true;
    },
    handlePicDel(id) {
      let str = "确定要删除吗？";
      delTip(this, str, this.picDel, id);
    },
    picDel(batchId) {
      let _this = this;
      let data = {
        batchId: batchId,
        clazzId:this.clazzId,
      };

      post.topicDelPic(data, res => {
        // console.log("删除帖子图片",res);
        if (res.status == 200) {
          this.$message({
            type: "success",
            message: "删除成功",
            duration: 1000,
            onClose() {
              _this.getPicList();
            }
          });
        } else {
          this.$message.error(res.message);
        }
      });
    },
    showmodel(index) {
      this.$refs.number.getpassindex(index);
    }
  },
  components: {
    breadCrumb,
    stuMsg,
    imgView,
    Goback,
    Modal,
  }
};
</script>