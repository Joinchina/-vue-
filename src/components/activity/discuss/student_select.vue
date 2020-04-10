<style scoped="">
  @import "../../../assets/reset-element-ui/form.css";
  .select_student{
    width: 576px;
    margin: 0 auto;
  }

</style>
<template>
  <div >
    <el-dialog class="dialog-form selectStudent" title="选择成员"
               :filter-method="filterMethod"
               :visible.sync="dialogStudentSelect"
               :close-on-click-modal="false"
               :before-close="close"
               @open="open" >
      <div class="select_student">
        <el-transfer
          filterable
          filter-placeholder="请选择学员列表"
          v-model="value2"
          :data="data2"
          @change="handleChange"
          :titles="groupTitles">
          <!--:titles="['学员列表', '已选学员列表']">-->

        </el-transfer>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确定</el-button>
        <el-button @click="close">关闭</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
  import model from 'model/activity/result'
  import group from 'model/clazz/group'
  import bus from '../../../global/bus'
  export default {
    data() {
      return {
        newData:[],
        confirmData:[],
        studentIds:[],
        groupTitle:[],
        data2: [],
        value2: [],
        obj:{}
      };
    },
    created(){
      var _this = this;

      //选择成员清空
      bus.$on("studentEmpty",function () {
        _this.newData = [];
        _this.confirmData = [];
        _this.studentIds=[];
        _this.groupTitle=[];
        _this.data2 = [];
        _this.value2 = [];
        _this.obj = {};

        //作业、讨论组 选择成员
        if(!!_this.createGroupStudent){
          _this.getGroupList();
        }else{
          _this.getStundentList();
        }

      })
      // 设置已选中
      // this.selValue();

    },
    props:["dialogStudentSelect","groupTitles","clazzId",'sel','empty',"createGroupStudent","selectGroups"],
    methods:{
      open() {
          // 清空重复数据
          this.newData = [],
          this.confirmData = [],
          this.studentIds = [],
          this.groupTitle = [],
          this.data2 = [],
          this.value2 = [],
          this.obj = {}
          //作业、讨论组 选择成员
          if(!!this.createGroupStudent){
            this.getGroupList();
          }else if(this.selectGroups){
            this.getGroups();
          }else{
            this.getStundentList();
          }

        //console.log("selsel", this.sel);
         this.selValue();



          
      },
      selValue() {
        if(this.sel&&!this.selectGroups) {
          this.value2 = this.sel;
        } else if(this.empty) {
          this.value2 = [];
        }
      },
      getGroupList(){
        var _this = this;
        var clazzId = this.$route.query.clazzId;
        var data = {
          clazzId:clazzId
        }
        group.groupUngroupedNo(data, ( res => {
          _this.showSuccess(res);
        }))
      },
      getGroups(){
        var clazzId = this.$route.query.clazzId;
        var data = {
          clazzId:clazzId
        }
        group.groupList(data, ( res => {
          this.showSuccess(res);
        }))
      },
      getStundentList () {
        var _this = this;
        var clazzId = this.$route.query.clazzId;
        var data = {
          clazzId:clazzId
        }
        model.stundentList(data, ( res => {
          _this.showSuccess(res);
        }))
      },
      submitForm(){
        //小组成员添加 - 选择成员
        if(this.selectGroups){
          this.$emit("getGroupUser",this.confirmData);
        }else{
          this.$emit("StudentSelectData",this.confirmData);
        }
        this.confirmData = [];
        this.close();
      },
      showSuccess(res){
        var _this = this;
        if( res.status == 200) {
          let data = res.data;
          data.forEach(function (item,index) {
            var obj = {
              name:item["name"],
              id: _this.selectGroups?item["groupId"]:item["id"]
            }
            _this.newData.push(obj);
            _this.obj[obj.id]=obj.name


          })
          const cities =  _this.newData;
          const pinyin = _this.newData;
          cities.forEach((city, index) => {
            this.data2.push({
              label: city["name"],
              key: city["id"]
              //pinyin: pinyin[index]
            });
          });
          console.log(this.data2);
        }else{
          this.$message.error(res.message);
        }

      },
      handleChange(value, direction, movedKeys) {
      //  console.log("value"+value, "direct"+direction, "move"+movedKeys);
      //  console.log(this.obj)
       // console.log(typeof value)

        this.confirmData = [];
        this.studentIds = [];
        for(var i=0,len=value.length;i<len; i++){
            var name = this.obj[value[i]];
            var objs = {
              name:name,
              id:value[i]
            }

          this.confirmData.push(objs);
          this.studentIds.push(value[i]);
        }
      },

      filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1;
      },
      close() {
        this.$emit('update:dialogStudentSelect', false);
      },
    },
    beforeDestroy() {
      bus.$off("discussCreate");
    },
    // watch: {
    //   sel: 'selValue'
    // }

  }
</script>

