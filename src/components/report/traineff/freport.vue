<template>
	<div class="app" v-loading="loading2">
  <div class="loading" v-show="!loading2">
		<section class="handle clearfix">
			<Goback passtitle="学员成果报告" ></Goback>
			<p class="right">
				<span class="tip">注:实时数据,集中培训结束30天后数据停止更新</span>
        <span class="btn-gray" v-show = "!reportBtnFlag">
						报告生成中......
					</span>
				<button class="btn-green" type="button"  @click="exportHomePage" v-show = "reportBtnFlag">
					<i class="icon-export-white"></i>
					导出
				</button>
			</p>
		</section>
		<div class="title">
			<h1>{{curClazzName}}</h1>
		</div>    
		<div class="results">
            <h1>学员成果情况：</h1>
			<div class="resbox">
				<ul>
					<li>
						<h1>作业完成总数<span>{{homeworkall}}</span>个</h1>
						<div class="red">
							<h2>非精品数</h2>
							<h3>{{nohomework}}</h3>
						</div>
						<div class="green">
							<h2>精品数</h2>
							<h3>{{excellentHomeworkCount}}</h3>
						</div>
						<div class="clear"></div>
						<div class="redunder">
              <h2>{{excellentHomeworkCount}}</h2>
							<h3>优秀作业</h3>
						</div>
						<div class="greenunder">
              <h2>{{homeworklv}}</h2>
							<h3>优秀作业率</h3>
						</div>
					</li>
					<i></i>
					<li>
						<h1>照片墙提交总数<span>{{photoWallCount}}</span>个</h1>
						<div class="yellow">
							<h2>非精品数</h2>
							<h3>{{nophoto}}</h3>
						</div>
						<div class="zi">
							<h2>精品数</h2>
							<h3>{{likePhotoWallCount}}</h3>
						</div>
						<div class="clear"></div>
						<div class="yelunder">
                            <h2>{{likePhotoWallCount}}</h2>
							<h3>被点赞照片</h3>
						</div>
						<div class="ziunder">
                            <h2>{{photolv}}</h2>
							<h3>照片点赞率</h3>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<div class="clear"></div>
	    <div class="homework">
            <h1>优秀作业：</h1>
			<el-table
				stripe
				class="list"
			    :data="tableData">
			    <el-table-column
				type="index"
				label="序号"
				width="">
				</el-table-column>
			    <el-table-column
			      	prop="userName"
			      	label="姓名"
			      	width="122">
			    </el-table-column>
			    <el-table-column
			      	prop="userPhone"
			      	label="联系电话"
			      	width="122">
              <template slot-scope="scope">
						   <span>{{scope.row.userPhone | photo}}</span>
					    </template>
			    </el-table-column>
			    <el-table-column
			      	prop="userWorkPlace"
			      	label="单位"
			      	width="183">
              <template slot-scope="scope">
						   <span>{{scope.row.userWorkPlace | work}}</span>
					    </template>
			    </el-table-column>
			    <el-table-column
			      	prop="title"
			      	label="作业标题"
			      	width="244">
			    </el-table-column>
			    <el-table-column
			      	prop="activityTitle"
			      	label="作业要求标题"
			      	width="183">
			    </el-table-column>
			    <el-table-column
			      	prop=""
			      	label="操作"
			      	width="122">
					  <template slot-scope="scope">
						  <el-button type="text" @click="viewhomework(scope.row)">查看</el-button>
					  </template>
			    </el-table-column>
			</el-table>
			<!-- <p class="page-sum">共{{totalElements}}条 每页20条</p> -->
			<!-- 分页 -->
			<!-- <div class="pagination">
		      	<el-pagination
		        	@current-change ="handleCurrentChange"
		        	layout="prev, pager, next"
		        	:page-size ="20"
		        	:total="totalElements">
		      	</el-pagination>
		    </div> -->
		</div>
		<div class="imgbox">
             <h1>精华照片：</h1>			 
			 <div class="picture" >
                <ul>
					<li v-for="(picture,index) in img" :key="index" >
						<i @click="showmodel(index)"><img :src="picture.url" alt=""></i>
						<h4>{{picture.content}}</h4>
						<h5>上传人：{{picture.name}}</h5>
						<h3>赞  {{picture.likeCount}}</h3>
					</li>
				</ul>
			 </div>
			 <h2 v-show="img.length==0">还没有照片哦~~</h2>
		</div>
    <!-- 图表展示 -->
    <div id="maptable" :style="{width:'1155px',height:'400px'}" style="display:none"></div>
		<!-- 图片预览组件 -->
		<imgView :passimg="img" ref="number"></imgView>
    <!-- 导出报告 -->
			<formsSummit
				:methods = "formObj.method"
				:urls = "formObj.urls"
				:data = "formObj.data" ref="form">
			</formsSummit>
	
    </div>
  </div>
</template>
<script>
// 引入 ECharts 主模块
let echarts = require("echarts/lib/echarts");
// 引入饼图组件
require("echarts/lib/chart/pie");
// 引入柱状图
require("echarts/lib/chart/bar");
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/visualMap");
// 引入图片预览组件
import imgView from "@/base/modal/imgview";
import model from "model/clazz/list";
import model2 from "model/report/stu";
import formsSummit from "components/formsumit/form";
import API from "@/global/resource";
import { getToken } from "@/filters/userVerify";

import Goback from 'base/goback/goback'

export default {
  data() {
    return {
      classid: "",
      classname: "默认",
      classlogo: "默认",
      tableData: [],
      totalElements: 0,
      excellentHomeworkCount: 0, //优秀作业数
      homeworkCount: 0, //作业
      homeworkall:0,//作业总数
      homeworkFinishedCount:0,
      nohomework: 0, //非精品作业
      homeworklv: 0,
      likePhotoWallCount: 0, //被点赞照片数
      photoWallCount: 0, //照片
      nophoto: 0, //非精品照片
      photolv: 0,
      img: [],
      loading2: true,
      chartArray: {}, // 导出echarts 数组
      reportBtnFlag: false, // 导出报告生成中
      reportBtnSeconds: 5,
      formObj: {
        method: "post",
        data: {},
        urls: ""
      }
    };
  },
  filters: {
  photo: function (value) {
    if(value!=''){
      return value
    }else{
      return '无'
    }
  },
 work: function (value) {
    if(value!=''){
      return value
    }else{
      return '暂无单位信息'
    }
  },
},
  computed: {
    curClazzName() {
      return this.$store.getters.showCurClazzName;
    }
  },
  created() {
    this.classid = this.$route.query.clazzId;
    this.studentStudyResult();
    this.clazzInfo();
    this.reportShow(); //导出功能倒计时
    this.formObj.urls = API.urls.reportStudyResult; //导出接口

  },
  mounted(){
    // 更改暂无数据数据时的显示问题
    let emptyblock =document.getElementsByClassName("el-table__empty-block")[0].children[0];
    emptyblock.innerText='还没有优秀作业额~~快去评阅学员作业吧~~~';
  },
  methods: {
    reportShow() {
      if (this.reportBtnSeconds <= 0) {
        this.reportBtnFlag = true;
      } else {
        this.reportBtnSeconds--;
        setTimeout(() => {
          this.reportShow();
        }, 1000);
      }
    },
    //导出报告
    exportHomePage() {
      if(!this.$store.getters.getOrgVipInfo.vip){
        this.$store.state.vipFuncPopFalg = true;
        return;
      }
      //form提交组件
      let data = {
        clazzId: this.classid,
        token: getToken()
      };
      for (var i in this.chartArray) {
        data[i] = this.chartArray[i].getDataURL({
          pixelRatio: 1,
          backgroundColor: "#fff"
        });
      }

      this.formObj.data = data;
      // console.log("导出图片数据", this.formObj.data);
      this.$refs.form.submitData();

    },
    showmodel(index) {
      this.$refs.number.getpassindex(index);
    },
    // 获取头像信息
    clazzInfo() {
      let data = {
        id: this.classid
      };
      model.getClassInfor(data, res => {
        // console.log(res.data)
        if (res.status == 200) {
          this.classname = res.data.name;
          this.classlogo = res.data.logo;
        } else {
          this.$message.error(res.message);
        }
      },false);
    },
    //获取学员成果
    studentStudyResult() {
      let data = {
        clazzId: this.classid,
      };
      model2.studentStudyResult(data, res => {
        if (res.status == 200) {
          // console.log(res.data);
          console.log("res============",res);
          this.excellentHomeworkCount = res.data.excellentHomeworkCount; //优秀作业数
          this.homeworkCount = res.data.homeworkCount; //作业
          this.homeworkFinishedCount=res.data.homeworkFinishedCount;
          this.homeworkall=this.homeworkFinishedCount;
          this.likePhotoWallCount = res.data.likePhotoWallCount; //被点赞照片数
          this.photoWallCount = res.data.photoWallCount; //照片数 
          this.imgfilter(res.data.photoWallList);//照片列表
          this.tableData = res.data.homeworkList; //作业列表
          this.proficiency(); //计算优秀率
          this.maptable();
          this.loading2 = false;
        } else {
          this.$message.error(res.message);
        }
      },false);
    },
    // 照片列表过滤，点赞为0时，不显示
    imgfilter(data){
        //  声明一个新数组用来存储数据
         let newArr=[];
         for (let i = 0; i < data.length; i++) {
            if(data[i].likeCount!=0){
              newArr.push(data[i]);
            }
         };
         this.img=newArr;
    },
    //点击作业跳转
    viewhomework(row) {
      let homeworkid = row.id;
      let activityId=row.activityId;
      let courseId=row.courseId;
      // console.log(homeworkid)
      // detail?clazzId=538&courseId=1991&activityId=16429&homeworkId=2713&crumb2=work
      window.open(
        "/index.html#/activity/homework/detail?clazzId=" +this.classid+"&courseId="+courseId+"&activityId="+activityId+"&homeworkId="+homeworkid+"&crumb2=work"
      );
    },
    //计算优秀率
    proficiency() {
      // 作业优秀率
      let homeworklv =this.excellentHomeworkCount / this.homeworkCount * 100;
      if (homeworklv.toString() == "NaN") {
        this.homeworklv = "0.00" + "%";
      } else {
        homeworklv=Math.round(homeworklv * 100) / 100;
        this.homeworklv=homeworklv.toFixed(2)+'%';
      }
      //非精品作业数
      this.nohomework = this.homeworkCount - this.excellentHomeworkCount;
      // 照片优秀率
      let photolv = this.likePhotoWallCount / this.photoWallCount * 100 ;
      if (photolv.toString() =="NaN") {
        this.photolv = "0.00"+ "%";
      } else {
        photolv=Math.round(photolv * 100) / 100;
        this.photolv=photolv.toFixed(2)+'%';
      }
      // 非精品照片数
      this.nophoto= this.photoWallCount - this.likePhotoWallCount;
    },
    //图表
    maptable() {
      let maptable = echarts.init(document.getElementById("maptable"));
      this.chartArray["studyResultPicture"] = maptable;
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["总数", "精品"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          min: 0,
          max: 600,
          interval: 100
        },
        yAxis: {
          type: "category",
          data: ["作业", "照片"]
        },
        series: [
          {
            name: "总数",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight",
                textStyle: {
                  color: "#333"
                }
              }
            },
            itemStyle: {
              normal: {
                color: "#73aef4"
              }
            },
            barWidth: 60,
            data: [this.homeworkCount, this.photoWallCount]
          },
          {
            name: "精品",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight",
                textStyle: {
                  color: "#333"
                }
              }
            },
            itemStyle: {
              normal: {
                color: "#ffc79c"
              }
            },
            data: [this.excellentHomeworkCount, this.likePhotoWallCount]
          }
        ]
      };
      maptable.setOption(option, true);
    }
  },
  components: {
    imgView,
    formsSummit,
    Goback
  }
};
</script>
<style scoped lang="less">
@import "../../../assets/less/icon.less";
@import "../../../assets/less/btn-search.less";
@import "../../../assets/reset-element-ui/user-table.css";
@import "../../../assets/less/report.less";
.app {
  width: 100%;
  // overflow: hidden;
  .clear {
    clear: both;
  }
  .title {
    width: 100%;
    h1 {
      font-size: 24px;
      color: #000000;
      float: left;
      margin: -3px 0 0 0px;
    }
  }
  .results {
    clear: both;
    float: left;
    width: 100%;
    height: 577px;
    background-color: #ffffff;
    margin-top: 30px;
    box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.03);
    h1 {
      font-size: 22px;
      color: #333333;
      margin: 28px 0 0 28px;
    }
    .resbox {
      width: 100%;
      overflow: hidden;

      ul {
        width: 100%;
        position: relative;
        li {
          float: left;
          width: 50%;
          h1 {
            font-size: 22px;
            color: #856245;
            letter-spacing: 0;
            line-height: 22px;
            margin: 50px 0 0 180px;
            span {
              font-size: 38px;
              color: #e1663d;
              letter-spacing: 0;
              line-height: 36px;
            }
          }
          .red {
            width: 150px;
            height: 150px;
            border-radius: 150px;
            background: #fbcfcf;
            margin: 30px 0 0 156px;
            float: left;
            h2 {
              font-size: 20px;
              color: #856245;
              text-align: center;
              margin-top: 50px;
            }
            h3 {
              font-size: 24px;
              color: #856245;
              text-align: center;
              margin-top: 16px;
            }
          }
          .green {
            width: 150px;
            height: 150px;
            border-radius: 150px;
            background: rgba(58, 209, 160, 0.3);
            float: left;
            margin: 30px 0 0 -20px;
            h2 {
              font-size: 20px;
              color: #856245;
              text-align: center;
              margin-top: 50px;
            }
            h3 {
              font-size: 24px;
              color: #856245;
              text-align: center;
              margin-top: 16px;
            }
          }
          .redunder {
            width: 100px;
            overflow: hidden;
            float: left;
            margin: 0 0 0 182px;
            h2 {
              font-size: 24px;
              color: #333333;
              text-align: center;
              margin-top: 66px;
            }
            h3 {
              font-size: 18px;
              color: #666666;
              text-align: center;
              margin-top: 26px;
            }
          }
          .greenunder {
            float: left;
            overflow: hidden;
            float: left;
            margin: 0 0 0 36px;
            h2 {
              font-size: 24px;
              color: #333333;
              text-align: center;
              margin-top: 66px;
            }
            h3 {
              font-size: 18px;
              color: #666666;
              text-align: center;
              margin-top: 26px;
            }
          }
          .yellow {
            width: 150px;
            height: 150px;
            border-radius: 150px;
            background: #ffeba6;
            margin: 30px 0 0 156px;
            float: left;
            h2 {
              font-size: 20px;
              color: #856245;
              text-align: center;
              margin-top: 50px;
            }
            h3 {
              font-size: 24px;
              color: #856245;
              text-align: center;
              margin-top: 16px;
            }
          }
          .zi {
            width: 150px;
            height: 150px;
            border-radius: 150px;
            background: rgba(57, 101, 196, 0.3);
            float: left;
            margin: 30px 0 0 -20px;
            h2 {
              font-size: 20px;
              color: #856245;
              text-align: center;
              margin-top: 50px;
            }
            h3 {
              font-size: 24px;
              color: #856245;
              text-align: center;
              margin-top: 16px;
            }
          }
          .yelunder {
            width: 100px;
            overflow: hidden;
            float: left;
            margin: 0 0 0 182px;
            h2 {
              font-size: 24px;
              color: #333333;
              text-align: center;
              margin-top: 66px;
            }
            h3 {
              font-size: 18px;
              color: #666666;
              text-align: center;
              margin-top: 26px;
            }
          }
          .ziunder {
            float: left;
            overflow: hidden;
            float: left;
            margin: 0 0 0 36px;
            h2 {
              font-size: 24px;
              color: #333333;
              text-align: center;
              margin-top: 66px;
            }
            h3 {
              font-size: 18px;
              color: #666666;
              text-align: center;
              margin-top: 26px;
            }
          }
        }
        i {
          float: left;
          width: 1px;
          height: 327px;
          opacity: 0.66;
          background-color: #e0dfdf;
          position: absolute;
          top: 110px;
        }
      }
    }
  }
  .homework {
    width: 100%;
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.03);
    margin-top: 28px;
    padding: 24px 47px;
    h1 {
      font-size: 22px;
      color: #333333;
      margin: 28px 0 28px 0;
    }
    .page-sum {
      font-size: 14px;
      color: #666;
      text-align: right;
      padding-top: 15px;
    }
  }
  .imgbox {
    width: 100%;
    background: #ffffff;
    box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.03);
    margin-top: 24px;
    margin-bottom: 24px;
    padding: 0 0px 0 32px;
    overflow: hidden;
    h1 {
      font-size: 22px;
      color: #333333;
      margin: 28px 0 0 0;
    }
    h2 {
      width: 100%;
      text-align: center;
      font-size: 18px;
      color: #999999;
      margin: 45px 0 45px 0;
    }
    .picture {
      width: 100%;
      overflow: hidden;
      margin-bottom: 20px;
      ul {
        width: 100%;
        li {
          width: 362px;
          height: 412px;
          border: 1px solid #cee7e5;
          box-shadow: 0 0 7px 0 rgba(204, 204, 204, 0.44);
          float: left;
          margin-right: 20px;
          margin-top: 20px;
          i {
            width: 360px;
            height: 300px;
            display: block;
            overflow: hidden;
            position: relative;
            cursor: pointer;
            img {
              height: 300px;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
          h4 {
            font-size: 16px;
            color: #333333;
            letter-spacing: 0;
            text-align: left;
            line-height: 26px;
            width: 100%;
            padding-left: 10px;
            padding-right: 10px;
            margin-top: 10px;
            height: 70px;
          }
          h5 {
            float: left;
            font-size: 14px;
            color: #666666;
            padding-left: 10px;
          }
          h3 {
            float: right;
            font-size: 14px;
            color: #666666;
            padding-right: 10px;
          }
        }
      }
    }
  }
}
</style>