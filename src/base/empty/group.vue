<template>
  <div>
    <Goback :passtitle="passtitle"></Goback>
    <div class="round-layout">
      <div class="j-group-empty ">
        <h2><span class="icon-empty"></span>
          <span class="ml14">您还没有分组！您可以选择随机分组 或 自定义小组</span>
        </h2>
        <div class="j-content clearfix">
          <div class="left">
            <h2 @click="grouprandom = true">
               随机分组
              <p>设置组数后<br/>系统自动划分小组</p>
            </h2>
          </div>
          <div class="middle"></div>
          <div class="right clearfix">
            <h2 >
              自定义分组
              <p>导入分组或创建分组后<br/>手动添加学员到小组</p>
            </h2>
            <a class="btn-pop green" href="javascript:;" @click="groupImport = true">导入</a>
            <a class="btn-pop blue" href="javascript:;" @click="groupcreat = true">创建</a>
          </div>
        </div>
        <!-- 导入分组 -->
        <group-import
          :dialogImportgroup.sync="groupImport"
          :clazzId="clazzId"
          :groupCeates="groupCeates"></group-import>
        <!--新建分组-->
        <group-create
          :dialogCreateGroup.sync="groupcreat"
          :groupCeates="groupCeates"
        >
        </group-create>

        <!--随机分组-->
        <group-random
          :dialogCreateRandom.sync="grouprandom"
          :groupCeates="groupCeates"
        >
        </group-random>

      </div>
    </div>
    
  </div>
</template>
<script>
  import groupCreate from "components/clazz/group/create"
  import breadCrumb from 'components/course/breadcrumb'
  import groupRandom from 'components/clazz/group/random'
  import groupImport from "components/clazz/group/import_group"
  import Goback from 'base/goback/goback'
export default {
  data(){
    return{
      clazzId:"",
      groupcreat:false,
      grouprandom:false,
      groupImport: false,
      groupCeates:"1",
      passtitle:'分组管理',
    }
  },
  created(){
    this.clazzId = this.$route.query.clazzId;
  },
  methods:{

  },
  components:{
    groupCreate,
    breadCrumb,
    groupRandom,
    groupImport,
    Goback
  }
}
</script>
<style scoped="" lang="less">

  .j-group-empty{
    
    width: 570px;
    height: 420px;
    margin:0 auto;

    h2{
      line-height: 124px;
      font-size: 18px;
      color: #666;

    }
    .icon-empty{
      background: url("../../assets/img/icon/icon-sad.png") no-repeat;
      display: inline-block;
      width: 45px;
      height: 44px;
      display: inline-block;
      vertical-align: middle;
    }
    .j-content{
      .left{
         float: left;
         background: url("../../assets/img/clazz/group-custom.png") no-repeat;
         width: 246px;
         height: 223px;
         h2{
           text-align: center;
           line-height: 78px;
           font-size: 20px;
           color: #fff;
           cursor: pointer;
         }
         p{
           margin-top: 36px;
           color: #999;
           line-height:24px;
           font-size: 14px;
           text-align: center;
         }
      }
      .middle{
        float: left;
        width: 1px;
        height: 78px;
        background:#eee;
        overflow: hidden;
        margin:65px 0 0 41px;
      }
      .right{
        float: right;
        background: url("../../assets/img/clazz/group-random.png") no-repeat;
        width: 246px;
        height: 223px;
        cursor: pointer;
        &:hover {
          height: 263px;
          background: url("../../assets/img/clazz/group-random1.png") no-repeat;
          .btn-pop {
            display: block;
          }
        }
        .btn-pop {
          display: none;
          float: left;
          width: 50%;
          height: 42px;
          font-size: 14px;
          text-align: center;
          line-height: 40px;
        }
        h2{
          text-align: center;
          line-height: 78px;
          font-size: 20px;
          color: #fff;
          cursor: pointer;
          margin-bottom: 42px;
        }
        p{
          margin-top: 36px;
          color: #999;
          line-height:24px;
          font-size: 14px;
          text-align: center;
        }
      }

      
      .green {
        color: #009791;
      }
      .blue {
        color: #1077D7;
      }
    }
  }
</style>
