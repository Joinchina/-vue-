<template>
    <div class="recordbox">
        <div class="clazzbox" v-for="(item,index) in expertinfo.expertCourses" :key="index">
            <div class="topbtn">
                课程{{index | dexid}}
            </div>
            <h1>
                {{item.name}}
            </h1>
            <div class="biaoqian">
                <div class="biaobox">
                    <i><img src="../../assets/img/expert/jiao.png" alt=""></i>
                    理论课程{{item.name}}
                </div>
                <div class="biaobox">
                    <i><img src="../../assets/img/expert/n.png" alt=""></i>
                    课程人数：{{item.studentCount}}
                </div>
                <div class="biaobox">
                    <i><img src="../../assets/img/expert/lei.png" alt=""></i>
                    项目类型：{{item.projectType}}
                </div>
                <div class="biaobox">
                    <i><img src="../../assets/img/expert/man.png" alt=""></i>
                    受训人员类型：{{item.studentType}}
                </div>
            </div>
            <div class="allscore2">
                <h2>综合：</h2>
                <el-rate
                    v-model="item.total"
                    disabled
                    show-score
                    text-color="#ff9900"
                    :colors="['#FD7E23','#FD7E23','#FD7E23']"
                    score-template="{value}">
                </el-rate>
            </div>
            <div class="onescore">
                <div class="star">
                    <h3>内容创新性：</h3>                    
                    <el-rate
                        v-model="item.novelty"
                        disabled
                        show-score
                        text-color="#ff9900"
                        :colors="['#FD7E23','#FD7E23','#FD7E23']"
                        score-template="{value}">
                    </el-rate>
                </div>
                <div class="star">
                    <h3>内容实用性：</h3>
                    <el-rate
                        v-model="item.practicability"
                        disabled
                        show-score
                        text-color="#ff9900"
                        :colors="['#FD7E23','#FD7E23','#FD7E23']"
                        score-template="{value}">
                    </el-rate>
                </div>
                <div class="star">
                    <h3>课堂互动：</h3>
                    <el-rate
                        v-model="item.interaction"
                        disabled
                        show-score
                        text-color="#ff9900"
                        :colors="['#FD7E23','#FD7E23','#FD7E23']"
                        score-template="{value}">
                    </el-rate>
                </div>
                <div class="star">
                    <h3>授课技巧：</h3>
                    <el-rate
                        v-model="item.skill"
                        disabled
                        show-score
                        text-color="#ff9900"
                        :colors="['#FD7E23','#FD7E23','#FD7E23']"
                        score-template="{value}">
                    </el-rate>
                </div>
            </div>
            <div class="biaoqian2">

                    <span>学员评价：{{item.evaluate}}</span>

            </div>
        </div>
    </div>
</template>
<script>
import rate from './rate'
export default {
   data () {
       return {
          
       }
   },
   filters:{
       dexid(val){
           console.log(val)
           switch (val) {
               
                case 0:
                   return val="一" 
                   break;
                case 1:
                   return val="二" 
                   break;
                case 2:
                   return val="三" 
                   break;
                case 3:
                   return val="四" 
                   break;
                case 4:
                   return val="五" 
                   break;
                case 5:
                   return val="六" 
                   break;
                case 6:
                   return val="七" 
                   break;
                case 7:
                   return val="八" 
                   break;
                case 8:
                   return val="九" 
                   break;
                case 9:
                   return val="十" 
                   break;
                case 10:
                   return val="十一" 
                   break;
                case 11:
                   return val="十二" 
                   break;
                case 12:
                   return val="十三" 
                   break;
                case 13:
                   return val="十四" 
                   break;
                case 14:
                   return val="十五" 
                   break;
                case 15:
                   return val="十六" 
                   break;
                case 16:
                   return val="十七" 
                   break;
                case 17:
                   return val="十八" 
                   break;
                case 18:
                   return val="十九" 
                   break;
                case 19:
                   return val="二十" 
                   break;
                

           }
       }
   },
   props:['expertinfo'],
   components:{
       rate,
   } 
}
</script>
<style lang="less" >
.recordbox{
    width:1190px;
    margin: 0 auto;
    .clazzbox{
        width: 900px;
        box-shadow: 0 1px 12px 0 rgba(0,0,0,0.10);
        margin: 0 auto;
        background: url('../../assets/img/expert/line.png') top left no-repeat;
        background-size: cover;
        border-radius: 30px;
        margin-top: 40px;
        float: left;
        position: relative;
        margin-left: 145px;
        margin-bottom: 20px;
        .topbtn{
            background: #06CA96;
            border-radius: 30px;
            width: 123px;
            height: 39px;
            font-size: 18px;
            color: #FFFFFF;
            letter-spacing: 0;
            line-height: 39px;
            text-align: center;
            position: absolute;
            left: 50%;
            margin-left: -61px;
            top: -19px;
        }
        h1{
            border-left:4px solid #35A69D;
            font-size: 20px;
            color: #333333;
            letter-spacing: 0;
            line-height: 20px;
            margin-top: 50px;
            margin-left: 20px;
            padding-left: 10px; 
        }
        .biaoqian{
            width: 100%;
            overflow: hidden;
            margin-left: 34px;
            margin-top: 22px;
            .biaobox{
                float: left;
                i{
                    width: 12px;
                    height: 12px;
                    img{
                        max-height: 12px;
                    }
                }
                font-size: 14px;
                color: #666666;
                margin-right: 32px;
            }
                 
        }
        .allscore2{
            width: 100%;
            margin-top: 26px;
            margin-left: 34px;
            h2{
                font-size: 20px;
                color: #FD7E23;
                float: left;
            }
            .el-rate__icon {
                font-size:20px;
            }
            .el-rate__text{
                font-size:16px;
            }
            .el-rate{
                margin-top: 4px;
                float: left;
            }
        }
        .onescore{                
            overflow: hidden;
            width: 100%;
            margin-left: 34px;
            margin-top: 16px;
            .star{
                width: 220px;
                margin-top: 10px;
                overflow: hidden;
                h3{
                    font-size: 14px;
                    color: #333333;
                    float: left;
                }
                .ratestar{
                    float: left;
                    margin-top: 2px;
                }
                .el-rate__icon{
                        font-size: 12px;
                    }
                .el-rate{
                    // margin-top: 2px;
                }    
            }
        }
        .biaoqian2{
            width: 870px;
            overflow: hidden;
            padding: 20px 0 20px 34px;
            font-size: 14px;
            color: #333333;
            word-break: break-all;
            button{
                border: 1px solid #84CAC3;
                border-radius: 4px;
                font-size: 14px;
                color: #009791;
                background-color: rgba(0, 0, 0, 0);
                padding:3px 11px
            }
        }      
    }
}
</style>


